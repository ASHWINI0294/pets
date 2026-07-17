import { useState } from 'react'
import './App.css'
import {
  CURRENCIES,
  isValidAmount,
  canConvert,
  formatMoney,
  convertAmount,
} from './converterLogic.js'

export default function App() {
  const [amount, setAmount] = useState('100')
  const [fromCurrency, setFromCurrency] = useState('USD')
  const [toCurrency, setToCurrency] = useState('EUR')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const amountIsValid = isValidAmount(amount)
  const sameCurrency = fromCurrency === toCurrency
  const convertEnabled = canConvert(amount, fromCurrency, toCurrency, loading)

  function clearOutcome() {
    setResult(null)
    setError(null)
  }

  function handleSwap() {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    clearOutcome()
  }

  async function handleConvert(event) {
    event.preventDefault()
    if (!convertEnabled) return

    setLoading(true)
    clearOutcome()

    try {
      const conversion = await convertAmount(
        Number(amount),
        fromCurrency,
        toCurrency,
      )
      setResult(conversion)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <main className="shell">
        <h1>Currency Converter</h1>
        <p className="lede">Enter an amount and convert between currencies.</p>

        <form className="converter" onSubmit={handleConvert}>
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
                  setFromCurrency(e.target.value)
                  clearOutcome()
                }}
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} — {c.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className="swap-btn"
              onClick={handleSwap}
              aria-label="Swap currencies"
            >
              ⇄
            </button>

            <div className="field">
              <label htmlFor="to">To</label>
              <select
                id="to"
                value={toCurrency}
                onChange={(e) => {
                  setToCurrency(e.target.value)
                  clearOutcome()
                }}
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} — {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {sameCurrency && (
            <p className="hint error">Choose two different currencies.</p>
          )}

          <button type="submit" className="convert-btn" disabled={!convertEnabled}>
            {loading ? 'Converting…' : 'Convert'}
          </button>
        </form>

        <section className="outcome" aria-live="polite">
          {loading && <div className="status loading">Converting…</div>}
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
