import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Character from '@/characters/Character'
import SpeechBubble from '@/components/SpeechBubble'
import TopBar from '@/components/TopBar'
import { useSettings } from '@/store/settingsStore'
import type { Lang } from '@/store/settingsStore'
import { sfx } from '@/lib/sound'
import styles from './HomePage.module.css'

const LANGS: { id: Lang; flag: string }[] = [
  { id: 'da', flag: '🇩🇰' },
  { id: 'en', flag: '🇬🇧' },
]

export default function HomePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const lang = useSettings((s) => s.lang)
  const setLang = useSettings((s) => s.setLang)

  return (
    <div className={styles.page}>
      <TopBar>
        <div className={styles.langs} role="group" aria-label={t('common.language')}>
          {LANGS.map((l) => (
            <button
              key={l.id}
              className={`${styles.lang} ${lang === l.id ? styles.langActive : ''}`}
              aria-label={l.id.toUpperCase()}
              aria-pressed={lang === l.id}
              onClick={() => {
                sfx.tap()
                setLang(l.id)
              }}
            >
              <span className="emoji">{l.flag}</span>
            </button>
          ))}
        </div>
      </TopBar>

      <main className={styles.main}>
        <h1 className={styles.logo}>{t('common.appName')}</h1>

        <SpeechBubble text={t('home.speak')}>
          {t('home.greeting')}
          <br />
          {t('home.question')}
        </SpeechBubble>

        <div className={styles.friends}>
          <Character id="kapi" mood="happy" size="min(34vw, 30vh, 220px)" />
          <Character id="bao" mood="happy" size="min(34vw, 30vh, 220px)" />
        </div>

        <div className={styles.games}>
          <button
            className={`${styles.card} ${styles.kitchen}`}
            onClick={() => {
              sfx.pop()
              navigate('/koekken')
            }}
          >
            <span className={`emoji ${styles.cardIcon}`}>🍳</span>
            <span className={styles.cardText}>
              <strong>{t('home.cookingTitle')}</strong>
              <small>{t('home.cookingText')}</small>
            </span>
          </button>
          <div className={`${styles.card} ${styles.soon}`} aria-hidden="true">
            <span className={`emoji ${styles.cardIcon}`}>🎁</span>
            <span className={styles.cardText}>
              <small>{t('home.moreSoon')}</small>
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}
