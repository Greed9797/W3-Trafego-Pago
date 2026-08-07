import assert from 'node:assert/strict'
import test from 'node:test'
import { handleLogin } from '../api/admin/autoblog/login.ts'

type ResponseStub = {
  statusCode: number
  body: unknown
  headers: Record<string, string>
  setHeader: (name: string, value: string) => ResponseStub
  status: (code: number) => ResponseStub
  json: (body: unknown) => ResponseStub
}

function responseStub(): ResponseStub {
  return {
    statusCode: 200,
    body: null,
    headers: {},
    setHeader(name, value) {
      this.headers[name] = value
      return this
    },
    status(code) {
      this.statusCode = code
      return this
    },
    json(body) {
      this.body = body
      return this
    },
  }
}

test('login admin usa variáveis da Vercel e não devolve o token', async () => {
  const res = responseStub()
  await handleLogin({ method: 'POST', headers: {}, body: { token: 'admin-secret' } }, res as never, { AUTOBLOG_ADMIN_TOKEN: 'admin-secret' }, new Date('2026-08-07T15:00:00.000Z'))

  assert.equal(res.statusCode, 200)
  assert.deepEqual(res.body, { ok: true })
  assert.match(res.headers['Set-Cookie'], /HttpOnly/)
  assert.match(res.headers['Set-Cookie'], /Secure/)
  assert.doesNotMatch(res.headers['Set-Cookie'], /admin-secret/)
})

test('login rejeita token inválido e configuração ausente', async () => {
  const invalid = responseStub()
  await handleLogin({ method: 'POST', headers: {}, body: { token: 'wrong' } }, invalid as never, { AUTOBLOG_ADMIN_TOKEN: 'admin-secret' })
  assert.equal(invalid.statusCode, 401)

  const missing = responseStub()
  await handleLogin({ method: 'POST', headers: {}, body: { token: 'admin-secret' } }, missing as never, {})
  assert.equal(missing.statusCode, 503)
})
