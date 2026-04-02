import { useRef, useState, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Category } from '../api/client'
import TimerBar from './TimerBar'
import styles from './GameBoard.module.css'

interface Props {
  word: string
  categories: Category[]
  timeLimit: number
  score: number
  streak: number
  onAnswer: (categoryId: number, timeRemaining: number) => void
  onTimeout: () => void
}

export default function GameBoard({ word, categories, timeLimit, score, streak, onAnswer, onTimeout }: Props) {
  const { t, i18n } = useTranslation()
  const isDa = i18n.language === 'da'
  const remainingRef = useRef(timeLimit)
  const [timerKey, setTimerKey] = useState(0)
  const [answering, setAnswering] = useState(false)

  // Reset timer when word or timeLimit changes
  useEffect(() => {
    remainingRef.current = timeLimit
    setTimerKey((k) => k + 1)
    setAnswering(false)
  }, [word, timeLimit])

  const handleTimeout = useCallback(() => {
    if (!answering) onTimeout()
  }, [answering, onTimeout])

  // Track remaining time via interval
  useEffect(() => {
    const id = setInterval(() => {
      remainingRef.current = Math.max(0, remainingRef.current - 0.1)
    }, 100)
    return () => clearInterval(id)
  }, [timerKey])

  async function handleClick(categoryId: number) {
    if (answering) return
    setAnswering(true)
    await onAnswer(categoryId, parseFloat(remainingRef.current.toFixed(2)))
  }

  return (
    <div className={styles.board}>
      <div className={styles.hud}>
        <span className={styles.hudItem}>
          <span className={styles.hudLabel}>{t('game.score', { score: '' })}</span>
          <span className={styles.hudValue}>{score.toLocaleString()}</span>
        </span>
        <span className={styles.hudItem}>
          <span className={styles.hudLabel}>{t('game.streak', { streak: '' })}</span>
          <span className={`${styles.hudValue} ${streak > 2 ? styles.hotStreak : ''}`}>
            x{streak}
          </span>
        </span>
      </div>

      <TimerBar
        key={timerKey}
        duration={timeLimit}
        onTimeout={handleTimeout}
        running={!answering}
      />

      <div className={styles.wordCard}>
        <p className={styles.prompt}>{t('game.whatIs')}</p>
        <h1 className={styles.word}>{word}</h1>
      </div>

      <div className={styles.categoryGrid}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={styles.catBtn}
            style={{ '--cat-color': cat.color } as React.CSSProperties}
            onClick={() => handleClick(cat.id)}
            disabled={answering}
          >
            {isDa ? cat.nameDa : cat.nameEn}
          </button>
        ))}
      </div>
    </div>
  )
}
