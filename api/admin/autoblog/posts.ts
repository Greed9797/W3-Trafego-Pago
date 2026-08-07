import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  getAutoblogSettings,
  getSupabaseConfig,
  supabaseRequest,
  type AutoblogEnvironment,
  type DraftContent,
} from '../../_lib/autoblog.js'
import { hasAdminAccess } from '../../_lib/admin-session.js'

type AdminPost = {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  kind: 'evergreen' | 'platform-update'
  status: 'draft' | 'scheduled' | 'published'
  keyword: string | null
  content: DraftContent
  source_url: string | null
  source_collected_at: string | null
  scheduled_for: string | null
  published_at: string | null
  created_at: string
}

const ALLOWED_STATUSES = new Set(['draft', 'scheduled', 'published', 'all'])

function sendJson(res: VercelResponse, status: number, body: unknown) {
  res.setHeader('Cache-Control', 'no-store')
  return res.status(status).json(body)
}

function getStatus(req: Pick<VercelRequest, 'url'>) {
  try {
    const value = new URL(req.url ?? '/', 'https://w3-admin.local').searchParams.get('status') ?? 'draft'
    return ALLOWED_STATUSES.has(value) ? value : ''
  } catch {
    return ''
  }
}

export async function handlePosts(
  req: Pick<VercelRequest, 'method' | 'headers' | 'url'>,
  res: VercelResponse,
  env: AutoblogEnvironment = process.env,
  now = new Date(),
) {
  if (req.method !== 'GET') return sendJson(res, 405, { error: 'method_not_allowed' })

  const settings = getAutoblogSettings(env)
  if (!hasAdminAccess(req.headers, settings, now)) return sendJson(res, 401, { error: 'unauthorized' })

  const status = getStatus(req)
  if (!status) return sendJson(res, 422, { error: 'invalid_status' })

  const config = getSupabaseConfig(settings)
  if (!config) return sendJson(res, 503, { error: 'autoblog_not_configured' })

  try {
    const statusFilter = status === 'all' ? '' : `status=eq.${status}&`
    const posts = await supabaseRequest<AdminPost[]>(
      config,
      `blog_posts?${statusFilter}select=id,slug,title,excerpt,category,kind,status,keyword,content,source_url,source_collected_at,scheduled_for,published_at,created_at&order=scheduled_for.asc.nullslast,created_at.desc&limit=100`,
    )
    return sendJson(res, 200, { posts, status })
  } catch {
    return sendJson(res, 502, { error: 'autoblog_unavailable' })
  }
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  return handlePosts(req, res, process.env)
}
