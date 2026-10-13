import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useSettings } from '@/store/settingsStore'
import { totalStars, useProgress } from '@/store/progressStore'
import { sfx } from '@/lib/sound'
import { stopSpeaking } from '@/lib/speech'
import styles from './TopBar.module.css'

interface Props {
  onBack?: () => void
  children?: ReactNode
}

export default function TopBar({ onBack, children }: Props) {
  const { t } = useTranslation()
  const soundOn = useSettings((s) => s.soundOn)
  const toggleSound = useSettings((s) => s.toggleSound)
  const stars = useProgress((s) => totalStars(s.dishesCooked))

  return (
    <header className={styles.bar}>
      <div className={styles.side}>
        {onBack && (
          <button
            className={styles.round}
            aria-label={t('common.back')}
            onClick={() => {
              sfx.tap()
              stopSpeaking()
              onBack()
            }}
          >
            <span className="emoji">⬅️</span>
          </button>
        )}
      </div>
      <div className={styles.middle}>{children}</div>
      <div className={`${styles.side} ${styles.right}`}>
        <div className={styles.stars} aria-label={t('common.stars', { count: stars })} data-testid="star-count">
          <span className="emoji">⭐</span> {stars}
        </div>
        <button
          className={styles.round}
          aria-label={soundOn ? t('common.soundOn') : t('common.soundOff')}
          aria-pressed={soundOn}
          onClick={() => {
            if (soundOn) stopSpeaking()
            toggleSound()
            sfx.tap()
          }}
        >
          <span className="emoji">{soundOn ? '🔊' : '🔇'}</span>
        </button>
      </div>
    </header>
  )
}
