import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../store/authStore'
import NavBar from '../components/NavBar'
import styles from './HomePage.module.css'

interface GameTile {
  icon: string
  titleKey: string
  descKey: string
  route?: string
  cardClass: string
  btnClass: string
}

interface CategorySection {
  labelKey: string
  games: GameTile[]
}

const SECTIONS: CategorySection[] = [
  {
    labelKey: 'home.catLanguage',
    games: [
      {
        icon: '🔤',
        titleKey: 'home.wordBlitzTitle',
        descKey: 'home.wordBlitzDesc',
        route: '/play/word-blitz',
        cardClass: 'wordCard',
        btnClass: 'btn-primary',
      },
    ],
  },
  {
    labelKey: 'home.catMath',
    games: [
      {
        icon: '🔢',
        titleKey: 'home.mathBlitzTitle',
        descKey: 'home.mathBlitzDesc',
        route: '/play/math-blitz',
        cardClass: 'mathCard',
        btnClass: 'btn-secondary',
      },
    ],
  },
  {
    labelKey: 'home.catArcade',
    games: [
      {
        icon: '🐍',
        titleKey: 'home.snakeTitle',
        descKey: 'home.snakeDesc',
        route: '/play/snake',
        cardClass: 'snakeCard',
        btnClass: 'btn-success',
      },
      {
        icon: '🧱',
        titleKey: 'home.tetrisTitle',
        descKey: 'home.tetrisDesc',
        route: '/play/tetris',
        cardClass: 'tetrisCard',
        btnClass: 'btn-secondary',
      },
    ],
  },
]

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

        <div className={styles.sections}>
          {SECTIONS.map((section) => (
            <section key={section.labelKey} className={styles.categorySection}>
              <h2 className={styles.categoryTitle}>{t(section.labelKey)}</h2>
              <div className={styles.gameGrid}>
                {section.games.map((game) => (
                  <button
                    key={game.titleKey}
                    className={`${styles.gameCard} ${styles[game.cardClass]}`}
                    onClick={() => game.route && navigate(game.route)}
                    disabled={!game.route}
                  >
                    <span className={styles.gameIcon}>{game.icon}</span>
                    <span className={styles.gameTitle}>{t(game.titleKey)}</span>
                    <span className={styles.gameDesc}>{t(game.descKey)}</span>
                    <span className={`btn ${game.btnClass} ${styles.playBtn}`}>
                      {game.route ? t('home.play') : t('home.comingSoon')}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>

        <button className={`btn btn-secondary ${styles.leaderboardBtn}`} onClick={() => navigate('/leaderboard')}>
          🏆 {t('home.leaderboard')}
        </button>
      </div>
    </div>
  )
}
