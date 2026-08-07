import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  buildSlug,
  getSaoPauloDate,
  getSupabaseConfig,
  getAutoblogSettings,
  hasBearerToken,
  isAllowedSourceUrl,
  isDraftPublishable,
  parseFeedItems,
  supabaseRequest,
  type AutoblogEnvironment,
  type DraftContent,
  type FeedItem,
  type SupabaseConfig,
} from '../_lib/autoblog.js'

type FeedDefinition = {
  name: string
  url: string
  kind: 'trend' | 'platform'
}

type RunRecord = {
  id: string
  run_date: string
  status: string
}

type CollectedSignal = FeedItem & {
  feedName: string
  feedKind: FeedDefinition['kind']
}

type CronResult = {
  status: 'completed' | 'already_processed'
  runDate: string
  sourceCount: number
  draftCount: number
  errors: string[]
}

export const DEFAULT_FEEDS: FeedDefinition[] = [
  {
    name: 'Google Trends Brasil',
    url: 'https://trends.google.com/trending/rss?geo=BR',
    kind: 'trend',
  },
  {
    name: 'Google Ads & Commerce',
    url: 'https://blog.google/products/ads-commerce/rss/',
    kind: 'platform',
  },
  {
    name: 'Meta Newsroom',
    url: 'https://about.fb.com/news/feed/',
    kind: 'platform',
  },
]

function sendJson(res: VercelResponse, status: number, body: unknown) {
  return res.status(status).json(body)
}

function getFeeds(env: AutoblogEnvironment): FeedDefinition[] {
  if (!env.feeds) return DEFAULT_FEEDS

  try {
    const parsed = JSON.parse(env.feeds) as unknown
    if (!Array.isArray(parsed)) return DEFAULT_FEEDS

    const custom = parsed.filter((feed): feed is FeedDefinition => {
      if (!feed || typeof feed !== 'object') return false
      const candidate = feed as Record<string, unknown>
      return typeof candidate.name === 'string'
        && typeof candidate.url === 'string'
        && (candidate.kind === 'trend' || candidate.kind === 'platform')
    })
    return custom.length > 0 ? custom.slice(0, 8) : DEFAULT_FEEDS
  } catch {
    return DEFAULT_FEEDS
  }
}

async function fetchFeed(feed: FeedDefinition): Promise<CollectedSignal[]> {
  const response = await fetch(feed.url, {
    headers: { Accept: 'application/rss+xml, application/atom+xml, text/xml' },
    signal: AbortSignal.timeout(8000),
  })
  if (!response.ok) throw new Error(`${feed.name}: HTTP ${response.status}`)

  const xml = await response.text()
  return parseFeedItems(xml, feed.url).map((item) => ({ ...item, feedName: feed.name, feedKind: feed.kind }))
}

export async function collectSignals(feeds: FeedDefinition[] = DEFAULT_FEEDS) {
  const results = await Promise.allSettled(feeds.map((feed) => fetchFeed(feed)))
  const signals: CollectedSignal[] = []
  const errors: string[] = []

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      signals.push(...result.value)
    } else {
      errors.push(`${feeds[index].name}: ${result.reason instanceof Error ? result.reason.message : 'unknown error'}`)
    }
  })

  return { signals, errors }
}

function getCategory(signal: CollectedSignal) {
  if (signal.link.includes('about.fb.com') || signal.link.includes('facebook.com') || signal.link.includes('meta.com')) return 'Meta Ads'
  return 'Google Ads'
}

