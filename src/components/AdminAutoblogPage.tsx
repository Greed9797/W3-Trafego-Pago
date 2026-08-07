import { useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, CalendarClock, CheckCircle2, LockKeyhole, LogOut, RefreshCw, ShieldCheck } from 'lucide-react'
import logoW3 from '@/assets/logo-w3.svg'

type AdminPost = {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  kind: 'evergreen' | 'platform-update'
  status: 'draft' | 'scheduled' | 'published'
  keyword: string | null
  content: { sections?: Array<{ heading?: string; paragraphs?: string[]; bullets?: string[] }> }
  source_url: string | null
  source_collected_at: string | null
  scheduled_for: string | null
  published_at: string | null
}

type ViewFilter = 'all' | AdminPost['status']

function formatDate(value: string | null) {
  if (!value) return 'Sem data'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Data inválida'
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function hasContent(post: AdminPost) {
  return Boolean(post.content?.sections?.some((section) => {
    return Boolean(section.heading && ((section.paragraphs?.length ?? 0) > 0 || (section.bullets?.length ?? 0) > 0))
  }))
}

function statusLabel(status: AdminPost['status']) {
  if (status === 'scheduled') return 'Programado'
  if (status === 'published') return 'Publicado'
  return 'Draft'
}

export function AdminAutoblogPage() {
  const [token, setToken] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [posts, setPosts] = useState<AdminPost[]>([])
  const [filter, setFilter] = useState<ViewFilter>('all')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Admin editorial | W3 Tráfego Pago'
    let robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]')
    if (!robots) {
      robots = document.createElement('meta')
      robots.name = 'robots'
      document.head.appendChild(robots)
    }
    robots.content = 'noindex, nofollow'
  }, [])

  async function loadPosts(showError = true) {
    setBusy(true)
    if (showError) setError('')
    try {
      const response = await fetch('/api/admin/autoblog/posts?status=all', { credentials: 'same-origin' })
      const payload = await response.json() as { posts?: AdminPost[]; error?: string }
      if (response.status === 401) {
        setAuthenticated(false)
        setPosts([])
        return
      }
      if (!response.ok) throw new Error(payload.error || 'Não foi possível carregar os posts.')
      setPosts(Array.isArray(payload.posts) ? payload.posts : [])
      setAuthenticated(true)
    } catch (cause) {
      if (showError) setError(cause instanceof Error ? cause.message : 'Falha ao carregar o painel.')
    } finally {
      setBusy(false)
    }
  }

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError('')
    setMessage('')
    try {
      const response = await fetch('/api/admin/autoblog/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const payload = await response.json() as { error?: string }
      if (!response.ok) throw new Error(payload.error === 'autoblog_not_configured' ? 'Admin ainda não configurado na Vercel.' : 'Token inválido.')
      setToken('')
      setMessage('Sessão segura iniciada.')
      await loadPosts(false)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível entrar.')
      setBusy(false)
    }
  }

  async function logout() {
    await fetch('/api/admin/autoblog/logout', { method: 'POST', credentials: 'same-origin' })
    setAuthenticated(false)
    setPosts([])
    setMessage('Sessão encerrada.')
  }

  async function approve(post: AdminPost) {
    if (!hasContent(post) || !post.source_url) return
    if (!window.confirm(`Publicar “${post.title}”?`)) return
    setBusy(true)
    setError('')
    setMessage('Publicando…')
    try {
      const response = await fetch('/api/admin/autoblog/approve', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: post.id }),
      })
      const payload = await response.json() as { error?: string }
      if (!response.ok) throw new Error(payload.error || 'Não foi possível publicar o draft.')
      setMessage('Post publicado com sucesso.')
      await loadPosts(false)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Falha ao publicar.')
      setBusy(false)
    }
  }

  const visiblePosts = useMemo(() => {
    if (filter === 'all') return posts
    return posts.filter((post) => post.status === filter)
  }, [filter, posts])

  const counts = useMemo(() => ({
    all: posts.length,
    scheduled: posts.filter((post) => post.status === 'scheduled').length,
    draft: posts.filter((post) => post.status === 'draft').length,
    published: posts.filter((post) => post.status === 'published').length,
  }), [posts])

  return (
    <main className="min-h-screen bg-[#f2f1ee] text-[#0d0d0d]">
      <header className="border-b border-black/10 bg-[#0d0d0d] text-white">
        <div className="mx-auto flex w-[min(1200px,calc(100vw-32px))] items-center justify-between gap-5 py-5">
          <a href="/" aria-label="W3 Tráfego Pago — início">
            <img src={logoW3} alt="W3 Tráfego Pago" width={195} height={26} className="h-5 w-auto" />
          </a>
          <span className="font-body text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">Admin editorial</span>
        </div>
      </header>

      <div className="mx-auto w-[min(1200px,calc(100vw-32px))] py-12 md:py-16">
        {!authenticated ? (
          <section className="mx-auto max-w-xl rounded-3xl border border-black/10 bg-white p-7 shadow-[0_18px_60px_rgba(13,13,13,0.08)] md:p-10">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[#0d0d0d] text-[#f55900]"><LockKeyhole className="size-5" /></div>
            <p className="mt-8 font-body text-[10px] font-bold uppercase tracking-[0.2em] text-[#c2440a]">Área protegida</p>
            <h1 className="mt-3 font-display text-4xl font-bold leading-none tracking-[-0.06em] md:text-6xl">Central editorial.</h1>
            <p className="mt-5 font-body text-base leading-7 text-[#575757]">Consulte a fila do autoblog e aprove somente conteúdos com fonte e conteúdo válidos.</p>
            <form className="mt-8" onSubmit={login} autoComplete="off">
              <label htmlFor="admin-token" className="font-body text-xs font-bold uppercase tracking-[0.12em] text-[#3f3f3f]">Token administrativo</label>
              <input
                id="admin-token"
                type="password"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                autoComplete="current-password"
                className="mt-2 w-full rounded-xl border border-black/20 bg-[#f8f7f4] px-4 py-3.5 font-body text-sm outline-none transition focus:border-[#c2440a] focus:ring-2 focus:ring-[#c2440a]/20"
                placeholder="Digite o token configurado na Vercel"
                required
              />
              <button type="submit" disabled={busy} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0d0d0d] px-5 py-3.5 font-body text-[11px] font-bold uppercase tracking-[0.1em] text-white transition hover:bg-[#c2440a] disabled:cursor-wait disabled:opacity-60">
                {busy ? 'Verificando…' : 'Entrar com segurança'} <ShieldCheck className="size-4" />
              </button>
            </form>
            {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 font-body text-sm text-red-800">{error}</p>}
            {message && <p role="status" className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 font-body text-sm text-emerald-800">{message}</p>}
          </section>
        ) : (
          <>
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-[#c2440a]">Autoblog W3</p>
                <h1 className="mt-3 font-display text-5xl font-bold leading-none tracking-[-0.07em] md:text-7xl">Conteúdo em operação.</h1>
                <p className="mt-5 max-w-xl font-body text-base leading-7 text-[#575757]">Os posts programados aguardam suas datas. Drafts externos só podem ser publicados após revisão.</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => loadPosts()} disabled={busy} className="inline-flex items-center gap-2 rounded-full border border-black/15 px-4 py-3 font-body text-[11px] font-bold uppercase tracking-[0.1em] text-[#3f3f3f] transition hover:border-[#c2440a] hover:text-[#c2440a] disabled:opacity-50"><RefreshCw className={`size-4 ${busy ? 'animate-spin' : ''}`} /> Atualizar</button>
                <button type="button" onClick={logout} className="inline-flex items-center gap-2 rounded-full bg-[#0d0d0d] px-4 py-3 font-body text-[11px] font-bold uppercase tracking-[0.1em] text-white transition hover:bg-[#c2440a]"><LogOut className="size-4" /> Sair</button>
              </div>
            </div>

            {message && <p role="status" className="mt-6 rounded-xl bg-emerald-50 px-4 py-3 font-body text-sm text-emerald-800">{message}</p>}
            {error && <p role="alert" className="mt-6 rounded-xl bg-red-50 px-4 py-3 font-body text-sm text-red-800">{error}</p>}

            <div className="mt-10 grid gap-4 md:grid-cols-4">
              {(['all', 'scheduled', 'draft', 'published'] as const).map((key) => (
                <button key={key} type="button" onClick={() => setFilter(key)} className={`rounded-2xl border p-5 text-left transition ${filter === key ? 'border-[#0d0d0d] bg-[#0d0d0d] text-white' : 'border-black/10 bg-white hover:border-[#c2440a]'}`}>
                  <span className="font-body text-[10px] font-bold uppercase tracking-[0.16em] opacity-60">{key === 'all' ? 'Total' : statusLabel(key)}</span>
                  <span className="mt-3 block font-display text-4xl font-bold tracking-[-0.06em]">{counts[key]}</span>
                </button>
              ))}
            </div>

            <section className="mt-10 overflow-hidden rounded-3xl border border-black/10 bg-white">
              <div className="flex items-center justify-between gap-4 border-b border-black/10 px-5 py-5 md:px-7">
                <div>
                  <p className="font-body text-[10px] font-bold uppercase tracking-[0.18em] text-[#c2440a]">Fila editorial</p>
                  <h2 className="mt-2 font-display text-2xl font-bold tracking-[-0.04em]">{visiblePosts.length} registros</h2>
                </div>
                <CalendarClock className="size-5 text-[#c2440a]" />
              </div>
              <div className="divide-y divide-black/10">
                {visiblePosts.map((post) => {
                  const ready = hasContent(post) && Boolean(post.source_url)
                  return (
                    <article key={post.id} className="flex flex-col gap-5 px-5 py-6 md:flex-row md:items-start md:justify-between md:px-7">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 font-body text-[10px] font-bold uppercase tracking-[0.12em]">
                          <span className="rounded-full bg-[#f2f1ee] px-2.5 py-1 text-[#575757]">{post.category}</span>
                          <span className={`rounded-full px-2.5 py-1 ${post.status === 'published' ? 'bg-emerald-100 text-emerald-800' : post.status === 'draft' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'}`}>{statusLabel(post.status)}</span>
                          <span className="text-[#888]">{post.kind === 'platform-update' ? 'Plataforma' : 'Evergreen'}</span>
                        </div>
                        <h3 className="mt-3 max-w-3xl font-display text-xl font-bold leading-tight tracking-[-0.03em] md:text-2xl">{post.title}</h3>
                        <p className="mt-2 max-w-3xl font-body text-sm leading-6 text-[#575757]">{post.excerpt}</p>
                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 font-body text-[11px] text-[#777]">
                          <span>Agendado: {formatDate(post.scheduled_for)}</span>
                          {post.source_url && <a href={post.source_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#c2440a] hover:underline">Fonte oficial <ArrowUpRight className="size-3" /></a>}
                        </div>
                      </div>
                      {post.status === 'draft' && (
                        <div className="shrink-0 md:w-52">
                          <button type="button" onClick={() => approve(post)} disabled={!ready || busy} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0d0d0d] px-4 py-3 font-body text-[11px] font-bold uppercase tracking-[0.08em] text-white transition hover:bg-[#c2440a] disabled:cursor-not-allowed disabled:bg-[#d8d6d1] disabled:text-[#777]">
                            {ready ? <><CheckCircle2 className="size-4" /> Aprovar</> : 'Aguardando fonte'}
                          </button>
                          {!ready && <p className="mt-2 text-center font-body text-[10px] leading-4 text-[#777]">Sem conteúdo/fonte verificável.</p>}
                        </div>
                      )}
                    </article>
                  )
                })}
                {visiblePosts.length === 0 && <p className="px-7 py-12 text-center font-body text-sm text-[#777]">Nenhum registro nesta fila.</p>}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  )
}
