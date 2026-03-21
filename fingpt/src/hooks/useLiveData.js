/**
 * useLiveData(fetchFn, intervalMs)
 * Calls fetchFn immediately, then repeats every intervalMs.
 * Returns { data, loading, error, refresh }.
 */
import { useState, useEffect, useRef, useCallback } from 'react'

export function useLiveData(fetchFn, intervalMs = 4000) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const fnRef = useRef(fetchFn)
  fnRef.current = fetchFn

  const run = useCallback(async () => {
    try {
      const result = await fnRef.current()
      setData(result)
      setError(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    run()
    if (!intervalMs) return
    const id = setInterval(run, intervalMs)
    return () => clearInterval(id)
  }, [run, intervalMs])

  return { data, loading, error, refresh: run }
}
