import { useCallback, useEffect, useState } from 'react'

// Generic "fetch on mount, expose loading/error/data, allow retry" hook.
// Both the user profile and the transactions list share this exact shape,
// so the state-machine logic only needs to be written once.
export function useAsync(fetcher) {
  const [status, setStatus] = useState('loading') // 'loading' | 'success' | 'error'
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const run = useCallback(() => {
    let cancelled = false
    setStatus('loading')
    setError(null)

    fetcher()
      .then((result) => {
        if (cancelled) return
        setData(result)
        setStatus('success')
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Something went wrong.')
        setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [fetcher])

  useEffect(() => run(), [run])

  return { status, data, error, retry: run }
}
