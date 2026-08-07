import assert from 'node:assert/strict'
import test from 'node:test'
import {
  createAdminSession,
  getAdminSessionCookie,
  hasAdminAccess,
  verifyAdminSession,
} from '../api/_lib/admin-session.ts'

const now = new Date('2026-08-07T15:00:00.000Z')

test('sessão admin assinada expira e rejeita assinatura adulterada', () => {
  const session = createAdminSession('admin-secret', now)

  assert.equal(verifyAdminSession(session, 'admin-secret', now), true)
  assert.equal(verifyAdminSession(session, 'wrong-secret', now), false)
  assert.equal(verifyAdminSession(`${session}x`, 'admin-secret', now), false)
  assert.equal(verifyAdminSession(session, 'admin-secret', new Date('2026-08-08T00:00:01.000Z')), false)
  assert.match(getAdminSessionCookie(session), /HttpOnly/)
  assert.match(getAdminSessionCookie(session), /SameSite=Strict/)
})

test('admin aceita Bearer legado ou cookie, nunca sem credencial', () => {
  const session = createAdminSession('admin-secret', now)
  const cookie = getAdminSessionCookie(session).split(';')[0]

  assert.equal(hasAdminAccess({ authorization: 'Bearer admin-secret' }, { AUTOBLOG_ADMIN_TOKEN: 'admin-secret' }, now), true)
  assert.equal(hasAdminAccess({ cookie }, { AUTOBLOG_ADMIN_TOKEN: 'admin-secret' }, now), true)
  assert.equal(hasAdminAccess({}, { AUTOBLOG_ADMIN_TOKEN: 'admin-secret' }, now), false)
})
