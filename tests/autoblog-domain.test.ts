import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildSlug,
  getSaoPauloDate,
  getSupabaseConfig,
  isAllowedSourceUrl,
  isDraftPublishable,
  parseFeedItems,
} from '../api/_lib/autoblog.ts'

test('normaliza itens RSS, remove HTML e ignora item incompleto', () => {
  const xml = `
    <rss><channel>
      <item>
        <title><![CDATA[ Google Ads &amp; novidades ]]></title>
        <link>https://blog.google/products/ads-commerce/update/</link>
        <description><![CDATA[<p>Uma <strong>mudança</strong> relevante.</p>]]></description>
        <pubDate>Fri, 07 Aug 2026 12:00:00 GMT</pubDate>
      </item>
      <item><title>Sem link</title></item>
    </channel></rss>`

  const items = parseFeedItems(xml, 'https://blog.google/products/ads-commerce/')

  assert.equal(items.length, 1)
  assert.equal(items[0].title, 'Google Ads & novidades')
  assert.equal(items[0].excerpt, 'Uma mudança relevante.')
  assert.equal(items[0].link, 'https://blog.google/products/ads-commerce/update/')
})

test('limita o feed a 20 itens válidos', () => {
  const xml = Array.from({ length: 25 }, (_, index) => `<item><title>Item ${index}</title><link>https://blog.google/item-${index}</link></item>`).join('')
  assert.equal(parseFeedItems(xml, 'https://blog.google/feed').length, 20)
})

test('aceita somente URLs HTTPS de fontes permitidas', () => {
  assert.equal(isAllowedSourceUrl('https://blog.google/products/ads-commerce/update'), true)
  assert.equal(isAllowedSourceUrl('https://www.facebook.com/business/news/update'), true)
  assert.equal(isAllowedSourceUrl('http://blog.google/update'), false)
  assert.equal(isAllowedSourceUrl('https://example.com/copied-post'), false)
})

test('produz slug estável, data local e configuração segura', () => {
  assert.equal(buildSlug('Google Ads: mudança no Performance Max!'), 'google-ads-mudanca-no-performance-max')
  assert.equal(getSaoPauloDate(new Date('2026-08-07T02:00:00.000Z')), '2026-08-06')
  assert.equal(getSupabaseConfig({ supabaseUrl: 'http://localhost:54321', supabaseServiceRoleKey: 'secret' }), null)
  assert.deepEqual(getSupabaseConfig({ supabaseUrl: 'https://project.supabase.co/', supabaseServiceRoleKey: 'secret' }), {
    url: 'https://project.supabase.co',
    serviceRoleKey: 'secret',
  })
})

test('valida draft somente com fonte, conteúdo e timestamp válidos', () => {
  const validDraft = {
    title: 'Atualização confirmada do Google Ads',
    slug: 'atualizacao-confirmada-do-google-ads',
    excerpt: 'Resumo da mudança para anunciantes.',
    category: 'Google Ads',
    sourceUrl: 'https://support.google.com/google-ads/announcements/9048695',
    sourceCollectedAt: '2026-08-07T12:00:00.000Z',
    content: { sections: [{ heading: 'O que mudou', paragraphs: ['Resumo.'] }] },
  }

  assert.equal(isDraftPublishable(validDraft), true)
  assert.equal(isDraftPublishable({ ...validDraft, sourceUrl: 'https://example.com' }), false)
  assert.equal(isDraftPublishable({ ...validDraft, content: { sections: [] } }), false)
})
