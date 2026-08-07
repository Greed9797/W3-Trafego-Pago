import assert from 'node:assert/strict'
import test from 'node:test'
import { handleApproval } from '../api/admin/autoblog/approve.ts'

type ResponseStub = {
  statusCode: number
  body: unknown
  status: (code: number) => ResponseStub
  json: (body: unknown) => ResponseStub
}

function responseStub(): ResponseStub {
  return {
    statusCode: 200,
    body: null,
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

const env = {
  adminToken: 'admin-secret',
  supabaseUrl: 'https://project.supabase.co',
  supabaseServiceRoleKey: 'service-role',
}
const draftId = '123e4567-e89b-12d3-a456-426614174000'

test('aprovação sem token retorna 401 sem consultar o banco', async () => {
  const originalFetch = globalThis.fetch
  let called = false
  globalThis.fetch = async () => {
    called = true
    throw new Error('fetch should not run')
  }

  try {
    const res = responseStub()
    await handleApproval({ method: 'POST', headers: {}, body: { id: draftId } }, res as never, env)
    assert.equal(res.statusCode, 401)
    assert.deepEqual(res.body, { error: 'unauthorized' })
    assert.equal(called, false)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('aprovação rejeita ID que não é UUID', async () => {
  const res = responseStub()
  await handleApproval({ method: 'POST', headers: { authorization: 'Bearer admin-secret' }, body: { id: 'draft-1' } }, res as never, env)

  assert.equal(res.statusCode, 422)
  assert.deepEqual(res.body, { error: 'invalid_draft_id' })
})

test('aprovação valida draft e publica somente o registro selecionado', async () => {
  const originalFetch = globalThis.fetch
  const calls: Array<{ url: string; init?: RequestInit }> = []
  globalThis.fetch = async (input, init) => {
    const url = String(input)
    calls.push({ url, init })
    if (url.includes('blog_posts?id=') && !init?.method) {
      return new Response(JSON.stringify([{
        id: draftId,
        title: 'Atualização confirmada do Google Ads',
        slug: 'atualizacao-confirmada-do-google-ads',
        excerpt: 'Resumo da mudança.',
        category: 'Google Ads',
        content: { sections: [{ heading: 'O que mudou', paragraphs: ['Resumo.'] }] },
        source_url: 'https://support.google.com/google-ads/announcements/9048695',
        source_collected_at: '2026-08-07T12:00:00.000Z',
        status: 'draft',
      }]), { status: 200 })
    }
    if (url.includes('blog_posts?id=') && init?.method === 'PATCH') return new Response(null, { status: 204 })
    throw new Error(`unexpected URL ${url}`)
  }

  try {
    const now = new Date('2026-08-07T15:30:00.000Z')
    const res = responseStub()
    await handleApproval({ method: 'POST', headers: { authorization: 'Bearer admin-secret' }, body: { id: draftId } }, res as never, env, now)

    assert.equal(res.statusCode, 200)
    assert.deepEqual(res.body, { id: draftId, status: 'published', publishedAt: now.toISOString() })
    const patchCall = calls.find((call) => call.init?.method === 'PATCH')
    assert.equal(JSON.parse(String(patchCall?.init?.body)).status, 'published')
    assert.equal(JSON.parse(String(patchCall?.init?.body)).published_at, now.toISOString())
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('aprovação não publica draft sem fonte permitida', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = async () => new Response(JSON.stringify([{
    id: draftId,
    title: 'Draft sem fonte válida',
    slug: 'draft-sem-fonte-valida',
    excerpt: 'Resumo.',
    category: 'Google Ads',
    content: { sections: [{ heading: 'Resumo', paragraphs: ['Texto.'] }] },
    source_url: 'https://example.com/not-allowed',
    source_collected_at: '2026-08-07T12:00:00.000Z',
    status: 'draft',
  }]), { status: 200 })

  try {
    const res = responseStub()
    await handleApproval({ method: 'POST', headers: { authorization: 'Bearer admin-secret' }, body: { id: draftId } }, res as never, env)
    assert.equal(res.statusCode, 422)
    assert.deepEqual(res.body, { error: 'draft_not_found_or_invalid' })
  } finally {
    globalThis.fetch = originalFetch
  }
})
