import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getAutoblogSettings, getSupabaseConfig, supabaseRequest, type AutoblogEnvironment, type DraftContent } from './_lib/autoblog.ts'

type StoredPublishedPost = {
  slug: string
  title: string
  excerpt: string
  category: string
  content: DraftContent
  published_at: string
}

export type PublicBlogArticle = {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  isoDate: string
  readTime: string
  image: string
  accent: string
  sections: DraftContent['sections']
}

function sendJson(res: VercelResponse, status: number, body: unknown) {
  return res.status(status).json(body)
}

function accentForCategory(category: string) {
  if (category.includes('Meta')) return 'blue'
  if (category.includes('Métrica')) return 'green'
  if (category.includes('Criativo')) return 'purple'
  return 'orange'
}

function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(isoDate))
}

function normalizeSections(content: unknown) {
  if (!content || typeof content !== 'object') return []
  const sections = (content as { sections?: unknown }).sections
  if (!Array.isArray(sections)) return []

  return sections.flatMap((section) => {
    if (!section || typeof section !== 'object') return []
    const value = section as Record<string, unknown>
    const heading = typeof value.heading === 'string' ? value.heading.trim() : ''
    const paragraphs = Array.isArray(value.paragraphs)
      ? value.paragraphs.filter((paragraph): paragraph is string => typeof paragraph === 'string' && paragraph.trim().length > 0)
      : []
    const bullets = Array.isArray(value.bullets)
      ? value.bullets.filter((bullet): bullet is string => typeof bullet === 'string' && bullet.trim().length > 0)
      : undefined
    if (!heading || (paragraphs.length === 0 && (!bullets || bullets.length === 0))) return []
    return [{ heading, paragraphs, ...(bullets && bullets.length > 0 ? { bullets } : {}) }]
  })
}

function mapPublishedPost(post: StoredPublishedPost): PublicBlogArticle | null {
  if (!post.slug || !post.title || !post.excerpt || !post.category) return null
  const publishedAt = new Date(post.published_at)
  if (Number.isNaN(publishedAt.getTime())) return null
  const sections = normalizeSections(post.content)
  if (sections.length === 0) return null

  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    date: formatDate(post.published_at),
    isoDate: post.published_at.slice(0, 10),
    readTime: '5 min de leitura',
    image: '',
    accent: accentForCategory(post.category),
    sections,
  }
}

export async function handleBlog(
  req: Pick<VercelRequest, 'method'>,
  res: VercelResponse,
  env: AutoblogEnvironment = process.env,
  now = new Date(),
) {
  if (req.method !== 'GET') return sendJson(res, 405, { error: 'method_not_allowed' })

  const settings = getAutoblogSettings(env)
  const config = getSupabaseConfig({
    supabaseUrl: settings.supabaseUrl,
    supabaseServiceRoleKey: settings.supabasePublicKey,
  })
  if (!config) return sendJson(res, 200, { articles: [] })

  try {
    const posts = await supabaseRequest<StoredPublishedPost[]>(
      config,
      `blog_posts?status=eq.published&published_at=not.is.null&published_at=lte.${encodeURIComponent(now.toISOString())}&select=slug,title,excerpt,category,content,published_at&order=published_at.desc&limit=50`,
    )
    const articles = posts.map(mapPublishedPost).filter((article): article is PublicBlogArticle => Boolean(article))
    return sendJson(res, 200, { articles })
  } catch {
    return sendJson(res, 502, { error: 'blog_unavailable', articles: [] })
  }
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  return handleBlog(req, res, process.env)
}
