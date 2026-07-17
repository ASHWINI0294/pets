export const CURRENCIES = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'SGD', name: 'Singapore Dollar' },
]

// Simulated USD-based rates (works in StackBlitz without an external API)
export const RATES = {
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

export function isValidAmount(value) {
  if (typeof value !== 'string' && typeof value !== 'number') return false
  const text = String(value)
  if (text.trim() === '') return false
  const num = Number(text)
  return Number.isFinite(num) && num > 0
}

export function canConvert(amount, fromCurrency, toCurrency, loading) {
  return isValidAmount(amount) && fromCurrency !== toCurrency && !loading
}

export function formatMoney(value, code) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: code,
    maximumFractionDigits: code === 'JPY' ? 0 : 2,
  }).format(value)
}

export function convertSync(amount, from, to) {
  if (!(from in RATES) || !(to in RATES)) {
    throw new Error('Exchange rate not available for the selected currencies.')
  }
  const converted = (amount / RATES[from]) * RATES[to]
  const rate = RATES[to] / RATES[from]
  if (!Number.isFinite(converted) || !Number.isFinite(rate)) {
    throw new Error('Exchange rate not available for the selected currencies.')
  }
  return { amount, from, to, converted, rate }
}

export async function convertAmount(amount, from, to, delayMs = 400) {
  await new Promise((resolve) => setTimeout(resolve, delayMs))
  return convertSync(amount, from, to)
}
