import assert from 'node:assert/strict'
import test from 'node:test'
import { blogPostsOctober2026 } from '../data/blog-posts-2026-10.ts'
import { isAllowedSourceUrl } from '../api/_lib/autoblog.ts'

test('lote de outubro tem 13 posts evergreen agendados e keywords únicas', () => {
  assert.equal(blogPostsOctober2026.length, 13)
  assert.ok(blogPostsOctober2026.every((post) => post.kind === 'evergreen' && post.status === 'scheduled'))
  assert.equal(new Set(blogPostsOctober2026.map((post) => post.keyword)).size, 13)
  assert.equal(new Set(blogPostsOctober2026.map((post) => post.slug)).size, 13)
})

test('lote de outubro mantém fonte oficial HTTPS e conteúdo SEO completo', () => {
  for (const post of blogPostsOctober2026) {
    assert.equal(isAllowedSourceUrl(post.source_url ?? ''), true)
    assert.ok(post.source_collected_at)
    assert.ok(post.content.seo.title)
    assert.ok(post.content.seo.metaDescription)
    assert.ok(post.content.seo.faq.length >= 3)
    assert.ok(post.content.sections.length >= 7)
  }
})
