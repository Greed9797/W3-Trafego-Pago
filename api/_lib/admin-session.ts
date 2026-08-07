import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import {
  getAutoblogSettings,
  getBearerToken,
  type AutoblogEnvironment,
} from './autoblog.js'

export const ADMIN_SESSION_COOKIE = 'w3_autoblog_admin'
export const ADMIN_SESSION_MAX_AGE = 8 * 60 * 60

function constantTimeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)
  if (leftBuffer.length !== rightBuffer.length) return false
  return timingSafeEqual(leftBuffer, rightBuffer)
}

export function isAdminTokenValid(candidate: string, expected: string | undefined) {
  return Boolean(candidate && expected && constantTimeEqual(candidate, expected))
}

export function createAdminSession(adminToken: string, now = new Date()) {
  const issuedAt = Math.floor(now.getTime() / 1000)
  const nonce = randomBytes(18).toString('base64url')
  const payload = `${issuedAt}.${nonce}`
  const signature = createHmac('sha256', adminToken).update(payload).digest('base64url')
  return `${payload}.${signature}`
}

export function verifyAdminSession(value: string, adminToken: string | undefined, now = new Date()) {
  if (!value || !adminToken) return false

  const [issuedAtValue, nonce, signature] = value.split('.')
  const issuedAt = Number(issuedAtValue)
  if (!Number.isInteger(issuedAt) || !nonce || !signature) return false

  const nowSeconds = Math.floor(now.getTime() / 1000)
  const age = nowSeconds - issuedAt
  if (age < -60 || age > ADMIN_SESSION_MAX_AGE) return false

  const payload = `${issuedAt}.${nonce}`
  const expected = createHmac('sha256', adminToken).update(payload).digest('base64url')
  return constantTimeEqual(signature, expected)
}

export function getCookie(headers: Record<string, string | string[] | undefined>, name: string) {
  const raw = headers.cookie
  const cookieHeader = Array.isArray(raw) ? raw[0] : raw
  if (!cookieHeader) return ''

  for (const part of cookieHeader.split(';')) {
    const separator = part.indexOf('=')
    if (separator < 0) continue
    const key = part.slice(0, separator).trim()
    if (key === name) {
      try {
        return decodeURIComponent(part.slice(separator + 1).trim())
      } catch {
        return ''
      }
    }
  }

  return ''
}

export function hasAdminAccess(
  headers: Record<string, string | string[] | undefined>,
  env: AutoblogEnvironment,
  now = new Date(),
) {
  const settings = getAutoblogSettings(env)
  if (isAdminTokenValid(getBearerToken(headers), settings.adminToken)) return true
  return verifyAdminSession(getCookie(headers, ADMIN_SESSION_COOKIE), settings.adminToken, now)
}

export function getAdminSessionCookie(value: string) {
  return `${ADMIN_SESSION_COOKIE}=${encodeURIComponent(value)}; Path=/api/admin; Max-Age=${ADMIN_SESSION_MAX_AGE}; HttpOnly; Secure; SameSite=Strict`
}

export function getExpiredAdminSessionCookie() {
  return `${ADMIN_SESSION_COOKIE}=; Path=/api/admin; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict`
}
