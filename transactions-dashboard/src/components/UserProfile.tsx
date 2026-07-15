import type { User } from '../types'
import { formatAmount } from '../utils/format'

interface UserProfileProps {
  user: User
}

export default function UserProfile({ user }: UserProfileProps) {
  return (
    <section className="card" aria-label="User profile">
      <h2>{user.name}</h2>
      <p className="muted">{user.email}</p>
      <div className="profile-row">
        <span>
          Account: <strong>{user.accountType}</strong>
        </span>
        <span>
          Balance:{' '}
          <strong className="balance">{formatAmount(user.balance, user.currency)}</strong>
        </span>
      </div>
    </section>
  )
}
