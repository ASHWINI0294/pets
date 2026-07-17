import type { ConversionResult, CurrencyCode } from '../types'

/**
 * Simulated USD-based rates for StackBlitz sandboxes where
 * outbound currency APIs are often blocked.
 */
const MOCK_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
  INR: 83.12,
  AUD: 1.53,
  CAD: 1.36,
  CHF: 0.88,
  CNY: 7.24,
  SGD: 1.34,
}

function convertWithMockRates(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
): ConversionResult {
  const inUsd = amount / MOCK_RATES[from]
  const converted = inUsd * MOCK_RATES[to]
  const rate = MOCK_RATES[to] / MOCK_RATES[from]

  return {
    amount,
    from,
    to,
    converted,
    rate,
  }
}

export async function fetchConversion(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
): Promise<ConversionResult> {
  // Brief delay so the loading state is visible in the UI
  await new Promise((resolve) => setTimeout(resolve, 500))

  const result = convertWithMockRates(amount, from, to)

  if (!Number.isFinite(result.converted) || !Number.isFinite(result.rate)) {
    throw new Error('Exchange rate not available for the selected currencies.')
  }

  return result
}
