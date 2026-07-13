export function formatCurrency(amount, currency = 'USD') {
  if (typeof amount !== 'number' || Number.isNaN(amount)) return '—'

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount)
  } catch {
    // Fallback for an unrecognized/invalid currency code.
    return `${currency} ${amount.toFixed(2)}`
  }
}

export function formatDate(dateInput) {
  const date = new Date(dateInput)
  if (Number.isNaN(date.getTime())) return '—'

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}
