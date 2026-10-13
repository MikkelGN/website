import { useMemo } from 'react'
import styles from './Celebration.module.css'

const PIECES = ['⭐', '💛', '✨', '🧡', '⭐', '💚', '✨', '💙']

/** A one-shot burst of stars and hearts from the middle of the screen. */
export default function Celebration({ count = 18 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4
        const dist = 30 + Math.random() * 25
        return {
          char: PIECES[i % PIECES.length],
          dx: `${Math.cos(angle) * dist}vmin`,
          dy: `${Math.sin(angle) * dist}vmin`,
          delay: `${Math.random() * 150}ms`,
        }
      }),
    [count],
  )

  return (
    <div className={styles.burst} aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          className={`emoji ${styles.piece}`}
          style={{ ['--dx' as string]: p.dx, ['--dy' as string]: p.dy, animationDelay: p.delay }}
        >
          {p.char}
        </span>
      ))}
    </div>
  )
}
