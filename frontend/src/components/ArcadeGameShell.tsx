import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import NavBar from './NavBar'
import styles from './ArcadeGameShell.module.css'

export type ArcadeUiState = 'idle' | 'playing' | 'paused' | 'gameover'

interface Props {
  /** i18n namespace of the game ('snake' | 'tetris') */
  game: string
  uiState: ArcadeUiState
  score: number
  highScore: number
  /** Tetris draws the score inside the canvas, so its HUD only shows best */
  showScoreInHud?: boolean
  frame: 'primary' | 'secondary'
  onStart: () => void
  onResume: () => void
  children: ReactNode
}

export default function ArcadeGameShell({
  game,
  uiState,
  score,
  highScore,
  showScoreInHud = true,
  frame,
  onStart,
  onResume,
  children,
}: Props) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="page">
      <NavBar />
      <div className={styles.content}>
        <div className={styles.hud}>
          {showScoreInHud && (
            <span className={styles.hudItem}>
              {t(`${game}.score`)}: <strong className={styles.scoreVal}>{score.toLocaleString()}</strong>
            </span>
          )}
          <span className={styles.hudItem}>
            {t(`${game}.best`)}: <strong className={styles.highVal}>{highScore.toLocaleString()}</strong>
          </span>
        </div>

        <div className={`${styles.canvasWrapper} ${frame === 'primary' ? styles.framePrimary : styles.frameSecondary}`}>
          {children}

          {uiState === 'idle' && (
            <div className={styles.overlay}>
              <h2 className={styles.overlayTitle}>{t(`${game}.title`)}</h2>
              <p className={styles.overlayHint}>{t(`${game}.hint`)}</p>
              <button className="btn btn-primary btn-lg" onClick={onStart}>
                {t(`${game}.start`)}
              </button>
            </div>
          )}

          {uiState === 'paused' && (
            <div className={styles.overlay}>
              <h2 className={styles.overlayTitle}>{t(`${game}.paused`)}</h2>
              <button className="btn btn-secondary btn-lg" onClick={onResume}>
                {t(`${game}.resume`)}
              </button>
            </div>
          )}

          {uiState === 'gameover' && (
            <div className={styles.overlay}>
              <h2 className={`${styles.overlayTitle} ${styles.gameoverTitle}`}>
                {t(`${game}.gameover`)}
              </h2>
              <p className={styles.finalScore}>
                {t(`${game}.score`)}: <span className={styles.scoreVal}>{score.toLocaleString()}</span>
              </p>
              {score > 0 && score >= highScore && (
                <p className={styles.newHigh}>★ {t(`${game}.newHigh`)} ★</p>
              )}
              <div className={styles.overlayButtons}>
                <button className="btn btn-primary" onClick={onStart}>
                  {t(`${game}.playAgain`)}
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/')}>
                  {t(`${game}.menu`)}
                </button>
              </div>
            </div>
          )}
        </div>

        <p className={styles.controlsHint}>{t(`${game}.controlsHint`)}</p>
      </div>
    </div>
  )
}
