import { describe, expect, it } from 'vitest'
import type { Transaction } from '../types'
import { filterTransactions } from './filterTransactions'

const sample: Transaction[] = [
  {
    id: '1',
    userId: 'u1',
    merchant: 'Amazon',
    amount: 10,
    currency: 'USD',
    status: 'completed',
    date: '2026-07-01T00:00:00Z',
  },
  {
    id: '2',
    userId: 'u1',
    merchant: 'Starbucks',
    amount: 5,
    currency: 'USD',
    status: 'pending',
    date: '2026-07-02T00:00:00Z',
  },
  {
    id: '3',
    userId: 'u1',
    merchant: 'Uber',
    amount: 20,
    currency: 'USD',
    status: 'failed',
    date: '2026-07-03T00:00:00Z',
  },
]

describe('filterTransactions', () => {
  it('returns all transactions for the all filter', () => {
    expect(filterTransactions(sample, 'all', '')).toHaveLength(3)
  })

  it('filters by status', () => {
    expect(filterTransactions(sample, 'pending', '').map((t) => t.id)).toEqual(['2'])
  })

  it('filters by merchant search (case-insensitive)', () => {
    expect(filterTransactions(sample, 'all', 'ama').map((t) => t.merchant)).toEqual(['Amazon'])
  })

  it('combines status filter and search', () => {
    expect(filterTransactions(sample, 'failed', 'uber')).toHaveLength(1)
    expect(filterTransactions(sample, 'completed', 'uber')).toHaveLength(0)
  })
})
