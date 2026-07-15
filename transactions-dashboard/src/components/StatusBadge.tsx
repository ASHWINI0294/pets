import type { TransactionStatus } from '../types'

interface StatusBadgeProps {
  status: TransactionStatus
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`badge ${status}`}>{status}</span>
}
