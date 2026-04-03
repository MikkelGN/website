import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../store/authStore'
import LangToggle from './LangToggle'
import styles from './NavBar.module.css'

export default function NavBar() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { username, logout } = useAuthStore()

  return (
    <nav className={styles.nav}>
      <button className={styles.logo} onClick={() => navigate('/')}>
        {t('app.title')}
      </button>
      <div className={styles.links}>
        <button className="btn btn-secondary" onClick={() => navigate('/leaderboard')}>
          {t('nav.leaderboard')}
        </button>
      </div>
      <div className={styles.right}>
        <LangToggle />
        <span className={styles.username}>{username}</span>
        <button className={`btn btn-danger ${styles.logoutBtn}`} onClick={() => { logout(); navigate('/login') }}>
          {t('nav.logout')}
        </button>
      </div>
    </nav>
  )
}
