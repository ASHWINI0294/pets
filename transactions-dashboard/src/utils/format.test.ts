import { describe, expect, it } from 'vitest'
import { formatAmount, formatDate } from '../utils/format'

describe('formatAmount', () => {
  it('formats USD amounts', () => {
    expect(formatAmount(129.99, 'USD')).toBe('$129.99')
  })

  it('returns a dash for NaN', () => {
    expect(formatAmount(Number.NaN)).toBe('—')
  })
})

describe('formatDate', () => {
  it('formats a valid ISO date', () => {
    const result = formatDate('2026-07-10T10:30:00Z')
    expect(result).toContain('2026')
    expect(result).toContain('Jul')
  })

  it('returns a dash for invalid dates', () => {
    expect(formatDate('not-a-date')).toBe('—')
  })
})
