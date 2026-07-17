import { FormEvent, useState } from 'react'
import { fetchConversion } from './api/exchangeRate'
import type { ConversionResult, CurrencyCode, CurrencyMeta } from './types'
import './App.css'

const CURRENCIES: CurrencyMeta[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
]

function isValidAmount(value: string): boolean {
  if (value.trim() === '') return false
  const num = Number(value)
  return Number.isFinite(num) && num > 0
}

function formatMoney(value: number, code: CurrencyCode): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: code,
    maximumFractionDigits: code === 'JPY' ? 0 : 2,
  }).format(value)
}

export default function App() {
  const [amount, setAmount] = useState('100')
  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>('USD')
  const [toCurrency, setToCurrency] = useState<CurrencyCode>('EUR')
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [swapPulse, setSwapPulse] = useState(false)

  const amountIsValid = isValidAmount(amount)
  const sameCurrency = fromCurrency === toCurrency
  const canConvert = amountIsValid && !sameCurrency && !loading

  function clearOutcome() {
    setResult(null)
    setError(null)
  }

  function handleSwap() {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    clearOutcome()
    setSwapPulse(true)
    window.setTimeout(() => setSwapPulse(false), 350)
  }

  async function handleConvert(event: FormEvent) {
    event.preventDefault()
    if (!canConvert) return

    setLoading(true)
    clearOutcome()

    try {
      const conversion = await fetchConversion(
        Number(amount),
        fromCurrency,
        toCurrency,
      )
      setResult(conversion)
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="atmosphere" aria-hidden="true" />

      <main className="shell">
        <header className="brand">
          <p className="brand-mark">Currency Converter</p>
          <h1>Currency Converter</h1>
          <p className="lede">
            Convert between major currencies with instant demo exchange rates.
          </p>
        </header>

        <form className="converter" onSubmit={handleConvert}>
          <div className="field">
            <label htmlFor="amount">Amount</label>
            <input
              id="amount"
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              placeholder="e.g. 100"
              value={amount}
              className={amount !== '' && !amountIsValid ? 'invalid' : ''}
              onChange={(e) => {
                setAmount(e.target.value)
                clearOutcome()
              }}
            />
            {amount !== '' && !amountIsValid && (
              <p className="hint error">Enter a positive number.</p>
            )}
          </div>

          <div className="currency-row">
            <div className="field">
              <label htmlFor="from">From</label>
              <select
                id="from"
                value={fromCurrency}
                onChange={(e) => {
                  setFromCurrency(e.target.value as CurrencyCode)
                  clearOutcome()
                }}
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} — {currency.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className={`swap-btn${swapPulse ? ' pulse' : ''}`}
              onClick={handleSwap}
              aria-label="Swap currencies"
              title="Swap currencies"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M7 7h11l-2.5-2.5M17 17H6l2.5 2.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="field">
              <label htmlFor="to">To</label>
              <select
                id="to"
                value={toCurrency}
                onChange={(e) => {
                  setToCurrency(e.target.value as CurrencyCode)
                  clearOutcome()
                }}
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} — {currency.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {sameCurrency && (
            <p className="hint error">Choose two different currencies.</p>
          )}

          <button type="submit" className="convert-btn" disabled={!canConvert}>
            {loading ? 'Converting…' : 'Convert'}
          </button>
        </form>

        <section className="outcome" aria-live="polite">
          {loading && (
            <div className="status loading">
              <span className="spinner" aria-hidden="true" />
              Fetching exchange rate…
            </div>
          )}

          {error && !loading && <div className="status error">{error}</div>}

          {result && !loading && !error && (
            <div className="status result">
              <p className="result-eq">
                {formatMoney(result.amount, result.from)} =
              </p>
              <p className="result-amount">
                {formatMoney(result.converted, result.to)}
              </p>
              <p className="result-rate">
                1 {result.from} ={' '}
                {result.rate.toLocaleString(undefined, {
                  maximumFractionDigits: 6,
                })}{' '}
                {result.to}
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
