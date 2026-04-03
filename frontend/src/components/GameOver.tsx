import { useTranslation } from 'react-i18next'
import styles from './GameOver.module.css'

interface Props {
  score: number
  correctAnswers: number
  maxStreak: number
  onPlayAgain: () => void
  onMenu: () => void
}

export default function GameOver({ score, correctAnswers, maxStreak, onPlayAgain, onMenu }: Props) {
  const { t } = useTranslation()

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <h2 className={styles.title}>{t('game.gameOver')}</h2>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>{t('game.finalScore')}</span>
            <span className={styles.statValue}>{score.toLocaleString()}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>{t('game.correctAnswers')}</span>
            <span className={styles.statValue}>{correctAnswers}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>{t('game.maxStreak')}</span>
            <span className={styles.statValue}>x{maxStreak}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <button className="btn btn-primary btn-lg" onClick={onPlayAgain}>
            {t('game.playAgain')}
          </button>
          <button className="btn btn-secondary" onClick={onMenu}>
            {t('game.backToMenu')}
          </button>
        </div>
      </div>
    </div>
  )
}
