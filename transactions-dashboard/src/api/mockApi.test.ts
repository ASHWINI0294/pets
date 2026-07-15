import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getTransactions, getUser } from './mockApi'

describe('mockApi', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('resolves a user for valid credentials (Promise + async/await)', async () => {
    const pending = getUser('riya.sharma@example.com', 'riya123')
    await vi.advanceTimersByTimeAsync(400)
    const user = await pending

    expect(user.email).toBe('riya.sharma@example.com')
    expect(user).not.toHaveProperty('password')
  })

  it('rejects invalid credentials', async () => {
    const pending = getUser('riya.sharma@example.com', 'wrong')
    const assertion = expect(pending).rejects.toThrow('Invalid email or password')
    await vi.advanceTimersByTimeAsync(400)
    await assertion
  })

  it('returns only transactions for the given userId', async () => {
    const pending = getTransactions('u2')
    await vi.advanceTimersByTimeAsync(400)
    const txns = await pending

    expect(txns.length).toBeGreaterThan(0)
    expect(txns.every((t) => t.userId === 'u2')).toBe(true)
  })
})
