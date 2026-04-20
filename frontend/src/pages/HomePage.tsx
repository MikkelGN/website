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

        <p className={styles.selectLabel}>{t('home.selectGame')}</p>

        <div className={styles.gameGrid}>
          <button className={`${styles.gameCard} ${styles.wordCard}`} onClick={() => navigate('/game')}>
            <span className={styles.gameIcon}>🕹</span>
            <span className={styles.gameTitle}>{t('home.wordBlitzTitle')}</span>
            <span className={styles.gameDesc}>{t('home.wordBlitzDesc')}</span>
            <span className={`btn btn-primary ${styles.playBtn}`}>{t('home.play')}</span>
          </button>

          <button className={`${styles.gameCard} ${styles.snakeCard}`} onClick={() => navigate('/snake')}>
            <span className={styles.gameIcon}>🐍</span>
            <span className={styles.gameTitle}>{t('home.snakeTitle')}</span>
            <span className={styles.gameDesc}>{t('home.snakeDesc')}</span>
            <span className={`btn ${styles.playBtn} ${styles.snakePlayBtn}`}>{t('home.play')}</span>
          </button>

          <button className={`${styles.gameCard} ${styles.tetrisCard}`} onClick={() => navigate('/tetris')}>
            <span className={styles.gameIcon}>🟦</span>
            <span className={styles.gameTitle}>{t('home.tetrisTitle')}</span>
            <span className={styles.gameDesc}>{t('home.tetrisDesc')}</span>
            <span className={`btn ${styles.playBtn} ${styles.tetrisPlayBtn}`}>{t('home.play')}</span>
          </button>

          <button className={`${styles.gameCard} ${styles.wordleCard}`} onClick={() => navigate('/wordle')}>
            <span className={styles.gameIcon}>🟩</span>
            <span className={styles.gameTitle}>{t('home.wordleTitle')}</span>
            <span className={styles.gameDesc}>{t('home.wordleDesc')}</span>
            <span className={`btn ${styles.playBtn} ${styles.wordlePlayBtn}`}>{t('home.open')}</span>
          </button>

          <button className={`${styles.gameCard} ${styles.linkedinCard}`} onClick={() => navigate('/linkedin')}>
            <span className={styles.gameIcon}>💼</span>
            <span className={styles.gameTitle}>{t('home.linkedinTitle')}</span>
            <span className={styles.gameDesc}>{t('home.linkedinDesc')}</span>
            <span className={`btn ${styles.playBtn} ${styles.linkedinPlayBtn}`}>{t('home.open')}</span>
          </button>
        </div>

        <button className={`btn btn-secondary ${styles.leaderboardBtn}`} onClick={() => navigate('/leaderboard')}>
          🏆 {t('home.leaderboard')}
        </button>

        <div className={styles.pixelArt}>
          <span>▓░▓░▓░▓░▓░▓░▓░▓░▓░▓</span>
        </div>
      </div>
    </div>
  )
}
