import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../store/authStore'
import NavBar from '../components/NavBar'
import styles from './HomePage.module.css'

export default function HomePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const username = useAuthStore((s) => s.username)

  return (
    <div className="page">
      <NavBar />
      <div className={styles.content}>
        <div className={styles.titleBlock}>
          <h1 className="animate-flicker">{t('app.title')}</h1>
          <p className={styles.greeting}>{t('home.greeting', { name: username })}</p>
        </div>

        <div className={styles.menuGrid}>
          <button
            className={`btn btn-primary btn-lg ${styles.menuBtn}`}
            onClick={() => navigate('/game')}
          >
            🕹 {t('home.play')}
          </button>
          <button
            className={`btn btn-secondary btn-lg ${styles.menuBtn}`}
            onClick={() => navigate('/leaderboard')}
          >
            🏆 {t('home.leaderboard')}
          </button>
          <button
            className={`btn btn-lg ${styles.menuBtn} ${styles.snakeBtn}`}
            onClick={() => navigate('/snake')}
          >
            🐍 {t('home.snake')}
          </button>
        </div>

        <div className={styles.pixelArt}>
          <span>▓░▓░▓░▓░▓░▓░▓░▓░▓░▓</span>
        </div>
      </div>
    </div>
  )
}
