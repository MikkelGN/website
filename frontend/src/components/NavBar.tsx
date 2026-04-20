import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import LangToggle from './LangToggle'
import { getInfo } from '../api/client'
import styles from './NavBar.module.css'

export default function NavBar() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { username, logout } = useAuthStore()
  const [info, setInfo] = useState<{ buildTime: string; llmModel: string } | null>(null)

  useEffect(() => {
    getInfo()
      .then(res => setInfo(res.data))
      .catch(() => {})
  }, [])

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
        {info && (
          <span className={styles.info} title={`LLM: ${info.llmModel}`}>
            {info.buildTime}
          </span>
        )}
        <LangToggle />
        <span className={styles.username}>{username}</span>
        <button className={`btn btn-danger ${styles.logoutBtn}`} onClick={() => { logout(); navigate('/login') }}>
          {t('nav.logout')}
        </button>
      </div>
    </nav>
  )
}