export function createDraftFromSignal(signal: CollectedSignal, collectedAt: string) {
  const title = signal.title.startsWith('Atualização') ? signal.title : `Atualização: ${signal.title}`
  const content: DraftContent = {
    sections: [
      {
        heading: 'O que a fonte oficial publicou',
        paragraphs: [
          `A fonte ${signal.feedName} publicou uma atualização que pode afetar operações de mídia paga. Este rascunho resume o sinal sem tratar o título como confirmação de impacto para todas as contas.`,
          signal.excerpt || 'O conteúdo original deve ser lido antes da aprovação editorial.',
        ],
      },
      {
        heading: 'O que revisar na operação',
        paragraphs: ['Confira se a mudança altera configuração, mensuração, criativos, inventário ou política na sua conta antes de editar campanhas.'],
        bullets: [
          'Confirmar a disponibilidade da mudança no Brasil e no tipo de conta afetado.',
          'Registrar o estado atual antes de qualquer alteração.',
          'Medir impacto em conversões, custo e qualidade do tráfego depois do ajuste.',
        ],
      },
      {
        heading: 'Fonte original',
        paragraphs: [`Leia a publicação original antes de publicar este conteúdo: ${signal.link}`],
      },
    ],
  }

  return {
    title,
    slug: `${buildSlug(title)}-${getSaoPauloDate(new Date(collectedAt))}`,
    excerpt: signal.excerpt || `Resumo editorial da atualização publicada por ${signal.feedName}.`,
    category: getCategory(signal),
    kind: 'platform-update' as const,
    status: 'draft' as const,
    keyword: signal.title,
    content,
    sourceUrl: signal.link,
    sourceCollectedAt: collectedAt,
  }
}

function isPlatformSignal(signal: CollectedSignal) {
  return signal.feedKind === 'platform' && isAllowedSourceUrl(signal.link)
}

async function getExistingRun(config: SupabaseConfig, runDate: string) {
  return supabaseRequest<RunRecord[]>(config, `autoblog_runs?run_date=eq.${runDate}&select=id,run_date,status&limit=1`)
}

async function insertRun(config: SupabaseConfig, runDate: string) {
  return supabaseRequest<RunRecord[]>(config, 'autoblog_runs', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ run_date: runDate, status: 'running' }),
  })
}

