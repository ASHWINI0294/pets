import type { CurrencyCode, ExchangeRateResponse } from '../types'

const API_BASE = 'https://api.frankfurter.app'

export async function fetchExchangeRate(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
): Promise<number> {
  const url = `${API_BASE}/latest?amount=${amount}&from=${from}&to=${to}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch exchange rate (${response.status})`)
  }

  const data: ExchangeRateResponse = await response.json()
  const converted = data.rates[to]

  if (converted === undefined) {
    throw new Error('Exchange rate not available for selected currencies')
  }

  return converted
}
