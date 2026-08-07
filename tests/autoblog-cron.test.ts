import assert from 'node:assert/strict'
import test from 'node:test'
import { createDraftFromSignal, handleAutoblog } from '../api/cron/autoblog.ts'

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
  cronSecret: 'cron-secret',
  supabaseUrl: 'https://project.supabase.co',
  supabaseServiceRoleKey: 'service-role',
}

test('cron rejeita requisição sem Bearer antes de tocar no banco', async () => {
  const originalFetch = globalThis.fetch
  let called = false
  globalThis.fetch = async () => {
    called = true
    throw new Error('fetch should not run')
  }

  try {
    const res = responseStub()
    await handleAutoblog({ method: 'GET', headers: {} }, res as never, env)
    assert.equal(res.statusCode, 401)
    assert.deepEqual(res.body, { error: 'unauthorized' })
    assert.equal(called, false)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('cron sem banco configurado retorna configuração ausente', async () => {
  const res = responseStub()
  await handleAutoblog({ method: 'GET', headers: { authorization: 'Bearer cron-secret' } }, res as never, { cronSecret: 'cron-secret' })

  assert.equal(res.statusCode, 503)
  assert.deepEqual(res.body, { error: 'autoblog_not_configured' })
})

test('cron persiste um draft de update e a segunda execução é idempotente', async () => {
  const originalFetch = globalThis.fetch
  const calls: Array<{ url: string; init?: RequestInit }> = []
  let runExists = false
  globalThis.fetch = async (input, init) => {
    const url = String(input)
    calls.push({ url, init })

    if (url.includes('autoblog_runs?')) {
      return new Response(JSON.stringify(runExists ? [{ id: 'run-1', run_date: '2026-09-01', status: 'completed' }] : []), { status: 200 })
    }
    if (url.endsWith('/autoblog_runs')) {
      runExists = true
      return new Response(JSON.stringify([{ id: 'run-1', run_date: '2026-09-01', status: 'running' }]), { status: 201 })
    }
    if (url.includes('autoblog_signals?')) {
      return new Response('[]', { status: 200 })
    }
    if (url.endsWith('/autoblog_signals') || url.endsWith('/blog_posts')) {
      return new Response('', { status: 201 })
    }
    if (url.includes('autoblog_runs?id=')) {
      return new Response('', { status: 204 })
    }
    if (url.includes('trends.google.com')) {
      return new Response('<rss><channel><item><title>Busca em alta</title><link>https://trends.google.com/trending/1</link></item></channel></rss>', { status: 200 })
    }
    if (url.includes('blog.google')) {
      return new Response('<rss><channel><item><title>Nova mudança no Google Ads</title><link>https://blog.google/products/ads-commerce/update/</link><description>Resumo oficial</description></item></channel></rss>', { status: 200 })
    }
    if (url.includes('about.fb.com')) {
      return new Response('<rss><channel></channel></rss>', { status: 200 })
    }
    throw new Error(`unexpected URL ${url}`)
  }

  try {
    const first = responseStub()
    await handleAutoblog({ method: 'GET', headers: { authorization: 'Bearer cron-secret' } }, first as never, env, new Date('2026-09-01T12:00:00.000Z'))
    assert.equal(first.statusCode, 200)
    assert.deepEqual(first.body, { status: 'completed', runDate: '2026-09-01', sourceCount: 2, draftCount: 1, errors: [] })

    const postCall = calls.find((call) => call.url.endsWith('/blog_posts'))
    const postPayload = JSON.parse(String(postCall?.init?.body)) as Record<string, unknown>
    assert.equal(postPayload.status, 'draft')
    assert.equal(postPayload.kind, 'platform-update')
    assert.equal(postPayload.source_url, 'https://blog.google/products/ads-commerce/update/')

    const second = responseStub()
    await handleAutoblog({ method: 'GET', headers: { authorization: 'Bearer cron-secret' } }, second as never, env, new Date('2026-09-01T19:00:00.000Z'))
    assert.equal(second.statusCode, 200)
    assert.deepEqual(second.body, { status: 'already_processed', runDate: '2026-09-01', sourceCount: 0, draftCount: 0, errors: [] })
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('draft preserva fonte e permanece em status draft', () => {
  const draft = createDraftFromSignal({
    title: 'Mudança de medição',
    link: 'https://support.google.com/google-ads/announcements/9048695',
    excerpt: 'Texto original',
    publishedAt: null,
    sourceUrl: 'https://blog.google/products/ads-commerce/rss/',
    feedName: 'Google Ads Help',
    feedKind: 'platform',
  }, '2026-08-07T12:00:00.000Z')

  assert.equal(draft.kind, 'platform-update')
  assert.equal(draft.status, 'draft')
  assert.equal(draft.sourceUrl, 'https://support.google.com/google-ads/announcements/9048695')
  assert.equal(draft.content.sections.length, 3)
})
