import assert from 'node:assert/strict'
import test from 'node:test'
import { handlePosts } from '../api/admin/autoblog/posts.ts'

type ResponseStub = {
  statusCode: number
  body: unknown
  status: (code: number) => ResponseStub
  setHeader: (name: string, value: string) => ResponseStub
  json: (body: unknown) => ResponseStub
}

function responseStub(): ResponseStub {
  return {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this },
    setHeader() { return this },
    json(body) { this.body = body; return this },
  }
}

test('listagem admin rejeita request sem credencial antes do Supabase', async () => {
  const originalFetch = globalThis.fetch
  let called = false
  globalThis.fetch = async () => {
    called = true
    throw new Error('fetch should not run')
  }

  try {
    const res = responseStub()
    await handlePosts({ method: 'GET', headers: {}, url: '/api/admin/autoblog/posts?status=scheduled' }, res as never, { AUTOBLOG_ADMIN_TOKEN: 'admin-secret' })
    assert.equal(res.statusCode, 401)
    assert.equal(called, false)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('listagem admin aceita aliases de produção e limita status ao contrato', async () => {
  const originalFetch = globalThis.fetch
  let requestedUrl = ''
  globalThis.fetch = async (input) => {
    requestedUrl = String(input)
    return new Response(JSON.stringify([{ id: 'post-1', status: 'scheduled' }]), { status: 200 })
  }

  try {
    const res = responseStub()
    await handlePosts(
      { method: 'GET', headers: { authorization: 'Bearer admin-secret' }, url: '/api/admin/autoblog/posts?status=scheduled' },
      res as never,
      {
        AUTOBLOG_ADMIN_TOKEN: 'admin-secret',
        SUPABASE_URL: 'https://project.supabase.co',
        SUPABASE_SECRET_KEY: 'service-role',
      },
    )

    assert.equal(res.statusCode, 200)
    assert.match(requestedUrl, /status=eq\.scheduled/)
    assert.deepEqual(res.body, { posts: [{ id: 'post-1', status: 'scheduled' }], status: 'scheduled' })
  } finally {
    globalThis.fetch = originalFetch
  }
})