async function updateRun(config: SupabaseConfig, runId: string, values: Record<string, unknown>) {
  await supabaseRequest(config, `autoblog_runs?id=eq.${encodeURIComponent(runId)}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify(values),
  })
}

async function persistSignal(config: SupabaseConfig, signal: CollectedSignal, collectedAt: string) {
  const existing = await supabaseRequest<Array<{ id: string }>>(
    config,
    `autoblog_signals?url=eq.${encodeURIComponent(signal.link)}&select=id&limit=1`,
  )
  if (existing.length > 0) return false

  await supabaseRequest(config, 'autoblog_signals', {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({
      source: signal.feedName,
      title: signal.title,
      url: signal.link,
      published_at: signal.publishedAt ? new Date(signal.publishedAt).toISOString() : null,
      collected_at: collectedAt,
      raw_excerpt: signal.excerpt,
      metadata: { feedKind: signal.feedKind, sourceUrl: signal.sourceUrl },
    }),
  })
  return true
}

async function persistDraft(config: SupabaseConfig, draft: ReturnType<typeof createDraftFromSignal>) {
  await supabaseRequest(config, 'blog_posts', {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({
      slug: draft.slug,
      title: draft.title,
      excerpt: draft.excerpt,
      content: draft.content,
      category: draft.category,
      kind: draft.kind,
      status: draft.status,
      keyword: draft.keyword,
      source_url: draft.sourceUrl,
      source_collected_at: draft.sourceCollectedAt,
    }),
  })
}

function parseModelJson(value: string) {
  const normalized = value.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
  try {
    return JSON.parse(normalized) as Record<string, unknown>
  } catch {
    return null
  }
}

export async function enrichDraftWithLlm(
  baseDraft: ReturnType<typeof createDraftFromSignal>,
  signal: CollectedSignal,
  env: AutoblogEnvironment,
) {
  const settings = getAutoblogSettings(env)
  if (settings.llmEnabled !== 'true' || !settings.llmEndpoint || !settings.llmApiKey) return baseDraft

  try {
    const endpoint = new URL(settings.llmEndpoint)
    if (endpoint.protocol !== 'https:') return baseDraft

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${settings.llmApiKey}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(12000),
      body: JSON.stringify({
        model: settings.llmModel || 'gpt-4o-mini',
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: 'Você é editor de um blog brasileiro de tráfego pago. Escreva em pt-BR. Não invente fatos, números ou impactos. Use apenas o sinal e o resumo fornecidos. Retorne JSON com title, excerpt e sections; sections é uma lista de objetos com heading, paragraphs e opcionalmente bullets.',
          },
          {
            role: 'user',
            content: JSON.stringify({
              sourceTitle: signal.title,
              sourceExcerpt: signal.excerpt,
              sourceUrl: signal.link,
              baseTitle: baseDraft.title,
            }),
          },
        ],
      }),
    })
    if (!response.ok) return baseDraft

    const payload = await response.json() as { choices?: Array<{ message?: { content?: unknown } }> }
    const rawContent = payload.choices?.[0]?.message?.content
    if (typeof rawContent !== 'string') return baseDraft
    const generated = parseModelJson(rawContent)
    if (!generated || typeof generated.title !== 'string' || typeof generated.excerpt !== 'string' || !Array.isArray(generated.sections)) return baseDraft

    const candidate = {
      ...baseDraft,
      title: generated.title.trim().slice(0, 180),
      slug: `${buildSlug(generated.title)}-${getSaoPauloDate(new Date(baseDraft.sourceCollectedAt))}`,
      excerpt: generated.excerpt.trim().slice(0, 600),
      content: { sections: generated.sections },
    }
    return isDraftPublishable({
      title: candidate.title,
      slug: candidate.slug,
      excerpt: candidate.excerpt,
      category: candidate.category,
      content: candidate.content,
      sourceUrl: candidate.sourceUrl,
      sourceCollectedAt: candidate.sourceCollectedAt,
    }) ? candidate : baseDraft
  } catch {
    return baseDraft
  }
}

export async function runDailyAutoblog(
  env: AutoblogEnvironment,
  now = new Date(),
): Promise<CronResult> {
  const settings = getAutoblogSettings(env)
  const config = getSupabaseConfig(settings)
  if (!config) throw new Error('autoblog_not_configured')

  const runDate = getSaoPauloDate(now)
  const existingRuns = await getExistingRun(config, runDate)
  if (existingRuns.length > 0) {
    return { status: 'already_processed', runDate, sourceCount: 0, draftCount: 0, errors: [] }
  }

  let run: RunRecord
  try {
    const insertedRuns = await insertRun(config, runDate)
    run = insertedRuns[0]
    if (!run?.id) throw new Error('autoblog_run_insert_missing_id')
  } catch (error) {
    const status = (error as { status?: number }).status
    if (status === 409) {
      return { status: 'already_processed', runDate, sourceCount: 0, draftCount: 0, errors: [] }
    }
    throw error
  }

  const collectedAt = new Date().toISOString()
  const collected = await collectSignals(getFeeds(settings))
  const validSignals = collected.signals.filter(isPlatformSignal)
  const topSignal = validSignals[0]
  let draftCount = 0

  try {
    if (topSignal && await persistSignal(config, topSignal, collectedAt)) {
      const baseDraft = createDraftFromSignal(topSignal, collectedAt)
      const draft = await enrichDraftWithLlm(baseDraft, topSignal, settings)
      await persistDraft(config, draft)
      draftCount = 1
    }

    await updateRun(config, run.id, {
      status: 'completed',
      source_count: collected.signals.length,
      draft_count: draftCount,
      errors: collected.errors,
      completed_at: new Date().toISOString(),
    })
  } catch (error) {
    await updateRun(config, run.id, {
      status: 'failed',
      source_count: collected.signals.length,
      errors: [...collected.errors, error instanceof Error ? error.message : 'unknown error'],
      completed_at: new Date().toISOString(),
    })
    throw error
  }

  return {
    status: 'completed',
    runDate,
    sourceCount: collected.signals.length,
    draftCount,
    errors: collected.errors,
  }
}

export async function handleAutoblog(
  req: Pick<VercelRequest, 'method' | 'headers'>,
  res: VercelResponse,
  env: AutoblogEnvironment = process.env,
  now = new Date(),
) {
  if (req.method !== 'GET') return sendJson(res, 405, { error: 'method_not_allowed' })
  const settings = getAutoblogSettings(env)
  if (!hasBearerToken(req.headers, settings.cronSecret)) return sendJson(res, 401, { error: 'unauthorized' })
  if (!getSupabaseConfig(settings)) return sendJson(res, 503, { error: 'autoblog_not_configured' })

  try {
    return sendJson(res, 200, await runDailyAutoblog(settings, now))
  } catch (error) {
    const code = error instanceof Error && error.message === 'autoblog_not_configured'
      ? 'autoblog_not_configured'
      : 'autoblog_run_failed'
    return sendJson(res, code === 'autoblog_not_configured' ? 503 : 502, { error: code })
  }
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  return handleAutoblog(req, res, process.env)
}
