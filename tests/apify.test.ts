import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildApifyInput,
  collectApifyTrends,
  getApifyTokens,
  normalizeSourceCandidates,
} from '../api/_lib/apify.ts'

test('Apify aceita tokens em lista e remove duplicados sem expor valores', () => {
  const settings = {
    apifyApiTokens: 'first-token, second-token\nfirst-token',
    apifyApiToken: 'third-token',
  }

  assert.deepEqual(getApifyTokens(settings), ['first-token', 'second-token', 'third-token'])
  assert.deepEqual(buildApifyInput({ apifyKeywords: 'google ads, meta ads, google ads' }).searchTerms, ['google ads', 'meta ads'])
})

test('Apify alterna token em 401 e normaliza keywords e fonte oficial', async () => {
  const originalFetch = globalThis.fetch
  const calls: Array<{ authorization: string | null; body: string }> = []
  globalThis.fetch = async (_input, init) => {
    calls.push({
      authorization: new Headers(init?.headers).get('authorization'),
      body: String(init?.body),
    })
    if (calls.length === 1) return new Response('{"error":"unauthorized"}', { status: 401 })
    return new Response(JSON.stringify([{
      searchTerm: 'google ads',
      relatedQueries: { top: [{ query: 'como anunciar no google', value: 87 }] },
      newsArticles: { top: [{
        title: 'Mudança no Google Ads',
        url: 'https://blog.google/products/ads-commerce/update/',
        description: 'Resumo oficial',
      }] },
    }]), { status: 200 })
  }

  try {
    const result = await collectApifyTrends({
      apifyApiTokens: 'first-token,second-token',
      apifyKeywords: 'google ads',
    })

    assert.equal(calls.length, 2)
    assert.equal(calls[0].authorization, 'Bearer first-token')
    assert.equal(calls[1].authorization, 'Bearer second-token')
    assert.match(calls[1].body, /"geo":"BR"/)
    assert.equal(result.errors.length, 0)
    assert.ok(result.keywords.some((item) => item.keyword === 'como anunciar no google' && item.score === 87))
    assert.deepEqual(result.sources, [{
      title: 'Mudança no Google Ads',
      link: 'https://blog.google/products/ads-commerce/update/',
      excerpt: 'Resumo oficial',
      publishedAt: null,
    }])
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('Apify não busca sem token e não aceita fonte fora da allowlist', async () => {
  const originalFetch = globalThis.fetch
  let called = false
  globalThis.fetch = async () => {
    called = true
    throw new Error('fetch should not run')
  }

  try {
    const result = await collectApifyTrends({})
    assert.equal(called, false)
    assert.deepEqual(result, { keywords: [], sources: [], errors: [] })
    assert.deepEqual(normalizeSourceCandidates([{ newsArticles: [{ url: 'https://example.com/news' }] }]), [])
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('erro do Apify não contém token', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = async () => new Response('', { status: 500 })

  try {
    const result = await collectApifyTrends({ apifyApiToken: 'secret-token-that-must-not-leak' })
    assert.equal(result.errors.length, 1)
    assert.doesNotMatch(result.errors[0], /secret-token-that-must-not-leak/)
    assert.match(result.errors[0], /500/)
  } finally {
    globalThis.fetch = originalFetch
  }
})
