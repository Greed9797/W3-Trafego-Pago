export const BRAND_NAME = "W3 Tráfego Pago"
// CTAs da página abrem o formulário em modal (#diagnostico). O WhatsApp é acionado após o envio.
export const CTA_HREF = "#diagnostico"
export const CTA_LABEL = "Falar com Especialista"

// Webhook N8N (Landing page → Pipedrive). Override opcional via VITE_N8N_WEBHOOK_URL.
export const N8N_WEBHOOK_URL =
  import.meta.env.VITE_N8N_WEBHOOK_URL ??
  "https://ia-n8n.nwwqtc.easypanel.host/webhook/trafego-pago"
