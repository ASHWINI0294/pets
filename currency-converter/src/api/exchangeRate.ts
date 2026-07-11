import type { CurrencyCode } from '../types'

// Simulated rates (USD base). Works in StackBlitz where external APIs are often blocked.
const MOCK_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
  INR: 83.12,
  AUD: 1.53,
  CAD: 1.36,
}

function convertWithMockRates(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
): number {
  const inUsd = amount / MOCK_RATES[from]
  return inUsd * MOCK_RATES[to]
}

export async function fetchExchangeRate(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
): Promise<number> {
  // Simulate network delay so loading state is visible in the UI
  await new Promise((resolve) => setTimeout(resolve, 600))

  const converted = convertWithMockRates(amount, from, to)

  if (!Number.isFinite(converted)) {
    throw new Error('Exchange rate not available for selected currencies')
  }

  return converted
}
