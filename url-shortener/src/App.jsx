import { useEffect, useState } from 'react'
import './App.css'

const HISTORY_KEY = 'url-shortener-history'

function isValidUrl(value) {
  if (!value.trim()) return false
  try {
    const url = new URL(value.trim())
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

async function shortenUrl(longUrl) {
  const trimmed = longUrl.trim()

  const response = await fetch(
    `https://is.gd/create.php?format=json&url=${encodeURIComponent(trimmed)}`,
  )

  if (!response.ok) {
    throw new Error('Unable to reach the shortening service.')
  }

  const data = await response.json()

  if (data.errorcode) {
    throw new Error(data.errormessage || 'Failed to shorten URL.')
  }

  return {
    shortUrl: data.shorturl,
    originalUrl: trimmed,
    createdAt: new Date().toISOString(),
  }
}

function App() {
  const [inputUrl, setInputUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [latestResult, setLatestResult] = useState(null)
  const [history, setHistory] = useState([])
  const [copiedId, setCopiedId] = useState(null)

  const isInputValid = isValidUrl(inputUrl)
  const isSubmitDisabled = !isInputValid || loading

  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_KEY)
    if (saved) {
      try {
        setHistory(JSON.parse(saved))
      } catch {
        localStorage.removeItem(HISTORY_KEY)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  }, [history])

  async function handleSubmit(event) {
    event.preventDefault()
    if (!isInputValid || loading) return

    setLoading(true)
    setError('')
    setLatestResult(null)

    try {
      const result = await shortenUrl(inputUrl)
      setLatestResult(result)
      setHistory((prev) => [result, ...prev.filter((item) => item.shortUrl !== result.shortUrl)])
      setInputUrl('')
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy(shortUrl) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shortUrl)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = shortUrl
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      setCopiedId(shortUrl)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      setError('Could not copy to clipboard.')
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>URL Shortener</h1>
        <p>Paste a long link and get a short URL you can share instantly.</p>
      </header>

      <main className="card">
        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="url-input" className="label">
            Long URL
          </label>
          <div className="input-row">
            <input
              id="url-input"
              type="url"
              className={`input ${inputUrl && !isInputValid ? 'input--invalid' : ''}`}
              placeholder="https://example.com/very/long/path"
              value={inputUrl}
              onChange={(event) => {
                setInputUrl(event.target.value)
                if (error) setError('')
              }}
              disabled={loading}
            />
            <button type="submit" className="button" disabled={isSubmitDisabled}>
              {loading ? 'Shortening...' : 'Shorten'}
            </button>
          </div>

          {inputUrl && !isInputValid && (
            <p className="hint hint--error">Enter a valid URL starting with http:// or https://</p>
          )}
        </form>

        {loading && (
          <div className="status status--loading" role="status" aria-live="polite">
            <span className="spinner" aria-hidden="true" />
            Shortening your URL...
          </div>
        )}

        {error && (
          <div className="status status--error" role="alert">
            {error}
          </div>
        )}

        {latestResult && !loading && (
          <div className="status status--success" role="status" aria-live="polite">
            <p className="success-label">Your shortened URL</p>
            <div className="result-row">
              <a href={latestResult.shortUrl} target="_blank" rel="noreferrer" className="short-link">
                {latestResult.shortUrl}
              </a>
              <button
                type="button"
                className="button button--secondary"
                onClick={() => handleCopy(latestResult.shortUrl)}
              >
                {copiedId === latestResult.shortUrl ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}
      </main>

      {history.length > 0 && (
        <section className="history">
          <h2>Recent links</h2>
          <ul className="history-list">
            {history.map((item) => (
              <li key={item.shortUrl} className="history-item">
                <div className="history-text">
                  <a href={item.shortUrl} target="_blank" rel="noreferrer" className="short-link">
                    {item.shortUrl}
                  </a>
                  <span className="original-url" title={item.originalUrl}>
                    {item.originalUrl}
                  </span>
                </div>
                <button
                  type="button"
                  className="button button--secondary"
                  onClick={() => handleCopy(item.shortUrl)}
                >
                  {copiedId === item.shortUrl ? 'Copied!' : 'Copy'}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

export default App
