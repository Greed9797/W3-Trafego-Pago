import assert from 'node:assert/strict'
import test from 'node:test'
import { getEditorialCalendar } from '../src/lib/editorial-calendar.ts'

test('gera 90 slots e cobre cada dia de setembro de 2026', () => {
  const calendar = getEditorialCalendar(2026, 8)
  const dates = new Set(calendar.map((slot) => slot.date))

  assert.equal(calendar.length, 90)
  assert.equal(dates.size, 30)
  assert.equal(calendar[0].date, '2026-09-01')
  assert.equal(calendar.at(-1)?.date, '2026-09-30')
  assert.deepEqual([...dates].sort(), Array.from({ length: 30 }, (_, index) => `2026-09-${String(index + 1).padStart(2, '0')}`))
})

test('mantém dois evergreen programados e um update em draft por dia', () => {
  const calendar = getEditorialCalendar(2026, 8)
  const byDate = Map.groupBy(calendar, (slot) => slot.date)

  for (const slots of byDate.values()) {
    assert.equal(slots.length, 3)
    assert.equal(slots.filter((slot) => slot.kind === 'evergreen' && slot.status === 'scheduled').length, 2)
    assert.equal(slots.filter((slot) => slot.kind === 'platform-update' && slot.status === 'draft').length, 1)
    assert.deepEqual(slots.map((slot) => slot.time), ['08:00', '12:00', '18:00'])
    assert.ok(slots.every((slot) => slot.keyword.length > 0 && slot.angle.length > 0 && slot.cta.length > 0))
  }
})

test('rejeita ano e mês fora do contrato', () => {
  assert.throws(() => getEditorialCalendar(1999, 8), /year must be an integer/)
  assert.throws(() => getEditorialCalendar(2026, 12), /monthIndex must be an integer/)
})
