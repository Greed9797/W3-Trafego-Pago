import assert from 'node:assert/strict'
import test from 'node:test'
import { handleBlog } from '../api/blog.ts'

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

test('API pública sem Supabase preserva o fallback estático', async () => {
  const originalFetch = globalThis.fetch
  let called = false
  globalThis.fetch = async () => {
    called = true
    throw new Error('fetch should not run')
  }

  try {
    const res = responseStub()
    await handleBlog({ method: 'GET' }, res as never, {})
    assert.equal(res.statusCode, 200)
    assert.deepEqual(res.body, { articles: [] })
    assert.equal(called, false)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('API pública expõe somente artigo válido publicado', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = async () => new Response(JSON.stringify([
    {
      slug: 'mudanca-google-ads',
      title: 'Mudança no Google Ads',
      excerpt: 'O que revisar na conta.',
      category: 'Google Ads',
      content: { sections: [{ heading: 'O que mudou', paragraphs: ['Resumo da atualização.'], bullets: ['Revisar a configuração.'] }] },
      published_at: '2026-08-07T12:00:00.000Z',
    },
    {
      slug: 'sem-conteudo',
      title: 'Sem conteúdo',
      excerpt: 'Não deve aparecer.',
      category: 'Google Ads',
      content: { sections: [] },
      published_at: '2026-08-07T12:00:00.000Z',
    },
  ]), { status: 200 })

  try {
    const res = responseStub()
    await handleBlog({ method: 'GET' }, res as never, {
      supabaseUrl: 'https://project.supabase.co',
      supabasePublicKey: 'anon-key',
    }, new Date('2026-08-07T15:00:00.000Z'))

    assert.equal(res.statusCode, 200)
    assert.deepEqual(res.body, {
      articles: [{
        slug: 'mudanca-google-ads',
        title: 'Mudança no Google Ads',
        excerpt: 'O que revisar na conta.',
        category: 'Google Ads',
        date: '07 de ago. de 2026',
        isoDate: '2026-08-07',
        readTime: '5 min de leitura',
        image: '',
        accent: 'orange',
        sections: [{ heading: 'O que mudou', paragraphs: ['Resumo da atualização.'], bullets: ['Revisar a configuração.'] }],
      }],
    })
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('API pública rejeita método diferente de GET', async () => {
  const res = responseStub()
  await handleBlog({ method: 'POST' }, res as never, {})
  assert.equal(res.statusCode, 405)
  assert.deepEqual(res.body, { error: 'method_not_allowed' })
})
