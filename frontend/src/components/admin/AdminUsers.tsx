import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AppUser, adminGetUsers } from '../../api/client'
import styles from './AdminPanel.module.css'

export default function AdminUsers() {
  const { t } = useTranslation()
  const [users, setUsers] = useState<AppUser[]>([])

  useEffect(() => {
    adminGetUsers().then((r) => setUsers(r.data))
  }, [])

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <h3>{t('admin.tabs.users')} ({users.length})</h3>
      </div>
      <table className={styles.table}>
        <thead><tr><th>ID</th><th>Spillernavn</th><th>Oprettet</th></tr></thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td className={styles.username}>{u.username}</td>
              <td>{new Date(u.createdAt).toLocaleDateString('da-DK')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
