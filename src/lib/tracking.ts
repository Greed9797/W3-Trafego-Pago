const CAPI_ENDPOINT = '/api/track'

type PixelExtra = Record<string, string | undefined>

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    _pvId?: string
  }
}

function getCookie(name: string): string {
  const match = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')
  return match ? (match.pop() ?? '') : ''
}

function sendToServer(payload: Record<string, unknown>): void {
  const json = JSON.stringify(payload)
  if (navigator.sendBeacon) {
    navigator.sendBeacon(CAPI_ENDPOINT, new Blob([json], { type: 'application/json' }))
    return
  }
  // keepalive garante o envio mesmo se a navegação começar (clique no CTA sai do site).
  fetch(CAPI_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: json,
    keepalive: true,
  }).catch(() => {})
}

/** Dispara o evento no pixel e na CAPI com o MESMO event_id — é o que faz a Meta deduplicar. */
export function capiTrack(eventName: string, extra?: PixelExtra): void {
  const eventId = `${eventName}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  window.fbq?.('track', eventName, {}, { eventID: eventId })
  sendToServer({
    event_name: eventName,
    event_id: eventId,
    event_source_url: location.href,
    fbp: getCookie('_fbp'),
    fbc: getCookie('_fbc'),
    ...extra,
  })
}

export function initTracking(): void {
  // PageView server-side reusando o event_id que o pixel gerou no index.html.
  sendToServer({
    event_name: 'PageView',
    event_id: window._pvId,
    event_source_url: location.href,
    fbp: getCookie('_fbp'),
    fbc: getCookie('_fbc'),
  })

  // Todos os CTAs são links de WhatsApp — o clique é o Lead. Listener delegado
  // cobre qualquer CTA novo sem precisar tocar em cada componente.
  document.addEventListener('click', (event) => {
    const target = event.target
    if (!(target instanceof Element)) return
    const link = target.closest('a[href*="api.whatsapp.com"], a[href*="wa.me"]')
    if (link) capiTrack('Lead')
  })
}
