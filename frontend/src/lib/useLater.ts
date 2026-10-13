import { useCallback, useEffect, useRef } from 'react'

/** setTimeout that is cancelled automatically when the component unmounts. */
export function useLater() {
  const timers = useRef<number[]>([])
  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), [])
  return useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }, [])
}
