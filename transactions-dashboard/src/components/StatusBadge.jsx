const STATUS_LABELS = {
  completed: 'Completed',
  pending: 'Pending',
  failed: 'Failed',
}

export default function StatusBadge({ status }) {
  const normalized = String(status || '').toLowerCase()
  const label = STATUS_LABELS[normalized] || status

  return <span className={`badge badge--${normalized}`}>{label}</span>
}
