import { BLOG_ARTICLES, getArticleBySlug } from '@/lib/blog'

const SITE_URL = 'https://w3trafegopago.com.br'

const HOME_SEO = {
  title: 'W3 Tráfego Pago — Tráfego que converte. Resultado que escala.',
  description: 'Gestão de tráfego pago para e-commerce. Meta Ads e Google Ads com estrutura validada em mais de 100 e-commerces.',
}

const BLOG_SEO = {
  title: 'Blog W3 Tráfego Pago | Estratégias para anúncios que vendem',
  description: 'Estratégia, Meta Ads, Google Ads, criativos e métricas para transformar tráfego pago em crescimento previsível para e-commerce.',
}

function upsertMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.content = content
}

function removeMeta(attribute: 'name' | 'property', key: string) {
  document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)?.remove()
}

function upsertCanonical(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!element) {
    element = document.createElement('link')
    element.rel = 'canonical'
    document.head.appendChild(element)
  }
  element.href = href
}

function updateRouteSchema(schema: Record<string, unknown> | null) {
  const existing = document.head.querySelector<HTMLScriptElement>('#w3-route-schema')
  if (!schema) {
    existing?.remove()
    return
  }

  const script = existing ?? document.createElement('script')
  script.id = 'w3-route-schema'
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(schema)
  if (!existing) document.head.appendChild(script)
}

function getPathname(pathname: string) {
  const cleanPath = pathname.split('?')[0].split('#')[0]
  if (!cleanPath || cleanPath === '/') return '/'
  return `/${cleanPath.replace(/^\/+|\/+$/g, '')}`
}

function getSlug(pathname: string) {
  const match = getPathname(pathname).match(/^\/blog\/([^/]+)$/)
  if (!match) return ''
  try {
    return decodeURIComponent(match[1])
  } catch {
    return match[1]
  }
}

export function updateDocumentMetadata(pathname: string) {
  const path = getPathname(pathname)
  const isBlog = path === '/blog' || path.startsWith('/blog/')
  const article = getArticleBySlug(getSlug(path))
  const isUnknownArticle = isBlog && path !== '/blog' && !article
  const seo = article
    ? {
        title: `${article.title} | Blog W3 Tráfego Pago`,
        description: article.excerpt,
      }
    : isBlog
      ? BLOG_SEO
      : HOME_SEO

  document.title = seo.title
  upsertMeta('name', 'description', seo.description)
  upsertMeta('name', 'author', 'W3 Tráfego Pago')
  upsertMeta('name', 'robots', isUnknownArticle ? 'noindex, follow' : 'index, follow')

  const canonical = `${SITE_URL}${path}`
  upsertCanonical(canonical)
  upsertMeta('property', 'og:type', article ? 'article' : 'website')
  upsertMeta('property', 'og:site_name', 'W3 Tráfego Pago')
  upsertMeta('property', 'og:locale', 'pt_BR')
  upsertMeta('property', 'og:url', canonical)
  upsertMeta('property', 'og:title', seo.title)
  upsertMeta('property', 'og:description', seo.description)
  upsertMeta('name', 'twitter:card', 'summary_large_image')
  upsertMeta('name', 'twitter:title', seo.title)
  upsertMeta('name', 'twitter:description', seo.description)
  upsertMeta('name', 'twitter:url', canonical)

  if (article) {
    upsertMeta('property', 'article:published_time', article.isoDate)
    upsertMeta('property', 'article:section', article.category)
  } else {
    removeMeta('property', 'article:published_time')
    removeMeta('property', 'article:section')
  }

  const schema = article
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.excerpt,
        datePublished: article.isoDate,
        dateModified: article.isoDate,
        articleSection: article.category,
        inLanguage: 'pt-BR',
        author: { '@type': 'Organization', name: 'W3 Tráfego Pago', url: SITE_URL },
        publisher: { '@type': 'Organization', name: 'W3 Tráfego Pago', url: SITE_URL },
        mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
      }
    : isBlog
      ? {
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: 'Blog W3 Tráfego Pago',
          url: `${SITE_URL}/blog`,
          description: BLOG_SEO.description,
          inLanguage: 'pt-BR',
          publisher: { '@type': 'Organization', name: 'W3 Tráfego Pago', url: SITE_URL },
          blogPost: BLOG_ARTICLES.map((blogArticle) => ({
            '@type': 'BlogPosting',
            headline: blogArticle.title,
            url: `${SITE_URL}${articlePath(blogArticle.slug)}`,
            datePublished: blogArticle.isoDate,
            articleSection: blogArticle.category,
          })),
        }
      : null

  updateRouteSchema(schema)
}

function articlePath(slug: string) {
  return `/blog/${slug}`
}
