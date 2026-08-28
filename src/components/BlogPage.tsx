import { useEffect, useState } from 'react'
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Menu,
  Target,
  X,
} from 'lucide-react'
import logoW3 from '@/assets/logo-w3.svg'
import {
  BLOG_ARTICLES,
  BLOG_CATEGORIES,
  type BlogArticle,
} from '@/lib/blog'
import { updateDocumentMetadata } from '@/lib/seo'

const BLOG_NAV = [
  { label: 'Início', href: '/blog' },
  { label: 'Estratégia', href: '/blog#artigos' },
  { label: 'Meta Ads', href: '/blog#artigos' },
  { label: 'Google Ads', href: '/blog#artigos' },
]

const ACCENT_STYLES: Record<string, string> = {
  orange: 'from-orange-500/70 via-orange-950/30 to-black',
  blue: 'from-sky-500/60 via-blue-950/30 to-black',
  green: 'from-emerald-500/60 via-emerald-950/30 to-black',
  purple: 'from-fuchsia-500/60 via-purple-950/30 to-black',
}

type BlogPageProps = {
  pathname: string
}

function articleHref(slug: string) {
  return `/blog/${slug}`
}

function sectionId(heading: string) {
  return heading
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object')
}

function normalizeRemoteArticle(value: unknown): BlogArticle | null {
  if (!isRecord(value)) return null

  const slug = typeof value.slug === 'string' ? value.slug.trim() : ''
  const title = typeof value.title === 'string' ? value.title.trim() : ''
  const excerpt = typeof value.excerpt === 'string' ? value.excerpt.trim() : ''
  const category = typeof value.category === 'string' && BLOG_CATEGORIES.includes(value.category as (typeof BLOG_CATEGORIES)[number])
    ? value.category as BlogArticle['category']
    : 'Estratégia'
  const sections = Array.isArray(value.sections)
    ? value.sections.filter((section): section is BlogArticle['sections'][number] => {
        if (!isRecord(section) || typeof section.heading !== 'string' || !Array.isArray(section.paragraphs)) return false
        return section.paragraphs.every((paragraph) => typeof paragraph === 'string')
      })
    : []

  if (!slug || !title || !excerpt || sections.length === 0) return null

  return {
    slug,
    title,
    excerpt,
    category,
    date: typeof value.date === 'string' ? value.date : 'Atualizado recentemente',
    isoDate: typeof value.isoDate === 'string' ? value.isoDate : new Date().toISOString().slice(0, 10),
    readTime: typeof value.readTime === 'string' ? value.readTime : '5 min de leitura',
    image: typeof value.image === 'string' ? value.image : '',
    accent: typeof value.accent === 'string' ? value.accent : 'orange',
    sections,
  }
}

function mergeRemoteArticles(value: unknown) {
  const remoteArticles = isRecord(value) && Array.isArray(value.articles)
    ? value.articles.map(normalizeRemoteArticle).filter((article): article is BlogArticle => Boolean(article))
    : []
  const fallbackBySlug = new Map(BLOG_ARTICLES.map((article) => [article.slug, article]))
  const merged = new Map(BLOG_ARTICLES.map((article) => [article.slug, article]))

  for (const remoteArticle of remoteArticles) {
    const fallback = fallbackBySlug.get(remoteArticle.slug)
    merged.set(remoteArticle.slug, {
      ...fallback,
      ...remoteArticle,
      image: remoteArticle.image || fallback?.image || '',
    })
  }

  return [...merged.values()].sort((left, right) => right.isoDate.localeCompare(left.isoDate))
}

function useBlogArticles() {
  const [articles, setArticles] = useState<BlogArticle[]>(BLOG_ARTICLES)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let active = true

    fetch('/api/blog', { headers: { Accept: 'application/json' } })
      .then((response) => response.ok ? response.json() : null)
      .then((payload: unknown) => {
        if (active) setArticles(mergeRemoteArticles(payload))
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setLoaded(true)
      })

    return () => {
      active = false
    }
  }, [])

  return { articles, loaded }
}

function BlogHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#080808]/90 backdrop-blur-xl">
      <div className="mx-auto flex min-h-18 w-[min(1200px,calc(100vw-32px))] items-center justify-between gap-5">
        <a href="/" className="shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary" aria-label="W3 Tráfego Pago — início">
          <img src={logoW3} alt="W3 Tráfego Pago" width={195} height={26} className="h-5 w-auto" />
        </a>

        <div className="hidden items-center gap-3 md:flex">
          <span className="border-l border-white/15 pl-3 font-body text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">
            Blog de performance
          </span>
        </div>

        <nav aria-label="Navegação do blog" className="hidden items-center gap-6 lg:flex">
          {BLOG_NAV.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-sm font-body text-sm text-white/65 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              {item.label}
            </a>
          ))}
          <a
            href="/#diagnostico"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 font-body text-[11px] font-bold uppercase tracking-[0.08em] text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            Diagnóstico <ArrowUpRight className="size-3.5" />
          </a>
        </nav>

        <button
          type="button"
          aria-label={menuOpen ? 'Fechar menu do blog' : 'Abrir menu do blog'}
          aria-expanded={menuOpen}
          aria-controls="blog-mobile-nav"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex size-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary lg:hidden"
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {menuOpen && (
        <nav id="blog-mobile-nav" aria-label="Navegação móvel do blog" className="border-t border-white/10 px-4 py-3 lg:hidden">
          <div className="mx-auto flex w-[min(1200px,100%)] flex-col gap-1">
            {BLOG_NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-3 font-body text-sm text-white/75 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-primary"
              >
                {item.label}
              </a>
            ))}
            <a
              href="/#diagnostico"
              onClick={() => setMenuOpen(false)}
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 font-body text-[11px] font-bold uppercase tracking-[0.08em] text-primary-foreground focus-visible:outline-2 focus-visible:outline-primary"
            >
              Falar com a W3 <ArrowUpRight className="size-3.5" />
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}

