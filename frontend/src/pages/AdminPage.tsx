import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../store/authStore'
import AdminCategories from '../components/admin/AdminCategories'
import AdminWords from '../components/admin/AdminWords'
import AdminUsers from '../components/admin/AdminUsers'
import styles from './AdminPage.module.css'

type Tab = 'categories' | 'words' | 'users'

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
        {(['categories', 'words', 'users'] as Tab[]).map((t_) => (
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
        {tab === 'users' && <AdminUsers />}
      </main>
    </div>
  )
}
