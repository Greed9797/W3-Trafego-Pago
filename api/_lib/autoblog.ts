export const EDITORIAL_TIMEZONE = 'America/Sao_Paulo'

export const ALLOWED_SOURCE_HOSTS = [
  'trends.google.com',
  'blog.google',
  'ads-developers.googleblog.com',
  'support.google.com',
  'facebook.com',
  'about.fb.com',
  'meta.com',
] as const

export type FeedItem = {
  title: string
  link: string
  excerpt: string
  publishedAt: string | null
  sourceUrl: string
}

export type SupabaseConfig = {
  url: string
  serviceRoleKey: string
}

export type AutoblogEnvironment = {
  cronSecret?: string
  adminToken?: string
  supabaseUrl?: string
  supabaseServiceRoleKey?: string
  supabasePublicKey?: string
  llmEnabled?: string
  llmEndpoint?: string
  llmApiKey?: string
  llmModel?: string
  feeds?: string
}

export type DraftContent = {
  sections: Array<{
    heading: string
    paragraphs: string[]
    bullets?: string[]
  }>
}

export type DraftInput = {
  title: string
  slug: string
  excerpt: string
  category: string
  content: DraftContent
  sourceUrl: string
  sourceCollectedAt: string
}

export type SupabaseError = Error & {
  status?: number
  details?: unknown
}

const HTML_TAG_PATTERN = /<[^>]*>/g
const MAX_FEED_ITEMS = 20
const MAX_TITLE_LENGTH = 180
const MAX_EXCERPT_LENGTH = 600

function decodeXmlEntities(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
}

export function sanitizeText(value: string, maxLength: number) {
  return decodeXmlEntities(value)
    .replace(HTML_TAG_PATTERN, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength)
}

function readTag(block: string, tag: string) {
  const match = block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, 'i'))
  return match?.[1] ?? ''
}

function readLink(block: string) {
  const linkTag = block.match(/<link(?:\s[^>]*)?>([\s\S]*?)<\/link>/i)
  if (linkTag?.[1]) return decodeXmlEntities(linkTag[1]).trim()

  const href = block.match(/<link[^>]+href=["']([^"']+)["']/i)
  return href?.[1] ? decodeXmlEntities(href[1]).trim() : ''
}

export function parseFeedItems(xml: string, sourceUrl: string): FeedItem[] {
  const blocks = xml.match(/<(?:item|entry)(?:\s[^>]*)?>[\s\S]*?<\/(?:item|entry)>/gi) ?? []
  const items: FeedItem[] = []

  for (const block of blocks) {
    if (items.length >= MAX_FEED_ITEMS) break

    const title = sanitizeText(readTag(block, 'title'), MAX_TITLE_LENGTH)
    const link = readLink(block)
    if (!title || !link) continue

    const publishedAt = sanitizeText(
      readTag(block, 'pubDate') || readTag(block, 'published') || readTag(block, 'updated'),
      80,
    )

    items.push({
      title,
      link,
      excerpt: sanitizeText(readTag(block, 'description') || readTag(block, 'summary'), MAX_EXCERPT_LENGTH),
      publishedAt: publishedAt || null,
      sourceUrl,
    })
  }

  return items
}

export function isAllowedSourceUrl(value: string) {
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:') return false
    return ALLOWED_SOURCE_HOSTS.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`))
  } catch {
    return false
  }
}

export function buildSlug(title: string) {
  return sanitizeText(title, MAX_TITLE_LENGTH)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90)
}

export function getBearerToken(headers: Record<string, string | string[] | undefined>) {
  const raw = headers.authorization ?? headers.Authorization
  const header = Array.isArray(raw) ? raw[0] : raw
  if (!header) return ''
  const match = header.match(/^Bearer\s+(.+)$/i)
  return match?.[1]?.trim() ?? ''
}

export function hasBearerToken(
  headers: Record<string, string | string[] | undefined>,
  expectedToken: string | undefined,
) {
  return Boolean(expectedToken && getBearerToken(headers) === expectedToken)
}

export function getSaoPauloDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: EDITORIAL_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}

export function getSupabaseConfig(env: AutoblogEnvironment): SupabaseConfig | null {
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) return null

  try {
    const url = new URL(env.supabaseUrl)
    if (url.protocol !== 'https:') return null
    return { url: url.origin, serviceRoleKey: env.supabaseServiceRoleKey }
  } catch {
    return null
  }
}

export function isDraftPublishable(input: Partial<DraftInput>): input is DraftInput {
  if (!input.title || !input.slug || !input.excerpt || !input.category) return false
  if (!input.sourceUrl || !isAllowedSourceUrl(input.sourceUrl)) return false
  if (!input.sourceCollectedAt || Number.isNaN(Date.parse(input.sourceCollectedAt))) return false
  if (!input.content || !Array.isArray(input.content.sections) || input.content.sections.length === 0) return false
  return input.content.sections.every((section) => Boolean(section.heading) && Array.isArray(section.paragraphs))
}

export async function supabaseRequest<T>(
  config: SupabaseConfig,
  tableAndQuery: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${config.url}/rest/v1/${tableAndQuery}`, {
    ...init,
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  })
  const responseText = await response.text()
  let data: unknown = null

  if (responseText) {
    try {
      data = JSON.parse(responseText)
    } catch {
      data = responseText
    }
  }

  if (!response.ok) {
    const error = new Error(`Supabase request failed with ${response.status}`) as SupabaseError
    error.status = response.status
    error.details = data
    throw error
  }

  return data as T
}
