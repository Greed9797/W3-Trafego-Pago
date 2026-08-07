import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { ArrowUpRight, CalendarClock, FileText, LayoutDashboard, LockKeyhole, LogOut, RefreshCw, ShieldCheck } from 'lucide-react'
import logoW3 from '@/assets/logo-w3.svg'

type AdminPostSummary = {
  id: string
  title: string
  category: string
  kind: 'evergreen' | 'platform-update'
  status: 'draft' | 'scheduled' | 'published'
  scheduled_for: string | null
}

type PostsPayload = {
  posts?: AdminPostSummary[]
  error?: string
}

function statusLabel(status: AdminPostSummary['status']) {
  if (status === 'scheduled') return 'Programado'
  if (status === 'published') return 'Publicado'
  return 'Draft'
}

function formatDate(value: string | null) {
  if (!value) return 'Sem data'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Data inválida'
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    dateStyle: 'medium',
  }).format(date)
}

function statusClass(status: AdminPostSummary['status']) {
  if (status === 'published') return 'bg-emerald-100 text-emerald-800'
  if (status === 'draft') return 'bg-amber-100 text-amber-800'
  return 'bg-sky-100 text-sky-800'
}

export function AdminPage() {
  const [token, setToken] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [posts, setPosts] = useState<AdminPostSummary[]>([])
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Admin | W3 Tráfego Pago'
    let robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]')
    if (!robots) {
      robots = document.createElement('meta')
      robots.name = 'robots'
      document.head.appendChild(robots)
    }
    robots.content = 'noindex, nofollow'
  }, [])

  async function loadSummary(showError = true) {
    setBusy(true)
    if (showError) setError('')
    try {
      const response = await fetch('/api/admin/autoblog/posts?status=all', { credentials: 'same-origin' })
      const payload = await response.json() as PostsPayload
      if (response.status === 401) {
        setAuthenticated(false)
        setPosts([])
        return
      }
      if (!response.ok) throw new Error(payload.error || 'Não foi possível carregar o resumo.')
      setPosts(Array.isArray(payload.posts) ? payload.posts : [])
      setAuthenticated(true)
    } catch (cause) {
      if (showError) setError(cause instanceof Error ? cause.message : 'Falha ao carregar o painel.')
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadSummary(false)
    }, 0)
    return () => window.clearTimeout(timer)
  }, [])

  async function login(event: FormEvent<HTMLFormElement>) {
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
      await loadSummary(false)
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

  const counts = useMemo(() => ({
    all: posts.length,
    scheduled: posts.filter((post) => post.status === 'scheduled').length,
    draft: posts.filter((post) => post.status === 'draft').length,
    published: posts.filter((post) => post.status === 'published').length,
  }), [posts])

  return (
    <main className="min-h-screen bg-[#f2f1ee] text-[#0d0d0d]">
      <header className="border-b border-white/10 bg-[#0d0d0d] text-white">
        <div className="mx-auto flex w-[min(1200px,calc(100vw-32px))] items-center justify-between gap-5 py-5">
          <a href="/" aria-label="W3 Tráfego Pago — início">
            <img src={logoW3} alt="W3 Tráfego Pago" width={195} height={26} className="h-5 w-auto" />
          </a>
          <span className="font-body text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">Central administrativa</span>
        </div>
      </header>

      <div className="mx-auto w-[min(1200px,calc(100vw-32px))] py-12 md:py-16">
        {!authenticated ? (
          <section className="mx-auto max-w-xl rounded-3xl border border-black/10 bg-white p-7 shadow-[0_18px_60px_rgba(13,13,13,0.08)] md:p-10">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[#0d0d0d] text-[#f55900]"><LockKeyhole className="size-5" /></div>
            <p className="mt-8 font-body text-[10px] font-bold uppercase tracking-[0.2em] text-[#c2440a]">Área protegida</p>
            <h1 className="mt-3 font-display text-4xl font-bold leading-none tracking-[-0.06em] md:text-6xl">Central W3.</h1>
            <p className="mt-5 font-body text-base leading-7 text-[#575757]">Gerencie o conteúdo do blog, acompanhe o AutoBlog e revise o que está pronto para publicação.</p>
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
                <p className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-[#c2440a]">W3 Tráfego Pago</p>
                <h1 className="mt-3 font-display text-5xl font-bold leading-none tracking-[-0.07em] md:text-7xl">Operação sob controle.</h1>
                <p className="mt-5 max-w-xl font-body text-base leading-7 text-[#575757]">Uma visão geral do conteúdo editorial e das rotinas automatizadas do site.</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => loadSummary()} disabled={busy} className="inline-flex items-center gap-2 rounded-full border border-black/15 px-4 py-3 font-body text-[11px] font-bold uppercase tracking-[0.1em] text-[#3f3f3f] transition hover:border-[#c2440a] hover:text-[#c2440a] disabled:opacity-50"><RefreshCw className={`size-4 ${busy ? 'animate-spin' : ''}`} /> Atualizar</button>
                <button type="button" onClick={logout} className="inline-flex items-center gap-2 rounded-full bg-[#0d0d0d] px-4 py-3 font-body text-[11px] font-bold uppercase tracking-[0.1em] text-white transition hover:bg-[#c2440a]"><LogOut className="size-4" /> Sair</button>
              </div>
            </div>

            {message && <p role="status" className="mt-6 rounded-xl bg-emerald-50 px-4 py-3 font-body text-sm text-emerald-800">{message}</p>}
            {error && <p role="alert" className="mt-6 rounded-xl bg-red-50 px-4 py-3 font-body text-sm text-red-800">{error}</p>}

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ['Conteúdo total', counts.all, 'bg-white'],
                ['Programados', counts.scheduled, 'bg-sky-50'],
                ['Em revisão', counts.draft, 'bg-amber-50'],
                ['Publicados', counts.published, 'bg-emerald-50'],
              ].map(([label, value, tone]) => (
                <div key={label as string} className={`rounded-2xl border border-black/10 p-5 ${tone}`}>
                  <span className="font-body text-[10px] font-bold uppercase tracking-[0.16em] text-[#575757]">{label}</span>
                  <span className="mt-3 block font-display text-4xl font-bold tracking-[-0.06em]">{value}</span>
                </div>
              ))}
            </div>

            <section className="mt-10 grid gap-5 md:grid-cols-2">
              <a href="/admin/content" className="group rounded-3xl border border-black/10 bg-white p-7 transition hover:-translate-y-1 hover:border-[#c2440a] hover:shadow-[0_18px_40px_rgba(13,13,13,0.08)]">
                <div className="flex items-start justify-between gap-5"><div className="flex size-12 items-center justify-center rounded-2xl bg-[#0d0d0d] text-[#f55900]"><FileText className="size-5" /></div><ArrowUpRight className="size-5 text-[#c2440a] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></div>
                <p className="mt-8 font-body text-[10px] font-bold uppercase tracking-[0.2em] text-[#c2440a]">Módulo editorial</p>
                <h2 className="mt-2 font-display text-3xl font-bold tracking-[-0.05em]">Conteúdo do blog</h2>
                <p className="mt-3 max-w-md font-body text-sm leading-6 text-[#575757]">Filtre posts, acompanhe datas, veja fontes e revise o que pode ser publicado.</p>
                <span className="mt-6 inline-flex items-center gap-2 font-body text-[11px] font-bold uppercase tracking-[0.1em] text-[#0d0d0d]">Abrir conteúdo <span aria-hidden="true">→</span></span>
              </a>
              <a href="/admin/autoblog" className="group rounded-3xl border border-black/10 bg-[#0d0d0d] p-7 text-white transition hover:-translate-y-1 hover:bg-[#24140c] hover:shadow-[0_18px_40px_rgba(13,13,13,0.16)]">
                <div className="flex items-start justify-between gap-5"><div className="flex size-12 items-center justify-center rounded-2xl bg-[#f55900] text-[#0d0d0d]"><LayoutDashboard className="size-5" /></div><ArrowUpRight className="size-5 text-[#ff8a4d] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></div>
                <p className="mt-8 font-body text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff8a4d]">Módulo automatizado</p>
                <h2 className="mt-2 font-display text-3xl font-bold tracking-[-0.05em]">AutoBlog</h2>
                <p className="mt-3 max-w-md font-body text-sm leading-6 text-white/65">Acompanhe sinais, drafts de plataforma e a fila de aprovação humana.</p>
                <span className="mt-6 inline-flex items-center gap-2 font-body text-[11px] font-bold uppercase tracking-[0.1em] text-white">Abrir AutoBlog <span aria-hidden="true">→</span></span>
              </a>
            </section>

            <section className="mt-10 overflow-hidden rounded-3xl border border-black/10 bg-white">
              <div className="flex items-center justify-between gap-4 border-b border-black/10 px-5 py-5 md:px-7"><div><p className="font-body text-[10px] font-bold uppercase tracking-[0.18em] text-[#c2440a]">Atividade recente</p><h2 className="mt-2 font-display text-2xl font-bold tracking-[-0.04em]">Últimos conteúdos</h2></div><CalendarClock className="size-5 text-[#c2440a]" /></div>
              <div className="divide-y divide-black/10">
                {posts.slice(0, 5).map((post) => <article key={post.id} className="flex flex-col gap-3 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-7"><div className="min-w-0"><p className="truncate font-display text-lg font-bold tracking-[-0.03em]">{post.title}</p><p className="mt-1 font-body text-xs text-[#777]">{post.category} · {post.kind === 'platform-update' ? 'Plataforma' : 'Evergreen'} · {formatDate(post.scheduled_for)}</p></div><span className={`w-fit rounded-full px-2.5 py-1 font-body text-[10px] font-bold uppercase tracking-[0.1em] ${statusClass(post.status)}`}>{statusLabel(post.status)}</span></article>)}
                {posts.length === 0 && <p className="px-7 py-12 text-center font-body text-sm text-[#777]">Nenhum conteúdo encontrado.</p>}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  )
}
