import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PlayerProgress, adminGetProgress } from '../../api/client'
import styles from './AdminPanel.module.css'

const GAME_LABELS: Record<string, string> = {
  'word-blitz': 'Word Blitz',
  'math-blitz': 'Math Blitz',
  snake: 'Snake',
  tetris: 'Tetris',
}

export default function AdminProgress() {
  const { t } = useTranslation()
  const [rows, setRows] = useState<PlayerProgress[]>([])

  useEffect(() => {
    adminGetProgress().then((r) => setRows(r.data))
  }, [])

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <h3>{t('admin.tabs.progress')}</h3>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>{t('admin.progress.player')}</th>
            <th>{t('admin.progress.game')}</th>
            <th>{t('admin.progress.plays')}</th>
            <th>{t('admin.progress.best')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td className={styles.username}>{row.displayName}</td>
              <td>{GAME_LABELS[row.gameType] ?? row.gameType}</td>
              <td>{row.plays}</td>
              <td>{row.bestScore.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <p>{t('leaderboard.empty')}</p>}
    </div>
  )
}
