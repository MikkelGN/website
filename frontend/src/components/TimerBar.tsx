import { useEffect, useRef, useState } from 'react'
import styles from './TimerBar.module.css'

interface Props {
  duration: number          // seconds
  onTimeout: () => void
  running: boolean
  key: number | string      // reset when key changes
}

export default function TimerBar({ duration, onTimeout, running }: Props) {
  const [remaining, setRemaining] = useState(duration)
  const intervalRef = useRef<number | null>(null)
  const remainingRef = useRef(duration)

  useEffect(() => {
    remainingRef.current = duration
    setRemaining(duration)
  }, [duration])

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }

    intervalRef.current = window.setInterval(() => {
      remainingRef.current -= 0.1
      setRemaining(Math.max(0, remainingRef.current))
      if (remainingRef.current <= 0) {
        clearInterval(intervalRef.current!)
        onTimeout()
      }
    }, 100)

    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running, onTimeout])

  const pct = Math.max(0, (remaining / duration) * 100)
  const isLow = pct < 30

  return (
    <div className={styles.wrap}>
      <div
        className={`${styles.bar} ${isLow ? styles.low : ''}`}
        style={{ width: `${pct}%` }}
      />
      <span className={`${styles.label} ${isLow ? styles.lowLabel : ''}`}>
        {remaining.toFixed(1)}s
      </span>
    </div>
  )
}

// Export a hook to get the current remaining time for submitting with answers
export function useTimerRef(duration: number, running: boolean, onTimeout: () => void) {
  const remainingRef = useRef(duration)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    remainingRef.current = duration
  }, [duration])

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = window.setInterval(() => {
      remainingRef.current -= 0.1
      if (remainingRef.current <= 0) {
        clearInterval(intervalRef.current!)
        onTimeout()
      }
    }, 100)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running, onTimeout])

  return remainingRef
}
