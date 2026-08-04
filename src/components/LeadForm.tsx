import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Loader2, MessageCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SplitHeading } from './SplitHeading'
import { CTA_HREF, N8N_WEBHOOK_URL } from '@/lib/constants'

const WHATSAPP_PHONE = '5568992523482'

// Faixas espelham o formulário de Lead Ads do Meta — não alterar sem ajustar
// o parser de faixa do code node "Qualificar + Roleta" no N8N.
const FATURAMENTOS = [
  'Ainda não faturo',
  'Até R$20 mil ao mês',
  'R$20 mil a R$50 mil ao mês',
  'R$50 mil a R$200 mil ao mês',
  'R$200 mil a R$1 milhão ao mês',
  'Acima de R$1 milhão ao mês',
] as const

const INVESTIMENTOS = [
  'Ainda não invisto',
  'Até R$5 mil por mês',
  'R$5 mil a R$10 mil por mês',
  'R$10 mil a R$50 mil por mês',
  'R$50 mil a R$100 mil por mês',
  'Acima de R$100 mil por mês',
] as const

type Errors = Partial<
  Record<'nome' | 'numero' | 'site' | 'faturamento' | 'investimento', string>
>

function digits(v: string) {
  return v.replace(/\D/g, '')
}

// ponytail: valida domínio, não URL completa — lead digita "minhaloja.com.br" sem protocolo.
function isValidSite(v: string) {
  const host = v.trim().replace(/^https?:\/\//i, '').replace(/\/.*$/, '')
  return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(host)
}

function normalizeSite(v: string) {
  const t = v.trim()
  return /^https?:\/\//i.test(t) ? t : `https://${t}`
}

const inputBase =
  'w-full rounded-xl bg-white/[0.04] border px-4 py-3 font-body text-sm text-foreground placeholder:text-foreground/35 outline-none transition-colors focus:border-primary/60 focus:bg-white/[0.06]'

interface SelectFieldProps {
  id: string
  label: string
  placeholder: string
  value: string
  options: readonly string[]
  error?: string
  onChange: (value: string) => void
}

function SelectField({ id, label, placeholder, value, options, error, onChange }: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-body text-xs font-medium uppercase tracking-wider text-foreground/55">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          className={`${inputBase} appearance-none pr-10 ${error ? 'border-destructive/70' : 'border-border'} ${
            value ? 'text-foreground' : 'text-foreground/35'
          }`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o} value={o} className="bg-background text-foreground">
              {o}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-foreground/40" />
      </div>
      {error && <span className="font-body text-xs text-destructive">{error}</span>}
    </div>
  )
}

export function LeadForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [nome, setNome] = useState('')
  const [numero, setNumero] = useState('')
  const [site, setSite] = useState('')
  const [faturamento, setFaturamento] = useState('')
  const [investimento, setInvestimento] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [waUrl, setWaUrl] = useState('')
  const nameInputRef = useRef<HTMLInputElement>(null)

  function closeModal() {
    setIsOpen(false)
    setStatus('idle')
    setWaUrl('')
    if (window.location.hash === CTA_HREF) history.replaceState(null, '', window.location.pathname + window.location.search)
  }

  useEffect(() => {
    const syncModalWithHash = () => setIsOpen(window.location.hash === CTA_HREF)

    syncModalWithHash()
    window.addEventListener('hashchange', syncModalWithHash)
    return () => window.removeEventListener('hashchange', syncModalWithHash)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    document.body.style.overflow = 'hidden'
    const focusTimer = window.setTimeout(() => nameInputRef.current?.focus(), 0)
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeModal()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.clearTimeout(focusTimer)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  function validate(): Errors {
    const e: Errors = {}
    if (nome.trim().length < 2) e.nome = 'Informe seu nome.'
    if (digits(numero).length < 10) e.numero = 'Informe um número com DDD.'
    if (!site.trim()) e.site = 'Informe o site da sua loja.'
    else if (!isValidSite(site)) e.site = 'Informe um endereço válido (ex.: minhaloja.com.br).'
    if (!faturamento) e.faturamento = 'Selecione o faturamento.'
    if (!investimento) e.investimento = 'Selecione o investimento em tráfego.'
    return e
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length > 0) return

    setStatus('sending')

    // Envia lead ao N8N (Pipedrive) — fire-and-forget, não bloqueia o WhatsApp.
    // O workflow N8N "Landing page -> Tráfego Pago CRM" repassa uma allowlist explícita
    // de chaves para leads-push (/api/ingest-lead), renomeando faturamento →
    // faturamento_ecommerce e investimento → investimento_trafego. Chave nova aqui só
    // chega ao CRM depois de ser adicionada lá.
    // urlencoded = "simple request": sem preflight CORS (webhook N8N não responde OPTIONS).
    const siteUrl = normalizeSite(site)
    if (N8N_WEBHOOK_URL) {
      fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        body: new URLSearchParams({
          nome: nome.trim(),
          telefone: numero.trim(),
          site: siteUrl,
          faturamento,
          investimento,
        }),
        keepalive: true,
      }).catch((err) => console.error('Falha ao enviar lead ao N8N:', err))
    }

    const msg =
      `Olá! Quero um diagnóstico da W3 Tráfego Pago.\n\n` +
      `Nome: ${nome.trim()}\n` +
      `WhatsApp: ${numero.trim()}\n` +
      `Site: ${siteUrl}\n` +
      `Faturamento mensal: ${faturamento}\n` +
      `Investimento em tráfego: ${investimento}`
    const url = `https://api.whatsapp.com/send/?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(msg)}&type=phone_number&app_absent=0`
    setWaUrl(url)
    window.open(url, '_blank', 'noopener,noreferrer')
    setStatus('sent')
  }

  if (!isOpen) return null

  return (
    <section
      id="diagnostico"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/75 px-4 py-5 backdrop-blur-sm"
      data-section="lead"
      role="dialog"
      aria-modal="true"
      aria-label="Receba seu diagnóstico"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeModal()
      }}
    >
      <div className="relative max-h-[calc(100dvh-2.5rem)] w-full max-w-xl overflow-y-auto rounded-[22px] liquid-glass p-6 md:p-8">
        <button
          type="button"
          onClick={closeModal}
          className="absolute right-4 top-4 inline-flex size-9 items-center justify-center rounded-full text-foreground/60 transition-colors hover:bg-white/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Fechar formulário"
        >
          <X className="size-5" />
        </button>
        <div className="text-center pr-10">
          <span className="liquid-glass rounded-full px-3 py-1 md:px-4 md:py-1.5 text-[10px] md:text-xs font-body uppercase tracking-widest text-foreground/60">
            Diagnóstico gratuito
          </span>
          <SplitHeading
            text="Receba seu diagnóstico"
            className="mt-4 md:mt-6 font-display font-bold text-[clamp(30px,6vw,58px)] leading-[0.95] tracking-[-0.03em]"
          />
          <p className="mt-4 font-body text-sm md:text-base text-foreground/60">
            Preencha os dados e continue a conversa no WhatsApp em segundos.
          </p>
        </div>

        {status === 'sent' ? (
          <div className="liquid-glass mt-10 rounded-[22px] p-8 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Check className="size-6" />
            </div>
            <h3 className="mt-4 font-display text-xl font-bold text-foreground">Dados recebidos</h3>
            <p className="mt-2 font-body text-sm text-foreground/60">
              Abrimos o WhatsApp em outra aba. Não abriu?
            </p>
            <Button variant="hero" asChild className="mt-5">
              <a href={waUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 size-4" /> Abrir conversa
              </a>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-5">
            {/* Nome */}
            <div className="flex flex-col gap-2">
              <label htmlFor="lf-nome" className="font-body text-xs font-medium uppercase tracking-wider text-foreground/55">
                Nome
              </label>
              <input
                id="lf-nome"
                ref={nameInputRef}
                type="text"
                autoComplete="name"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                aria-invalid={!!errors.nome}
                placeholder="Seu nome completo"
                className={`${inputBase} ${errors.nome ? 'border-destructive/70' : 'border-border'}`}
              />
              {errors.nome && <span className="font-body text-xs text-destructive">{errors.nome}</span>}
            </div>

            {/* Número */}
            <div className="flex flex-col gap-2">
              <label htmlFor="lf-numero" className="font-body text-xs font-medium uppercase tracking-wider text-foreground/55">
                WhatsApp
              </label>
              <input
                id="lf-numero"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                aria-invalid={!!errors.numero}
                placeholder="(00) 00000-0000"
                className={`${inputBase} ${errors.numero ? 'border-destructive/70' : 'border-border'}`}
              />
              {errors.numero && <span className="font-body text-xs text-destructive">{errors.numero}</span>}
            </div>

            {/* Site */}
            <div className="flex flex-col gap-2">
              <label htmlFor="lf-site" className="font-body text-xs font-medium uppercase tracking-wider text-foreground/55">
                Site
              </label>
              <input
                id="lf-site"
                type="text"
                inputMode="url"
                autoComplete="url"
                value={site}
                onChange={(e) => setSite(e.target.value)}
                aria-invalid={!!errors.site}
                placeholder="minhaloja.com.br"
                className={`${inputBase} ${errors.site ? 'border-destructive/70' : 'border-border'}`}
              />
              {errors.site && <span className="font-body text-xs text-destructive">{errors.site}</span>}
            </div>

            {/* Faturamento */}
            <SelectField
              id="lf-fat"
              label="Faturamento mensal do e-commerce"
              placeholder="Selecione uma faixa"
              value={faturamento}
              options={FATURAMENTOS}
              error={errors.faturamento}
              onChange={(v) => {
                setFaturamento(v)
                setErrors((prev) => ({ ...prev, faturamento: undefined }))
              }}
            />

            {/* Investimento em tráfego */}
            <SelectField
              id="lf-inv"
              label="Investimento mensal em tráfego pago"
              placeholder="Selecione uma faixa"
              value={investimento}
              options={INVESTIMENTOS}
              error={errors.investimento}
              onChange={(v) => {
                setInvestimento(v)
                setErrors((prev) => ({ ...prev, investimento: undefined }))
              }}
            />

            <Button type="submit" variant="hero" disabled={status === 'sending'} className="mt-1 w-full">
              {status === 'sending' ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Enviando…
                </>
              ) : (
                <>
                  <MessageCircle className="mr-2 size-4" /> Falar com Especialista
                </>
              )}
            </Button>
          </form>
        )}
      </div>
    </section>
  )
}
