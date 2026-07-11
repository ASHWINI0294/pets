import { FormEvent, useState } from 'react'
import { fetchExchangeRate } from './api/exchangeRate'
import type { CurrencyCode } from './types'
import './App.css'

const CURRENCIES: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'JPY', 'INR', 'AUD', 'CAD']

function isValidAmount(value: string): boolean {
  if (value.trim() === '') return false
  const num = Number(value)
  return !Number.isNaN(num) && num > 0
}

export default function App() {
  const [amount, setAmount] = useState('')
  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>('USD')
  const [toCurrency, setToCurrency] = useState<CurrencyCode>('EUR')
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const amountIsValid = isValidAmount(amount)
  const canConvert = amountIsValid && fromCurrency !== toCurrency && !loading

  async function handleConvert(event: FormEvent) {
    event.preventDefault()
    if (!canConvert) return

    setLoading(true)
    setError(null)
    setConvertedAmount(null)

    try {
      const result = await fetchExchangeRate(
        Number(amount),
        fromCurrency,
        toCurrency,
      )
      setConvertedAmount(result)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="converter">
      <h1>Currency Converter</h1>
      <p className="subtitle">Enter an amount and select currencies to convert.</p>

      <form onSubmit={handleConvert}>
        <div className="field">
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 100"
            value={amount}
            className={amount !== '' && !amountIsValid ? 'invalid' : ''}
            onChange={(e) => {
              setAmount(e.target.value)
              setConvertedAmount(null)
              setError(null)
            }}
          />
          {amount !== '' && !amountIsValid && (
            <p className="error-text">Enter a positive number.</p>
          )}
        </div>

        <div className="field">
          <label htmlFor="from">From</label>
          <select
            id="from"
            value={fromCurrency}
            onChange={(e) => {
              setFromCurrency(e.target.value as CurrencyCode)
              setConvertedAmount(null)
              setError(null)
            }}
          >
            {CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="to">To</label>
          <select
            id="to"
            value={toCurrency}
            onChange={(e) => {
              setToCurrency(e.target.value as CurrencyCode)
              setConvertedAmount(null)
              setError(null)
            }}
          >
            {CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>

        {fromCurrency === toCurrency && (
          <p className="error-text">Please select two different currencies.</p>
        )}

        <button type="submit" className="convert-btn" disabled={!canConvert}>
          {loading ? 'Converting…' : 'Convert'}
        </button>
      </form>

      {loading && <div className="status loading">Fetching exchange rate…</div>}

      {error && !loading && <div className="status error">{error}</div>}

      {convertedAmount !== null && !loading && !error && (
        <div className="status result">
          <span>
            {amount} {fromCurrency} =
          </span>
          <span className="result-amount">
            {convertedAmount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{' '}
            {toCurrency}
          </span>
        </div>
      )}
    </div>
  )
}
