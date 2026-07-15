import { FormEvent, useState } from 'react'

interface LoginFormProps {
  loading: boolean
  error: string
  onSubmit: (email: string, password: string) => Promise<void>
}

export default function LoginForm({ loading, error, onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await onSubmit(email, password)
  }

  return (
    <section className="card login-card">
      <h2 className="login-title">Login</h2>
      <p className="login-subtitle">Sign in to load your profile and transactions.</p>

      <form className="login-form" onSubmit={handleSubmit}>
        <label className="login-label">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            disabled={loading}
            autoComplete="username"
          />
        </label>
        <label className="login-label">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={loading}
            autoComplete="current-password"
          />
        </label>

        {error ? <div className="form-error">{error}</div> : null}

        <button type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </section>
  )
}
