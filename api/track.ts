import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createHash } from 'node:crypto'

const GRAPH_VERSION = 'v21.0'

// Só eventos conhecidos: o endpoint é público, sem allowlist qualquer um polui o pixel.
const ALLOWED_EVENTS = new Set(['PageView', 'Lead', 'Contact', 'ViewContent'])

const MAX_BODY_BYTES = 4096

interface TrackPayload {
  event_name?: unknown
  event_id?: unknown
  event_source_url?: unknown
  fbp?: unknown
  fbc?: unknown
  em?: unknown
  ph?: unknown
  fn?: unknown
}

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

/** Meta exige e-mail/nome em minúsculo sem espaços e telefone só com dígitos, antes do hash. */
function hashEmail(value: unknown): string[] | undefined {
  if (typeof value !== 'string') return undefined
  const normalized = value.trim().toLowerCase()
  return normalized ? [sha256(normalized)] : undefined
}

function hashPhone(value: unknown): string[] | undefined {
  if (typeof value !== 'string') return undefined
  const digits = value.replace(/\D/g, '')
  return digits ? [sha256(digits)] : undefined
}

function hashName(value: unknown): string[] | undefined {
  if (typeof value !== 'string') return undefined
  const normalized = value.trim().toLowerCase()
  return normalized ? [sha256(normalized)] : undefined
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value ? value : undefined
}

function clientIp(req: VercelRequest): string | undefined {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string') return forwarded.split(',')[0]?.trim()
  if (Array.isArray(forwarded)) return forwarded[0]
  return undefined
}

function parseBody(raw: unknown): TrackPayload | null {
  if (typeof raw === 'string') {
    if (Buffer.byteLength(raw) > MAX_BODY_BYTES) return null
    try {
      return JSON.parse(raw) as TrackPayload
    } catch {
      return null
    }
  }
  if (raw && typeof raw === 'object') return raw as TrackPayload
  return null
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).json({ error: 'Método não permitido' })
    return
  }

  const pixelId = process.env.META_PIXEL_ID
  const accessToken = process.env.META_ACCESS_TOKEN
  if (!pixelId || !accessToken) {
    console.error('[track] META_PIXEL_ID ou META_ACCESS_TOKEN não configurado')
    res.status(500).json({ error: 'Rastreamento não configurado' })
    return
  }

  const body = parseBody(req.body)
  if (!body) {
    res.status(400).json({ error: 'Payload inválido' })
    return
  }

  const eventName = body.event_name
  if (typeof eventName !== 'string' || !ALLOWED_EVENTS.has(eventName)) {
    res.status(400).json({ error: 'Evento não permitido' })
    return
  }

  const userData: Record<string, unknown> = {}
  const email = hashEmail(body.em)
  if (email) userData.em = email
  const phone = hashPhone(body.ph)
  if (phone) userData.ph = phone
  const firstName = hashName(body.fn)
  if (firstName) userData.fn = firstName

  // fbp/fbc vão crus — Meta exige assim, não são PII.
  const fbp = asString(body.fbp)
  if (fbp) userData.fbp = fbp
  const fbc = asString(body.fbc)
  if (fbc) userData.fbc = fbc

  const ip = clientIp(req)
  if (ip) userData.client_ip_address = ip
  const userAgent = asString(req.headers['user-agent'])
  if (userAgent) userData.client_user_agent = userAgent

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: asString(body.event_id),
        event_source_url: asString(body.event_source_url),
        action_source: 'website',
        user_data: userData,
      },
    ],
  }

  try {
    const response = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, access_token: accessToken }),
    })

    if (!response.ok) {
      // Log fica no servidor; a resposta ao cliente nunca expõe token nem detalhe da Meta.
      const detail = await response.text()
      console.error(`[track] Meta CAPI ${response.status}: ${detail}`)
      res.status(502).json({ error: 'Falha ao registrar evento' })
      return
    }

    res.status(200).json({ success: true })
  } catch (error: unknown) {
    console.error('[track] erro ao chamar Meta CAPI', error)
    res.status(502).json({ error: 'Falha ao registrar evento' })
  }
}
