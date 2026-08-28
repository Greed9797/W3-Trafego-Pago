import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { blogPostsSeptember2026, blogPostsSeptember2026Summary } from '../data/blog-posts-2026-09.ts'

const allowedHosts = new Set([
  'trends.google.com',
  'blog.google',
  'support.google.com',
  'facebook.com',
  'www.facebook.com',
  'about.fb.com',
  'meta.com',
  'www.meta.com',
])

function hasAllowedHost(value: string) {
  return allowedHosts.has(new URL(value).hostname)
}

test('seed editorial de setembro de 2026 tem 90 slots únicos e distribuídos', () => {
  assert.equal(blogPostsSeptember2026Summary.total, 90)
  assert.equal(blogPostsSeptember2026Summary.evergreen, 60)
  assert.equal(blogPostsSeptember2026Summary.platformUpdates, 30)
  assert.deepEqual(blogPostsSeptember2026Summary.categories, {
    'Google Ads': 15,
    'Meta Ads': 15,
    Métricas: 10,
    Criativos: 10,
    'E-commerce': 10,
  })

  assert.equal(new Set(blogPostsSeptember2026.map((post) => post.slug)).size, 90)
  assert.equal(new Set(blogPostsSeptember2026.map((post) => post.title)).size, 90)
  assert.equal(new Set(blogPostsSeptember2026.map((post) => post.scheduled_for)).size, 90)
})

test('cada registro usa apenas colunas compatíveis com blog_posts', () => {
  const columns = ['category', 'content', 'kind', 'keyword', 'published_at', 'scheduled_for', 'slug', 'source_collected_at', 'source_url', 'status', 'title', 'excerpt']

  for (const post of blogPostsSeptember2026) {
    assert.deepEqual(Object.keys(post).sort(), [...columns].sort())
  }
})

test('evergreens estão programados e têm conteúdo, SEO e pauta completos', () => {
  const evergreen = blogPostsSeptember2026.filter((post) => post.kind === 'evergreen')

  assert.equal(evergreen.length, 60)
  for (const post of evergreen) {
    assert.equal(post.status, 'scheduled')
    assert.ok(post.keyword.length > 0)
    assert.ok(post.content.seo.title.length > 0)
    assert.ok(post.content.seo.metaDescription.length > 0)
    assert.ok(post.content.seo.h1.length > 0)
    assert.ok(post.content.seo.introduction.length > 0)
    assert.ok(post.content.seo.cta.length > 0)
    assert.equal(post.content.seo.faq.length, 3)
    assert.ok(post.content.sections.length >= 7)
    assert.ok(post.content.editorial.secondaryKeywords.length >= 2)
    assert.ok(post.content.editorial.justification.length > 0)
    assert.ok(post.content.editorial.cannibalizationRisk.length > 0)
    assert.ok(post.source_url)
    assert.ok(hasAllowedHost(post.source_url))
    assert.ok(post.content.editorial.officialReferences.every(hasAllowedHost))
  }
})

test('updates permanecem draft e só um fato confirmado recebe conteúdo de notícia', () => {
  const updates = blogPostsSeptember2026.filter((post) => post.kind === 'platform-update')
  const confirmed = updates.filter((post) => post.content.update?.state === 'confirmed-source')
  const pending = updates.filter((post) => post.content.update?.state === 'awaiting-official-source')

  assert.equal(updates.length, 30)
  assert.ok(updates.every((post) => post.status === 'draft'))
  assert.equal(confirmed.length, 1)
  assert.equal(pending.length, 29)

  assert.ok(confirmed.every((post) => post.source_url && hasAllowedHost(post.source_url)))
  assert.ok(confirmed.every((post) => post.content.editorial.officialReferences.length > 0))
  assert.ok(pending.every((post) => post.source_url === null))
  assert.ok(pending.every((post) => post.content.sections.length === 0))
})

test('nenhuma URL externa do seed sai da allowlist editorial', () => {
  for (const post of blogPostsSeptember2026) {
    if (post.source_url) assert.ok(hasAllowedHost(post.source_url))
    assert.ok(hasAllowedHost(post.content.editorial.researchUrl))
    assert.ok(post.content.editorial.officialReferences.every(hasAllowedHost))
  }
})

test('seed não colide com os slugs do catálogo estático atual', () => {
  const staticSource = readFileSync(new URL('../src/lib/blog.ts', import.meta.url), 'utf8')
  const staticSlugs = [...staticSource.matchAll(/slug:\s*'([^']+)'/g)].map((match) => match[1])
  const seedSlugs = new Set(blogPostsSeptember2026.map((post) => post.slug))

  assert.deepEqual(staticSlugs.filter((slug) => seedSlugs.has(slug)), [])
})
