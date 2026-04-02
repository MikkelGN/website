import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { adminLogin } from '../api/client'
import { useAuthStore } from '../store/authStore'
import styles from './AdminLoginPage.module.css'

export default function AdminLoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const setAdminToken = useAuthStore((s) => s.setAdminToken)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await adminLogin(username, password)
      setAdminToken(res.data.token)
      navigate('/admin')
    } catch {
      setError(t('error.generic'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>{t('admin.login.title')}</h2>
        <input
          className="input"
          type="text"
          placeholder={t('admin.login.username')}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoFocus
        />
        <input
          className="input"
          type="password"
          placeholder={t('admin.login.password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className={styles.error}>{error}</p>}
        <button className="btn btn-secondary btn-lg" type="submit" disabled={loading}>
          {loading ? '...' : t('admin.login.button')}
        </button>
      </form>
    </div>
  )
}
