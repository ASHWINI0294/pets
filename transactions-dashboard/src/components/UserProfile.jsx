import { useCallback } from 'react'
import { getUser } from '../api/mockApi'
import { useAsync } from '../hooks/useAsync'
import { formatCurrency } from '../utils/format'
import LoadingState from './LoadingState'
import ErrorState from './ErrorState'

export default function UserProfile() {
  const fetcher = useCallback(() => getUser(), [])
  const { status, data: user, error, retry } = useAsync(fetcher)

  return (
    <section className="card profile-card" aria-label="User profile">
      {status === 'loading' && <LoadingState label="Loading profile…" />}
      {status === 'error' && <ErrorState message={error} onRetry={retry} />}

      {status === 'success' && user && (
        <div className="profile-grid">
          <div className="profile-avatar" aria-hidden="true">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="profile-details">
            <h2 className="profile-name">{user.name}</h2>
            <p className="profile-email">{user.email}</p>
          </div>
          <div className="profile-stat">
            <span className="profile-stat-label">Account Type</span>
            <span className="profile-stat-value profile-stat-value--pill">
              {user.accountType}
            </span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat-label">Current Balance</span>
            <span className="profile-stat-value profile-stat-value--balance">
              {formatCurrency(user.balance, user.currency)}
            </span>
          </div>
        </div>
      )}
    </section>
  )
}
