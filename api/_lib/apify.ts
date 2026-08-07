import {
  isAllowedSourceUrl,
  sanitizeText,
  type AutoblogEnvironment,
} from './autoblog.js'

const APIFY_API_BASE = 'https://api.apify.com/v2'
const DEFAULT_ACTOR_ID = 'apify/google-trends-scraper'
const DEFAULT_TIMEOUT_SECONDS = 40
const MAX_TIMEOUT_SECONDS = 50
const MAX_TOKENS = 8
const MAX_SEARCH_TERMS = 12
const MAX_KEYWORDS = 80
const MAX_SOURCES = 20
const MAX_RESPONSE_BYTES = 2_000_000

const DEFAULT_SEARCH_TERMS = [
  'google ads',
  'meta ads',
  'tráfego pago',
  'campanhas google ads',
  'anúncios instagram',
  'performance max',
  'métricas de tráfego pago',
  'conversão ecommerce',
]

type JsonRecord = Record<string, unknown>

export type ApifyKeyword = {
  keyword: string
  score: number
  metadata: JsonRecord
}

export type ApifySourceCandidate = {
  title: string
  link: string
  excerpt: string
  publishedAt: string | null
}

export type ApifyCollection = {
  keywords: ApifyKeyword[]
  sources: ApifySourceCandidate[]
  errors: string[]
}

class ApifyRequestError extends Error {
  status: number

  constructor(status: number) {
    super(`Apify request failed with ${status}`)
    this.name = 'ApifyRequestError'
    this.status = status
  }
}

function asRecord(value: unknown): JsonRecord | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as JsonRecord
    : null
}

function firstString(record: JsonRecord, names: string[]) {
  for (const name of names) {
    const value = record[name]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return undefined
}

function numericValue(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value !== 'string' || !value.trim()) return 0
  const parsed = Number(value.replace(',', '.').replace(/[^\d.-]/g, ''))
  return Number.isFinite(parsed) ? parsed : 0
}

function scoreFrom(record: JsonRecord) {
  for (const name of ['score', 'value', 'interest', 'traffic', 'searchVolume', 'rank']) {
    const score = numericValue(record[name])
    if (score > 0) return score
  }
  return 0
}

function splitValues(value?: string) {
  return (value ?? '')
    .split(/[\r\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean)
}

export function getApifyTokens(env: AutoblogEnvironment) {
  const values = [
    ...splitValues(env.apifyApiTokens || env.APIFY_API_TOKENS),
    ...splitValues(env.apifyApiToken || env.APIFY_API_TOKEN),
  ]
  return [...new Set(values)].slice(0, MAX_TOKENS)
}

export function getApifyActorId(env: AutoblogEnvironment) {
  const configured = env.apifyActorId?.trim() || env.APIFY_ACTOR_ID?.trim() || DEFAULT_ACTOR_ID
  const normalized = configured.replaceAll('/', '~')
  return /^[A-Za-z0-9_-]+~[A-Za-z0-9_-]+$/.test(normalized)
    ? normalized
    : DEFAULT_ACTOR_ID.replace('/', '~')
}

export function getApifySearchTerms(env: AutoblogEnvironment) {
  const configured = splitValues(env.apifyKeywords || env.APIFY_KEYWORDS)
  const terms = configured.length > 0 ? configured : DEFAULT_SEARCH_TERMS
  const seen = new Set<string>()
  return terms
    .map((term) => sanitizeText(term, 100))
    .filter((term) => {
      const key = term.toLocaleLowerCase('pt-BR')
      if (term.length < 2 || seen.has(key)) return false
      seen.add(key)
      return true
    })
    .slice(0, MAX_SEARCH_TERMS)
}

function timeoutSeconds(env: AutoblogEnvironment) {
  const parsed = Number(env.apifyRunTimeoutSeconds || env.APIFY_RUN_TIMEOUT_SECONDS)
  if (!Number.isFinite(parsed)) return DEFAULT_TIMEOUT_SECONDS
  return Math.min(MAX_TIMEOUT_SECONDS, Math.max(10, Math.floor(parsed)))
}

export function buildApifyInput(env: AutoblogEnvironment) {
  return {
    searchTerms: getApifySearchTerms(env),
    isMultiple: false,
    timeRange: 'today 1-m',
    geo: 'BR',
    viewedFrom: 'BR',
    maxItems: MAX_KEYWORDS,
    skipDebugScreen: true,
    maxConcurrency: 2,
    maxRequestRetries: 2,
    pageLoadTimeoutSecs: 30,
  }
}

function extractItems(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload
  const record = asRecord(payload)
  if (!record) return []

  for (const key of ['items', 'results', 'output', 'data']) {
    if (Array.isArray(record[key])) return record[key]
    const nested = asRecord(record[key])
    if (nested && Array.isArray(nested.items)) return nested.items
  }
  return []
}

async function runActorWithToken(env: AutoblogEnvironment, token: string) {
  const actorId = encodeURIComponent(getApifyActorId(env))
  const response = await fetch(`${APIFY_API_BASE}/acts/${actorId}/run-sync-get-dataset-items`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(buildApifyInput(env)),
    signal: AbortSignal.timeout(timeoutSeconds(env) * 1000),
  })

  const contentLength = Number(response.headers.get('content-length'))
  if (Number.isFinite(contentLength) && contentLength > MAX_RESPONSE_BYTES) {
    throw new Error('Apify response exceeded the configured limit')
  }

  const responseText = await response.text()
  if (responseText.length > MAX_RESPONSE_BYTES) {
    throw new Error('Apify response exceeded the configured limit')
  }
  if (!response.ok) throw new ApifyRequestError(response.status)

  try {
    return extractItems(responseText ? JSON.parse(responseText) : null)
  } catch {
    throw new Error('Apify returned invalid JSON')
  }
}

