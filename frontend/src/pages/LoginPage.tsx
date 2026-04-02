import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { login } from '../api/client'
import { useAuthStore } from '../store/authStore'
import LangToggle from '../components/LangToggle'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const setPlayer = useAuthStore((s) => s.setPlayer)
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const name = username.trim()
    if (name.length < 2) {
      setError('Min. 2 tegn')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await login(name)
      setPlayer(res.data.token, res.data.userId, res.data.username)
      navigate('/')
    } catch {
      setError(t('error.network'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <LangToggle className={styles.langToggle} />

      <div className={styles.logo}>
        <h1 className="animate-flicker">{t('app.title')}</h1>
        <p className={styles.tagline}>{t('app.tagline')}</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>{t('login.title')}</h2>
        <input
          className="input"
          type="text"
          placeholder={t('login.placeholder')}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          maxLength={30}
          autoFocus
        />
        {error && <p className={styles.error}>{error}</p>}
        <button className="btn btn-primary btn-lg" type="submit" disabled={loading}>
          {loading ? '...' : t('login.button')}
        </button>
      </form>

      <div className={styles.credits}>
        <span>INSERT COIN</span>
      </div>
    </div>
  )
}
