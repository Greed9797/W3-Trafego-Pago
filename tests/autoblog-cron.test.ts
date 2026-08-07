import assert from 'node:assert/strict'
import test from 'node:test'
import { createDraftFromSignal, enrichDraftWithLlm, handleAutoblog } from '../api/cron/autoblog.ts'

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

test('cron usa Apify como descoberta e mantém a fonte oficial como draft', async () => {
  const originalFetch = globalThis.fetch
  const calls: Array<{ url: string; init?: RequestInit }> = []
  globalThis.fetch = async (input, init) => {
    const url = String(input)
    calls.push({ url, init })

    if (url.includes('autoblog_runs?')) {
      return new Response('[]', { status: 200 })
    }
    if (url.endsWith('/autoblog_runs')) {
      return new Response(JSON.stringify([{ id: 'run-apify', run_date: '2026-09-02', status: 'running' }]), { status: 201 })
    }
    if (url.includes('autoblog_keywords?on_conflict=')) {
      return new Response('', { status: 201 })
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
    if (url.includes('api.apify.com')) {
      return new Response(JSON.stringify([{
        searchTerm: 'google ads',
        relatedQueries: [{ query: 'como anunciar no google', value: 74 }],
        newsArticles: [{
          title: 'Atualização oficial do Google Ads',
          url: 'https://blog.google/products/ads-commerce/update/',
          description: 'Fonte oficial',
        }],
      }]), { status: 200 })
    }
    if (url.includes('blog.google')) {
      return new Response('<rss><channel></channel></rss>', { status: 200 })
    }
    throw new Error(`unexpected URL ${url}`)
  }

  try {
    const res = responseStub()
    await handleAutoblog({ method: 'GET', headers: { authorization: 'Bearer cron-secret' } }, res as never, {
      cronSecret: 'cron-secret',
      supabaseUrl: 'https://project.supabase.co',
      supabaseServiceRoleKey: 'service-role',
      feeds: JSON.stringify([{ name: 'Google Ads', url: 'https://blog.google/products/ads-commerce/rss/', kind: 'platform' }]),
      apifyApiToken: 'test-apify-token',
    }, new Date('2026-09-02T12:00:00.000Z'))

    assert.equal(res.statusCode, 200)
    assert.deepEqual(res.body, { status: 'completed', runDate: '2026-09-02', sourceCount: 1, draftCount: 1, errors: [] })

    const keywordCall = calls.find((call) => call.url.includes('autoblog_keywords?on_conflict='))
    const keywordPayload = JSON.parse(String(keywordCall?.init?.body)) as Array<Record<string, unknown>>
    assert.ok(keywordPayload.some((item) => item.keyword === 'como anunciar no google' && item.source === 'apify-google-trends'))

    const apifyCall = calls.find((call) => call.url.includes('api.apify.com'))
    assert.equal(new Headers(apifyCall?.init?.headers).get('authorization'), 'Bearer test-apify-token')
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

test('IA opcional enriquece o draft sem remover fonte ou status', async () => {
  const originalFetch = globalThis.fetch
  let endpoint = ''
  globalThis.fetch = async (input) => {
    endpoint = String(input)
    return new Response(JSON.stringify({
      choices: [{ message: { content: JSON.stringify({
        title: 'O que a nova medição muda no Google Ads',
        excerpt: 'Um resumo editorial da mudança para anunciantes.',
        sections: [{ heading: 'O que observar', paragraphs: ['Revise o diagnóstico antes de editar campanhas.'] }],
      }) } }],
    }), { status: 200 })
  }

  try {
    const signal = {
      title: 'Mudança de medição',
      link: 'https://support.google.com/google-ads/announcements/9048695',
      excerpt: 'Texto original',
      publishedAt: null,
      sourceUrl: 'https://blog.google/products/ads-commerce/rss/',
      feedName: 'Google Ads Help',
      feedKind: 'platform' as const,
    }
    const baseDraft = createDraftFromSignal(signal, '2026-08-07T12:00:00.000Z')
    const draft = await enrichDraftWithLlm(baseDraft, signal, {
      llmEnabled: 'true',
      llmEndpoint: 'https://llm.example.com/v1/chat/completions',
      llmApiKey: 'test-key',
    })

    assert.equal(endpoint, 'https://llm.example.com/v1/chat/completions')
    assert.equal(draft.title, 'O que a nova medição muda no Google Ads')
    assert.equal(draft.status, 'draft')
    assert.equal(draft.sourceUrl, signal.link)
    assert.equal(draft.content.sections[0].heading, 'O que observar')
  } finally {
    globalThis.fetch = originalFetch
  }
})