async function runActor(env: AutoblogEnvironment) {
  const tokens = getApifyTokens(env)
  if (tokens.length === 0) return []

  let lastError: unknown
  for (let index = 0; index < tokens.length; index += 1) {
    try {
      return await runActorWithToken(env, tokens[index])
    } catch (error) {
      lastError = error
      const status = error instanceof ApifyRequestError ? error.status : 0
      const shouldRotate = [401, 403, 429].includes(status)
      if (!shouldRotate || index === tokens.length - 1) throw error
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Apify request failed')
}

function addKeyword(
  map: Map<string, ApifyKeyword>,
  value: unknown,
  score: number,
  metadata: JsonRecord,
) {
  if (typeof value !== 'string') return
  const keyword = sanitizeText(value, 120)
  if (keyword.length < 2 || /^https?:\/\//i.test(keyword)) return

  const key = keyword.toLocaleLowerCase('pt-BR')
  const existing = map.get(key)
  if (existing) {
    existing.score = Math.max(existing.score, score)
    return
  }
  if (map.size >= MAX_KEYWORDS) return
  map.set(key, { keyword, score, metadata })
}

function collectRelatedKeywords(
  map: Map<string, ApifyKeyword>,
  value: unknown,
  parentMetadata: JsonRecord,
) {
  if (Array.isArray(value)) {
    value.slice(0, MAX_KEYWORDS).forEach((entry) => collectRelatedKeywords(map, entry, parentMetadata))
    return
  }

  const record = asRecord(value)
  if (!record) {
    addKeyword(map, value, 0, parentMetadata)
    return
  }

  const related = firstString(record, ['query', 'keyword', 'searchTerm', 'term', 'topic', 'title', 'name'])
  if (related) {
    addKeyword(map, related, scoreFrom(record), { ...parentMetadata, related: true })
    return
  }
  Object.values(record)
    .slice(0, MAX_KEYWORDS)
    .forEach((entry) => collectRelatedKeywords(map, entry, parentMetadata))
}

export function normalizeTrendItems(items: unknown[]): ApifyKeyword[] {
  const keywords = new Map<string, ApifyKeyword>()
  items.slice(0, MAX_KEYWORDS).forEach((item, index) => {
    const record = asRecord(item)
    if (!record) return

    const itemMetadata = {
      provider: 'apify',
      source: 'google-trends',
      rank: index + 1,
    }
    addKeyword(
      keywords,
      firstString(record, ['keyword', 'searchTerm', 'term', 'query']),
      scoreFrom(record),
      itemMetadata,
    )

    for (const key of ['relatedQueries', 'relatedTopics', 'queries', 'topics']) {
      collectRelatedKeywords(keywords, record[key], { ...itemMetadata, group: key })
    }
  })
  return [...keywords.values()]
}

function collectUrls(value: unknown, found: Array<{ url: string; record: JsonRecord }>, depth = 0) {
  if (depth > 4 || found.length >= MAX_SOURCES) return
  if (Array.isArray(value)) {
    value.slice(0, MAX_SOURCES).forEach((entry) => collectUrls(entry, found, depth + 1))
    return
  }

  const record = asRecord(value)
  if (!record) return
  const url = firstString(record, ['sourceUrl', 'articleUrl', 'newsUrl', 'link', 'url'])
  if (url && url.length <= 2048 && isAllowedSourceUrl(url)) found.push({ url, record })

  Object.values(record)
    .slice(0, MAX_SOURCES)
    .forEach((entry) => collectUrls(entry, found, depth + 1))
}

export function normalizeSourceCandidates(items: unknown[]): ApifySourceCandidate[] {
  const found: Array<{ url: string; record: JsonRecord }> = []
  items.slice(0, MAX_SOURCES).forEach((item) => collectUrls(item, found))
  const seen = new Set<string>()
  const candidates: ApifySourceCandidate[] = []

  for (const item of found) {
    if (seen.has(item.url)) continue
    seen.add(item.url)
    const title = sanitizeText(firstString(item.record, ['title', 'headline', 'name', 'query']) || 'Atualização de plataforma', 180)
    const excerpt = sanitizeText(firstString(item.record, ['excerpt', 'description', 'snippet', 'summary']) || '', 600)
    const publishedAt = firstString(item.record, ['publishedAt', 'published_at', 'date', 'publishedDate']) || null
    candidates.push({ title, link: item.url, excerpt, publishedAt })
    if (candidates.length >= MAX_SOURCES) break
  }
  return candidates
}

export async function collectApifyTrends(env: AutoblogEnvironment): Promise<ApifyCollection> {
  if (getApifyTokens(env).length === 0) {
    return { keywords: [], sources: [], errors: [] }
  }

  try {
    const items = await runActor(env)
    return {
      keywords: normalizeTrendItems(items),
      sources: normalizeSourceCandidates(items),
      errors: [],
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown error'
    return {
      keywords: [],
      sources: [],
      errors: [`Apify Google Trends: ${message}`],
    }
  }
}
