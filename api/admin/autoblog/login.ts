import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getAutoblogSettings, type AutoblogEnvironment } from '../../_lib/autoblog.js'
import {
  createAdminSession,
  getAdminSessionCookie,
  isAdminTokenValid,
} from '../../_lib/admin-session.js'

function sendJson(res: VercelResponse, status: number, body: unknown) {
  res.setHeader('Cache-Control', 'no-store')
  return res.status(status).json(body)
}

function readToken(body: unknown) {
  if (!body || typeof body !== 'object') return ''
  const token = (body as Record<string, unknown>).token
  return typeof token === 'string' && token.length <= 512 ? token : ''
}

export async function handleLogin(
  req: Pick<VercelRequest, 'method' | 'body' | 'headers'>,
  res: VercelResponse,
  env: AutoblogEnvironment = process.env,
  now = new Date(),
) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'method_not_allowed' })

  const settings = getAutoblogSettings(env)
  if (!settings.adminToken) return sendJson(res, 503, { error: 'autoblog_not_configured' })
  if (!isAdminTokenValid(readToken(req.body), settings.adminToken)) {
    return sendJson(res, 401, { error: 'unauthorized' })
  }

  res.setHeader('Set-Cookie', getAdminSessionCookie(createAdminSession(settings.adminToken, now)))
  return sendJson(res, 200, { ok: true })
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  return handleLogin(req, res, process.env)
}
