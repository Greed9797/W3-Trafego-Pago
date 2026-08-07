import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  getSupabaseConfig,
  getAutoblogSettings,
  isDraftPublishable,
  supabaseRequest,
  type AutoblogEnvironment,
  type DraftContent,
} from '../../_lib/autoblog.ts'
import { hasAdminAccess } from '../../_lib/admin-session.ts'

type StoredDraft = {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  content: DraftContent
  source_url: string
  source_collected_at: string
  status: 'draft'
}

function sendJson(res: VercelResponse, status: number, body: unknown) {
  return res.status(status).json(body)
}

function isUuid(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

function getDraftId(body: unknown) {
  if (!body || typeof body !== 'object') return ''
  const id = (body as Record<string, unknown>).id
  return isUuid(id) ? id : ''
}

export async function handleApproval(
  req: Pick<VercelRequest, 'method' | 'headers' | 'body'>,
  res: VercelResponse,
  env: AutoblogEnvironment = process.env,
  now = new Date(),
) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'method_not_allowed' })
  const settings = getAutoblogSettings(env)
  if (!hasAdminAccess(req.headers, settings, now)) return sendJson(res, 401, { error: 'unauthorized' })

  const config = getSupabaseConfig(settings)
  if (!config) return sendJson(res, 503, { error: 'autoblog_not_configured' })

  const id = getDraftId(req.body)
  if (!id) return sendJson(res, 422, { error: 'invalid_draft_id' })

  try {
    const drafts = await supabaseRequest<StoredDraft[]>(
      config,
      `blog_posts?id=eq.${encodeURIComponent(id)}&status=eq.draft&select=id,title,slug,excerpt,category,content,source_url,source_collected_at,status&limit=1`,
    )
    const draft = drafts[0]
    if (!draft || !isDraftPublishable({
      title: draft.title,
      slug: draft.slug,
      excerpt: draft.excerpt,
      category: draft.category,
      content: draft.content,
      sourceUrl: draft.source_url,
      sourceCollectedAt: draft.source_collected_at,
    })) {
      return sendJson(res, 422, { error: 'draft_not_found_or_invalid' })
    }

    await supabaseRequest(config, `blog_posts?id=eq.${encodeURIComponent(id)}&status=eq.draft`, {
      method: 'PATCH',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({ status: 'published', published_at: now.toISOString(), updated_at: now.toISOString() }),
    })

    return sendJson(res, 200, { id, status: 'published', publishedAt: now.toISOString() })
  } catch {
    return sendJson(res, 502, { error: 'approval_failed' })
  }
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  return handleApproval(req, res, process.env)
}
