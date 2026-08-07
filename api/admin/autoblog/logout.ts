import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getExpiredAdminSessionCookie } from '../../_lib/admin-session.js'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' })
  res.setHeader('Set-Cookie', getExpiredAdminSessionCookie())
  res.setHeader('Cache-Control', 'no-store')
  return res.status(200).json({ ok: true })
}