function ArticleCover({ article, compact = false }: { article: BlogArticle; compact?: boolean }) {
  const accentStyle = ACCENT_STYLES[article.accent] ?? ACCENT_STYLES.orange
  const coverHeight = compact ? 'min-h-[212px]' : 'min-h-[280px] md:min-h-[320px]'

  return (
    <div className={`blog-cover relative isolate overflow-hidden bg-[#0d0d0d] bg-gradient-to-br ${accentStyle} ${coverHeight}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_42%,rgba(245,89,0,0.22),transparent_32%)]" />
      <div className={`relative flex flex-col ${coverHeight} p-5 md:p-6`}>
        <div className="flex items-start justify-between gap-4">
          <span aria-hidden="true" className="font-body text-sm font-medium tracking-[0.16em] text-primary">///</span>
          <span className="font-body text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">
            {article.category}
          </span>
        </div>
        <div className="mt-auto pt-10">
          <span className="mb-3 block h-px w-8 bg-primary/70" />
          <p className={`${compact ? 'text-xl md:text-2xl' : 'text-2xl md:text-4xl'} max-w-[18ch] font-display font-medium leading-[1.02] tracking-[-0.04em] text-white`}>
            {article.title}
          </p>
          <span className="mt-4 inline-flex w-fit rounded-full bg-primary px-3 py-1.5 font-body text-[10px] font-bold uppercase tracking-[0.12em] text-primary-foreground">
            {article.category}
          </span>
        </div>
      </div>
    </div>
  )
}

function ArticleCard({ article, compact = false }: { article: BlogArticle; compact?: boolean }) {
  return (
    <a
      href={articleHref(article.slug)}
      className={`blog-card group block overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_12px_40px_rgba(13,13,13,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(13,13,13,0.12)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${compact ? '' : 'h-full'}`}
    >
      <ArticleCover article={article} compact={compact} />
      <div className="p-5 md:p-6">
        <div className="flex items-center justify-between gap-3 font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6b6b6b]">
          <span>{article.date}</span>
          <span>{article.readTime}</span>
        </div>
        <h3 className={`${compact ? 'text-xl md:text-2xl' : 'text-xl'} mt-3 font-display font-bold leading-[1.08] tracking-[-0.03em] text-[#0d0d0d]`}>
          {article.title}
        </h3>
        <p className="mt-3 font-body text-sm leading-6 text-[#575757]">{article.excerpt}</p>
        <span className="mt-5 inline-flex items-center gap-2 font-body text-[11px] font-bold uppercase tracking-[0.1em] text-[#c2440a]">
          Ler artigo <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </div>
    </a>
  )
}

function BlogHero({ articleCount }: { articleCount: number }) {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_70%_at_75%_20%,hsl(25_95%_53%_/_0.22),transparent_65%)]" />
      <div className="absolute -right-36 top-24 -z-10 size-96 rounded-full border border-primary/20 bg-primary/5 blur-3xl" />
      <div className="mx-auto grid w-[min(1200px,calc(100vw-32px))] gap-12 py-20 md:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-20 lg:py-32">
        <div>
          <div className="flex items-center gap-3 font-body text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            <span className="h-px w-8 bg-primary" />
            W3 / Blog de tráfego pago
          </div>
          <h1 className="mt-6 max-w-3xl font-display text-[clamp(3.25rem,8vw,7.4rem)] font-bold leading-[0.88] tracking-[-0.07em] text-white">
            Decisões melhores
            <br />
            <span className="text-primary">antes do clique.</span>
          </h1>
          <p className="mt-7 max-w-xl font-body text-base leading-7 text-white/65 md:text-lg">
            Estratégia, mídia e dados para quem quer transformar tráfego pago em uma operação previsível de crescimento.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#artigos"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3.5 font-body text-[11px] font-bold uppercase tracking-[0.1em] text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              Explorar artigos <ArrowDownRight className="size-4" />
            </a>
            <a
              href="/#diagnostico"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3.5 font-body text-[11px] font-bold uppercase tracking-[0.1em] text-white/85 transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              Falar com especialista
            </a>
          </div>
          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">
            <span>{articleCount} artigos publicados</span>
            <span>Google Ads · Meta Ads · E-commerce</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute -inset-6 rounded-[2rem] bg-primary/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-[1.5rem] border border-white/15 bg-white/[0.06] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-7">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <p className="font-body text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">Radar W3</p>
                <p className="mt-1 font-display text-xl font-bold tracking-[-0.04em] text-white">Performance sem ruído</p>
              </div>
              <BarChart3 className="size-6 text-primary" />
            </div>
            <div className="grid grid-cols-3 gap-2 py-7">
              {[
                { label: 'Oferta', icon: Target },
                { label: 'Criativo', icon: BookOpen },
                { label: 'Dados', icon: BarChart3 },
              ].map(({ label, icon: Icon }, index) => (
                <div key={label} className="rounded-xl border border-white/10 bg-black/20 p-3 text-center">
                  <Icon className={`mx-auto size-5 ${index === 1 ? 'text-primary' : 'text-white/60'}`} />
                  <p className="mt-3 font-body text-[10px] font-semibold uppercase tracking-[0.1em] text-white/60">{label}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between rounded-xl bg-primary px-4 py-3 text-primary-foreground">
              <span className="font-body text-xs font-semibold">Uma hipótese por vez.</span>
              <ArrowUpRight className="size-4" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function BlogTopicBar() {
  return (
    <section className="border-b border-black/10 bg-[#f2f1ee] text-[#0d0d0d]">
      <div className="mx-auto flex w-[min(1200px,calc(100vw-32px))] flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
        <p className="font-body text-[10px] font-bold uppercase tracking-[0.18em] text-[#6b6b6b]">Explore por assunto</p>
        <nav aria-label="Categorias do blog" className="flex flex-wrap gap-x-5 gap-y-2">
          {BLOG_CATEGORIES.filter((category) => category !== 'Todos').map((category) => (
            <a key={category} href="/blog#artigos" className="font-body text-xs font-semibold text-[#575757] transition-colors hover:text-[#c2440a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c2440a]">
              {category}
            </a>
          ))}
        </nav>
      </div>
    </section>
  )
}

function FeaturedArticles({ articles }: { articles: BlogArticle[] }) {
  const [featuredArticle, ...supportingArticles] = articles.slice(0, 3)

  if (!featuredArticle) return null

  return (
    <section className="bg-[#f2f1ee] py-20 text-[#0d0d0d] md:py-28">
      <div className="mx-auto w-[min(1200px,calc(100vw-32px))]">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-[#c2440a]">Artigos mais recentes</p>
            <h2 className="mt-3 max-w-xl font-display text-4xl font-bold leading-[0.95] tracking-[-0.05em] md:text-6xl">Ideias para fazer a verba trabalhar melhor.</h2>
          </div>
          <p className="max-w-xs font-body text-sm leading-6 text-[#575757]">Conteúdo direto ao ponto para decisões melhores antes, durante e depois da campanha.</p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <ArticleCard article={featuredArticle} />
          <div className="grid gap-5">
            {supportingArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} compact />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ArticleCatalog({ articles }: { articles: BlogArticle[] }) {
  const [activeCategory, setActiveCategory] = useState<(typeof BLOG_CATEGORIES)[number]>('Todos')
  const visibleArticles = activeCategory === 'Todos'
    ? articles.slice(3)
    : articles.filter((article) => article.category === activeCategory)

  return (
    <section id="artigos" className="scroll-mt-20 bg-[#f2f1ee] pb-24 text-[#0d0d0d] md:pb-32">
      <div className="mx-auto w-[min(1200px,calc(100vw-32px))] border-t border-black/10 pt-14 md:pt-20">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-[#c2440a]">Arquivo W3</p>
            <h2 className="mt-3 font-display text-4xl font-bold leading-none tracking-[-0.05em] md:text-6xl">Todos os artigos e matérias</h2>
          </div>
          <span className="font-body text-xs font-semibold uppercase tracking-[0.12em] text-[#6b6b6b]">{articles.length} leituras para começar</span>
        </div>

        <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filtrar artigos por categoria">
          {BLOG_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              aria-pressed={activeCategory === category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full border px-4 py-2.5 font-body text-[11px] font-bold uppercase tracking-[0.08em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${activeCategory === category ? 'border-[#0d0d0d] bg-[#0d0d0d] text-white' : 'border-black/15 text-[#575757] hover:border-[#c2440a] hover:text-[#c2440a]'}`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visibleArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>

        {visibleArticles.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-black/20 p-10 text-center">
            <p className="font-body text-sm text-[#575757]">Estamos preparando novos conteúdos para essa categoria.</p>
          </div>
        )}
      </div>
    </section>
  )
}

function BlogCta() {
  return (
    <section className="relative isolate overflow-hidden border-t border-white/10 bg-[#080808] py-20 md:py-28">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_90%_at_50%_100%,hsl(25_95%_53%_/_0.2),transparent_68%)]" />
      <div className="mx-auto flex w-[min(1200px,calc(100vw-32px))] flex-col items-start justify-between gap-8 md:flex-row md:items-end">
        <div>
          <p className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Próximo passo</p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-[0.95] tracking-[-0.05em] text-white md:text-6xl">Seu tráfego merece uma estratégia à altura.</h2>
          <p className="mt-5 max-w-xl font-body text-base leading-7 text-white/60">Se você quer entender onde estão as melhores oportunidades, fale com a W3 e peça um diagnóstico da sua operação.</p>
        </div>
        <a
          href="/#diagnostico"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-3.5 font-body text-[11px] font-bold uppercase tracking-[0.1em] text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          Falar com especialista <ArrowUpRight className="size-4" />
        </a>
      </div>
    </section>
  )
}

function BlogRadar() {
  return (
    <section className="bg-[#f2f1ee] pb-24 text-[#0d0d0d] md:pb-32">
      <div className="mx-auto w-[min(1200px,calc(100vw-32px))] border-t border-black/10 pt-12 md:pt-16">
        <div className="grid gap-8 rounded-[1.75rem] bg-[#0d0d0d] p-7 text-white md:grid-cols-[1fr_auto] md:items-end md:p-10">
          <div>
            <p className="font-body text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Radar W3</p>
            <h2 className="mt-4 max-w-2xl font-display text-3xl font-bold leading-[0.98] tracking-[-0.05em] md:text-5xl">O que muda na plataforma precisa virar decisão, não ruído.</h2>
            <p className="mt-4 max-w-2xl font-body text-sm leading-6 text-white/60">Acompanhe análises de Google Ads, Meta Ads, criativos e métricas com contexto para quem precisa operar e crescer.</p>
          </div>
          <a href="/#diagnostico" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 font-body text-[11px] font-bold uppercase tracking-[0.1em] text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
            Falar com a W3 <ArrowUpRight className="size-4" />
          </a>
        </div>
      </div>
    </section>
  )
}

function BlogFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#080808] py-8">
      <div className="mx-auto flex w-[min(1200px,calc(100vw-32px))] flex-col items-center justify-between gap-5 md:flex-row">
        <a href="/" className="rounded-sm opacity-80 transition-opacity hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary" aria-label="Voltar para o site W3 Tráfego Pago">
          <img src={logoW3} alt="W3 Tráfego Pago" width={195} height={26} className="h-5 w-auto" />
        </a>
        <p className="font-body text-center text-[10px] uppercase tracking-[0.12em] text-white/40 md:text-left">© 2026 W3 Tráfego Pago. Conteúdo para decisões que escalam.</p>
        <a href="/#diagnostico" className="font-body text-[10px] font-bold uppercase tracking-[0.12em] text-white/55 transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-primary">Contato</a>
      </div>
    </footer>
  )
}

function BlogIndex({ articles }: { articles: BlogArticle[] }) {
  return (
    <>
      <BlogHero articleCount={articles.length} />
      <BlogTopicBar />
      <FeaturedArticles articles={articles} />
      <ArticleCatalog articles={articles} />
      <BlogRadar />
      <BlogCta />
    </>
  )
}

function RelatedArticles({ article, articles }: { article: BlogArticle; articles: BlogArticle[] }) {
  const sameCategory = articles.filter((candidate) => candidate.category === article.category && candidate.slug !== article.slug)
  const related = [...sameCategory, ...articles.filter((candidate) => candidate.slug !== article.slug && candidate.category !== article.category)].slice(0, 2)

  return (
    <section className="bg-[#f2f1ee] py-20 text-[#0d0d0d] md:py-28">
      <div className="mx-auto w-[min(1200px,calc(100vw-32px))]">
        <div className="flex items-end justify-between gap-5">
          <div>
            <p className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-[#c2440a]">Continue explorando</p>
            <h2 className="mt-3 font-display text-4xl font-bold leading-none tracking-[-0.05em] md:text-5xl">Mais da W3</h2>
          </div>
          <a href="/blog#artigos" className="hidden items-center gap-2 font-body text-[11px] font-bold uppercase tracking-[0.1em] text-[#c2440a] sm:inline-flex focus-visible:outline-2 focus-visible:outline-primary">Ver todos <ArrowRight className="size-4" /></a>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {related.map((relatedArticle) => (
            <ArticleCard key={relatedArticle.slug} article={relatedArticle} compact />
          ))}
        </div>
      </div>
    </section>
  )
}

function ArticleView({ article, articles }: { article: BlogArticle; articles: BlogArticle[] }) {
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#080808]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_75%_80%_at_70%_0%,hsl(25_95%_53%_/_0.18),transparent_65%)]" />
        <div className="mx-auto w-[min(1000px,calc(100vw-32px))] py-16 md:py-24">
          <a href="/blog" className="inline-flex items-center gap-2 font-body text-[11px] font-bold uppercase tracking-[0.12em] text-white/55 transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"><ArrowLeft className="size-4" /> Voltar para o blog</a>
          <div className="mt-12 max-w-4xl">
            <p className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{article.category}</p>
            <h1 className="mt-5 font-display text-[clamp(2.8rem,7vw,6.6rem)] font-bold leading-[0.9] tracking-[-0.07em] text-white">{article.title}</h1>
            <p className="mt-7 max-w-2xl font-body text-lg leading-8 text-white/65">{article.excerpt}</p>
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-white/45">
              <time dateTime={article.isoDate}>{article.date}</time>
              <span>{article.readTime}</span>
              <span>Por W3 Tráfego Pago</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f2f1ee] py-14 text-[#0d0d0d] md:py-24">
        <div className="mx-auto grid w-[min(1200px,calc(100vw-32px))] gap-12 lg:grid-cols-[minmax(0,760px)_260px] lg:items-start lg:gap-20">
          <article className="min-w-0">
            <div className="mt-12 space-y-12 md:mt-16 md:space-y-14">
              {article.sections.map((section) => (
                <section key={section.heading} id={sectionId(section.heading)} className="scroll-mt-28">
                  <h2 className="font-display text-3xl font-bold leading-[1] tracking-[-0.04em] md:text-4xl">{section.heading}</h2>
                  <div className="mt-5 space-y-5 font-body text-base leading-8 text-[#3f3f3f]">
                    {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                    {section.bullets && (
                      <ul className="space-y-3 pt-1">
                        {section.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-3">
                            <CheckCircle2 className="mt-1 size-5 shrink-0 text-[#c2440a]" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>
              ))}
            </div>
            <div className="mt-14 rounded-2xl bg-[#0d0d0d] p-6 text-white md:mt-20 md:p-8">
              <p className="font-body text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Insight W3</p>
              <p className="mt-3 font-display text-2xl font-bold leading-tight tracking-[-0.04em] md:text-3xl">A melhor otimização é a que aproxima a mídia da decisão de negócio.</p>
              <a href="/#diagnostico" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 font-body text-[11px] font-bold uppercase tracking-[0.1em] text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">Converse com a W3 <ArrowUpRight className="size-4" /></a>
            </div>
          </article>

          <aside className="lg:sticky lg:top-28">
            <div className="border-t-2 border-[#0d0d0d] pt-4">
              <p className="font-body text-[10px] font-bold uppercase tracking-[0.18em] text-[#6b6b6b]">Neste artigo</p>
              <ol className="mt-5 space-y-3">
                {article.sections.map((section, index) => (
                  <li key={section.heading}>
                    <a href={`#${sectionId(section.heading)}`} className="flex gap-3 font-body text-sm leading-5 text-[#575757] transition-colors hover:text-[#c2440a] focus-visible:outline-2 focus-visible:outline-primary">
                      <span className="font-semibold text-[#c2440a]">0{index + 1}</span>
                      <span>{section.heading}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>
            <div className="mt-10 rounded-2xl border border-black/10 bg-white p-5">
              <BookOpen className="size-5 text-[#c2440a]" />
              <p className="mt-4 font-display text-xl font-bold leading-tight tracking-[-0.03em]">Conteúdo bom é o que vira decisão.</p>
              <p className="mt-3 font-body text-sm leading-6 text-[#575757]">Receba um diagnóstico da sua operação e descubra onde atacar primeiro.</p>
              <a href="/#diagnostico" className="mt-5 inline-flex items-center gap-2 font-body text-[11px] font-bold uppercase tracking-[0.1em] text-[#c2440a] focus-visible:outline-2 focus-visible:outline-primary">Pedir diagnóstico <ArrowRight className="size-4" /></a>
            </div>
          </aside>
        </div>
      </section>

      <RelatedArticles article={article} articles={articles} />
      <BlogCta />
    </>
  )
}

function BlogNotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-[min(800px,calc(100vw-32px))] flex-col items-start justify-center py-20">
      <p className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Blog W3</p>
      <h1 className="mt-4 font-display text-5xl font-bold leading-none tracking-[-0.06em] text-white md:text-7xl">Esse artigo ainda não existe.</h1>
      <p className="mt-5 max-w-lg font-body text-base leading-7 text-white/60">Volte para o arquivo e encontre uma leitura sobre estratégia, mídia e crescimento.</p>
      <a href="/blog" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3.5 font-body text-[11px] font-bold uppercase tracking-[0.1em] text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"><ArrowLeft className="size-4" /> Ver artigos</a>
    </main>
  )
}

function BlogLoading() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-[min(800px,calc(100vw-32px))] items-center py-20">
      <p className="font-body text-sm uppercase tracking-[0.16em] text-white/55">Carregando conteúdo editorial…</p>
    </main>
  )
}

export function BlogPage({ pathname }: BlogPageProps) {
  const { articles, loaded } = useBlogArticles()
  useEffect(() => {
    updateDocumentMetadata(pathname, articles)
  }, [articles, pathname])
  const slug = pathname.replace(/^\/blog\/?/, '').split('/')[0]
  const article = slug ? articles.find((candidate) => candidate.slug === slug) : undefined
  const waitingForRemoteArticle = Boolean(slug && !article && !loaded)

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#080808] text-white">
      <BlogHeader />
      {waitingForRemoteArticle ? <BlogLoading /> : slug && !article ? <BlogNotFound /> : article ? <ArticleView article={article} articles={articles} /> : <BlogIndex articles={articles} />}
      <BlogFooter />
    </div>
  )
}
