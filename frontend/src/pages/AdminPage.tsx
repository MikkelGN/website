import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../store/authStore'
import AdminCategories from '../components/admin/AdminCategories'
import AdminWords from '../components/admin/AdminWords'
import AdminPlayers from '../components/admin/AdminPlayers'
import AdminProgress from '../components/admin/AdminProgress'
import styles from './AdminPage.module.css'

type Tab = 'categories' | 'words' | 'players' | 'progress'

export default function AdminPage() {
  const { t } = useTranslation()
  const logout = useAuthStore((s) => s.logoutAdmin)
  const [tab, setTab] = useState<Tab>('categories')

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>{t('admin.title')}</h1>
        <button className="btn btn-danger" onClick={logout}>
          {t('nav.logout')}
        </button>
      </header>

      <nav className={styles.tabs}>
        {(['categories', 'words', 'players', 'progress'] as Tab[]).map((t_) => (
          <button
            key={t_}
            className={`btn ${tab === t_ ? 'btn-primary' : 'btn-secondary'} ${styles.tab}`}
            onClick={() => setTab(t_)}
          >
            {t(`admin.tabs.${t_}`)}
          </button>
        ))}
      </nav>

      <main className={styles.content}>
        {tab === 'categories' && <AdminCategories />}
        {tab === 'words' && <AdminWords />}
        {tab === 'players' && <AdminPlayers />}
        {tab === 'progress' && <AdminProgress />}
      </main>
    </div>
  )
}
