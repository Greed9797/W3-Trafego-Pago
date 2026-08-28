import { useEffect, useMemo } from 'react'
import landingPage from '@/legacy/landing.html?raw'
import { N8N_WEBHOOK_URL } from '@/lib/constants'
import { lenis } from '@/lib/lenis'
import { capiTrack } from '@/lib/tracking'

// A landing foi desenhada e validada fora deste repo, como HTML+CSS de uma peça só.
// Em vez de reescrevê-la em componentes, ela entra crua e este arquivo religa o que
// dependia dos <script> do original: reveals de scroll, header, modal e formulário.

const EDITOR_RAW_PREFIX = /\/api\/projects\/[^/]+\/raw\//g
const EDITOR_QUERY = /\?workspaceId=[^"'\s)]*/g

const THANK_YOU_URL = '/obrigado.html'

interface LeadData {
  fullName: string
  email: string
  whatsapp: string
  store: string
  revenue: string
  platform: string
}

// O CRM recebe leads do Meta Lead Ads com as faixas em minúsculo e underscore.
// As faixas desta landing são mais estreitas que as do CRM, então cada uma cai no
// balde do CRM que contém o seu ponto médio — lead de anúncio e lead da landing
// continuam filtráveis juntos. `faturamento_faixa` leva o rótulo exato do form.
const CRM_REVENUE: Record<string, string> = {
  'ate-20k': 'Até R$20 mil ao mês',
  '20k-50k': 'R$20 mil a R$50 mil ao mês',
  '50k-100k': 'R$50 mil a R$200 mil ao mês',
  '100k-300k': 'R$50 mil a R$200 mil ao mês',
  'acima-300k': 'R$200 mil a R$1 milhão ao mês',
}

function toCrmValue(label: string): string {
  return label.toLowerCase().replace(/ /g, '_')
}

// E.164, igual aos leads do Meta. Número nacional (10-11 dígitos) recebe o DDI;
// acima disso o DDI já veio.
function toE164(value: string): string {
  const d = value.replace(/\D/g, '')
  return d.length >= 12 ? `+${d}` : `+55${d}`
}

function normalizeSite(value: string): string {
  const t = value.trim()
  return /^https?:\/\//i.test(t) ? t : `https://${t}`
}

function normalizeMarkup(value: string): string {
  return value
    .replace(EDITOR_RAW_PREFIX, '/')
    .replace(EDITOR_QUERY, '')
    .replaceAll('&amp;', '&')
    // O blog é rota do app (React + autoblog), não um arquivo estático.
    .replaceAll('./blog.html', '/blog')
}

function extractPage(source: string): { styles: string; markup: string } {
  if (typeof DOMParser === 'undefined') return { styles: '', markup: '' }

  const parsed = new DOMParser().parseFromString(source, 'text/html')
  const styleNode = parsed.head.querySelector('style')

  // Os <script> do original viram os efeitos deste componente.
  parsed.body.querySelectorAll('script').forEach((script) => script.remove())

  return {
    styles: normalizeMarkup(styleNode?.textContent ?? ''),
    markup: normalizeMarkup(parsed.body.innerHTML),
  }
}

function validateLead(data: LeadData): string | null {
  if (data.fullName.trim().length < 3) return 'Informe seu nome completo.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) return 'Informe um e-mail válido.'
  if (data.whatsapp.replace(/\D/g, '').length < 10) return 'Informe um WhatsApp com DDD.'
  if (data.store.trim().length < 4) return 'Informe o site da sua loja.'
  if (!data.revenue) return 'Selecione a faixa de faturamento.'
  if (!data.platform) return 'Selecione onde você já anuncia.'
  return null
}

// O CSS da landing já espera `has-motion` no <html> e `data-reveal` nos alvos;
// quem marcava isso era o script removido em extractPage.
const REVEAL_GROUPS = [
  '.proof-item', '.pillar', '.step', '.case', '.question-list li', '.faq-item',
  '.own-case-copy > *',
]
const REVEAL_SINGLES = [
  '.section-head', '.proof-note', '.diagnosis-verdict', '.closing .container > *',
  '.brands-label', '.brands-marquee',
]
// Foto de fundo: só escala, sem fade, para não competir com o texto por cima.
const REVEAL_MEDIA = ['.own-case-media img']
const REVEAL_STEP = 0.06
// O stagger para no 4º item: lista longa escalonada faz a página parecer lenta.
const REVEAL_MAX_STEPS = 3

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function markReveal(selectors: string[], attribute: string, staggered: boolean): Element[] {
  const marked: Element[] = []

  selectors.forEach((selector) => {
    document.querySelectorAll<HTMLElement>(selector).forEach((el, index) => {
      el.setAttribute(attribute, '')
      if (staggered) {
        const steps = Math.min(index, REVEAL_MAX_STEPS)
        el.style.setProperty('--reveal-delay', `${steps * REVEAL_STEP}s`)
      }
      marked.push(el)
    })
  })

  return marked
}

function maskWhatsapp(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  let formatted = ''

  if (digits.length) formatted = `(${digits.slice(0, 2)}`
  if (digits.length >= 3) formatted += `) ${digits.slice(2, 7)}`
  if (digits.length >= 8) formatted += `-${digits.slice(7)}`

  return formatted
}

export function LegacyLanding() {
  const page = useMemo(() => extractPage(landingPage), [])

  // O smooth scroll do Lenis (ligado no boot para o design anterior) sequestra a
  // roda do mouse, e o `overflow: hidden` que trava o fundo com o modal aberto não
  // o alcança. Esta landing rola nativo.
  useEffect(() => {
    lenis.destroy()
  }, [])

  // Revelação na entrada em cena. Uma passada só: quem já apareceu não volta a
  // sumir, então o observer se desliga elemento a elemento.
  useEffect(() => {
    if (!page.markup) return
    if (prefersReducedMotion() || !('IntersectionObserver' in window)) return

    const targets = [
      ...markReveal(REVEAL_MEDIA, 'data-reveal-media', false),
      ...markReveal(REVEAL_SINGLES, 'data-reveal', false),
      ...markReveal(REVEAL_GROUPS, 'data-reveal', true),
    ]

    if (!targets.length) return

    document.documentElement.classList.add('has-motion')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-in')
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.1 }
    )

    targets.forEach((el) => observer.observe(el))

    return () => {
      observer.disconnect()
      document.documentElement.classList.remove('has-motion')
    }
  }, [page.markup])

  // Cabeçalho: ganha borda e sombra assim que sai do topo. Uma sentinela de 1px
  // evita ouvir o evento de scroll a cada frame.
  useEffect(() => {
    if (!page.markup) return

    const header = document.querySelector<HTMLElement>('.site-header')
    if (!header || !('IntersectionObserver' in window)) return

    const sentinel = document.createElement('div')
    sentinel.setAttribute('aria-hidden', 'true')
    sentinel.style.cssText =
      'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;'
    document.body.prepend(sentinel)

    const observer = new IntersectionObserver(
      (entries) => {
        header.dataset.scrolled = String(!entries[0].isIntersecting)
      },
      { threshold: 0 }
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
      sentinel.remove()
      delete header.dataset.scrolled
    }
  }, [page.markup])

  useEffect(() => {
    if (!page.markup) return

    const modal = document.getElementById('diagnostico') as HTMLDialogElement | null
    const closeButton = document.getElementById('leadModalClose')
    const form = document.getElementById('leadForm') as HTMLFormElement | null
    const status = document.getElementById('formStatus')
    const submitButton = document.getElementById('submitBtn') as HTMLButtonElement | null
    const whatsapp = document.getElementById('whatsapp') as HTMLInputElement | null

    if (!modal || !closeButton || !form || !status || !submitButton) return

    const setBodyLocked = (locked: boolean) => {
      document.documentElement.style.overflow = locked ? 'hidden' : ''
    }

    const openModal = (event?: Event) => {
      event?.preventDefault()
      if (!modal.open) modal.showModal()
      setBodyLocked(true)
    }

    // Fechar sem animação faz o painel piscar para fora. O <dialog> só fecha
    // depois da saída — com timer de segurança, porque `animationend` não
    // dispara se a aba estiver em segundo plano.
    let closingTimer: number | null = null

    const finishClose = (event?: AnimationEvent) => {
      // Sem o filtro, a animação de um filho (a mensagem do formulário, por
      // exemplo) fecharia o modal antes da hora.
      if (event && event.animationName !== 'modalOut') return
      if (closingTimer) window.clearTimeout(closingTimer)
      closingTimer = null
      modal.removeEventListener('animationend', finishClose)
      modal.classList.remove('is-closing')
      modal.close()
    }

    const closeModal = () => {
      if (!modal.open) return
      if (prefersReducedMotion()) {
        modal.close()
        return
      }
      if (closingTimer) return

      modal.classList.add('is-closing')
      closingTimer = window.setTimeout(finishClose, 320)
      modal.addEventListener('animationend', finishClose)
    }

    const handleModalClose = () => {
      if (closingTimer) window.clearTimeout(closingTimer)
      closingTimer = null
      modal.removeEventListener('animationend', finishClose)
      modal.classList.remove('is-closing')
      setBodyLocked(false)
    }
    const handleBackdropClick = (event: MouseEvent) => {
      if (event.target === modal) closeModal()
    }
    const triggers = [...document.querySelectorAll<HTMLAnchorElement>('a[href="#diagnostico"]')]
    const handleWhatsappInput = (event: Event) => {
      const input = event.target as HTMLInputElement
      input.value = maskWhatsapp(input.value)
    }
    const setStatus = (state: string, message: string) => {
      status.dataset.state = state
      status.textContent = message
    }

    const handleSubmit = async (event: SubmitEvent) => {
      event.preventDefault()

      const values = Object.fromEntries(new FormData(form).entries())
      const data: LeadData = {
        fullName: String(values.fullName ?? ''),
        email: String(values.email ?? ''),
        whatsapp: String(values.whatsapp ?? ''),
        store: String(values.store ?? ''),
        revenue: String(values.revenue ?? ''),
        platform: String(values.platform ?? ''),
      }
      const problem = validateLead(data)

      if (problem) {
        setStatus('error', problem)
        return
      }

      const originalText = submitButton.textContent ?? ''
      let redirecting = false
      submitButton.disabled = true
      submitButton.textContent = 'Enviando…'

      const siteUrl = normalizeSite(data.store)
      const revenueLabel = CRM_REVENUE[data.revenue] ?? data.revenue

      try {
        // urlencoded = "simple request": sem preflight CORS (o webhook N8N não
        // responde OPTIONS). O workflow "Landing page -> Tráfego Pago CRM" só
        // repassa uma allowlist de chaves; `email`, `plataforma` e
        // `faturamento_faixa` só chegam ao CRM depois de entrarem nessa lista.
        if (!N8N_WEBHOOK_URL) throw new Error('webhook não configurado')

        const response = await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          body: new URLSearchParams({
            nome: data.fullName.trim(),
            telefone: toE164(data.whatsapp),
            site: siteUrl,
            faturamento: toCrmValue(revenueLabel),
            faturamento_faixa: data.revenue,
            email: data.email.trim().toLowerCase(),
            plataforma: data.platform,
            origem: 'Landing W3 Tráfego Pago',
          }),
          keepalive: true,
        })
        if (!response.ok) throw new Error(`status ${response.status}`)

        // Pixel + CAPI com o mesmo event_id; os dados vão hasheados no servidor.
        capiTrack('Lead', {
          em: data.email.trim(),
          ph: toE164(data.whatsapp),
          fn: data.fullName.trim().split(' ')[0],
        })

        form.reset()
        setStatus(
          'ok',
          `Recebemos seus dados, ${data.fullName.trim().split(' ')[0]}. Redirecionando…`
        )
        // O botão não volta ao estado normal: a navegação já está a caminho e
        // reabilitá-lo convidaria a um segundo envio.
        redirecting = true
        submitButton.textContent = 'Redirecionando…'
        window.location.assign(THANK_YOU_URL)
      } catch {
        setStatus('error', 'Não conseguimos enviar agora. Tente novamente em instantes.')
      } finally {
        if (!redirecting) {
          submitButton.disabled = false
          submitButton.textContent = originalText
        }
      }
    }

    closeButton.addEventListener('click', closeModal)
    modal.addEventListener('close', handleModalClose)
    modal.addEventListener('click', handleBackdropClick)
    triggers.forEach((trigger) => trigger.addEventListener('click', openModal))
    whatsapp?.addEventListener('input', handleWhatsappInput)
    form.addEventListener('submit', handleSubmit)

    if (window.location.hash === '#diagnostico') openModal()

    return () => {
      setBodyLocked(false)
      if (closingTimer) window.clearTimeout(closingTimer)
      modal.removeEventListener('animationend', finishClose)
      closeButton.removeEventListener('click', closeModal)
      modal.removeEventListener('close', handleModalClose)
      modal.removeEventListener('click', handleBackdropClick)
      triggers.forEach((trigger) => trigger.removeEventListener('click', openModal))
      whatsapp?.removeEventListener('input', handleWhatsappInput)
      form.removeEventListener('submit', handleSubmit)
    }
  }, [page.markup])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: page.styles }} />
      <div className="page-root" dangerouslySetInnerHTML={{ __html: page.markup }} />
    </>
  )
}
