import { useEffect, useState } from 'react'
import styles from './PinPad.module.css'

interface Props {
  onSubmit: (pin: string) => void
  disabled?: boolean
  error?: boolean
}

const PIN_LENGTH = 4

export default function PinPad({ onSubmit, disabled, error }: Props) {
  const [pin, setPin] = useState('')

  useEffect(() => {
    if (error) setPin('')
  }, [error])

  useEffect(() => {
    if (pin.length === PIN_LENGTH) {
      onSubmit(pin)
      setPin('')
    }
  }, [pin, onSubmit])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (disabled) return
      if (/^[0-9]$/.test(e.key)) setPin((p) => (p.length < PIN_LENGTH ? p + e.key : p))
      if (e.key === 'Backspace') setPin((p) => p.slice(0, -1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [disabled])

  function press(digit: string) {
    if (disabled) return
    setPin((p) => (p.length < PIN_LENGTH ? p + digit : p))
  }

  return (
    <div className={`${styles.pad} ${error ? 'animate-shake' : ''}`}>
      <div className={styles.dots}>
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <span key={i} className={`${styles.dot} ${i < pin.length ? styles.dotFilled : ''}`} />
        ))}
      </div>
      <div className={styles.keys}>
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
          <button key={d} className={styles.key} onClick={() => press(d)} disabled={disabled}>
            {d}
          </button>
        ))}
        <span />
        <button className={styles.key} onClick={() => press('0')} disabled={disabled}>
          0
        </button>
        <button
          className={`${styles.key} ${styles.backspace}`}
          onClick={() => setPin((p) => p.slice(0, -1))}
          disabled={disabled}
          aria-label="Backspace"
        >
          ⌫
        </button>
      </div>
    </div>
  )
}
