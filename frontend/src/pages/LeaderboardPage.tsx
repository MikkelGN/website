import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getLeaderboard, LeaderboardEntry } from '../api/client'
import NavBar from '../components/NavBar'
import styles from './LeaderboardPage.module.css'

export default function LeaderboardPage() {
  const { t } = useTranslation()
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLeaderboard(20)
      .then((r) => setEntries(r.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page">
      <NavBar />
      <div className="container">
        <h2 className={styles.title}>{t('leaderboard.title')}</h2>

        {loading && <p className={styles.loading}>LOADING...</p>}

        {!loading && entries.length === 0 && (
          <p className={styles.empty}>{t('leaderboard.empty')}</p>
        )}

        {!loading && entries.length > 0 && (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t('leaderboard.rank')}</th>
                  <th>{t('leaderboard.player')}</th>
                  <th>{t('leaderboard.score')}</th>
                  <th>{t('leaderboard.correct')}</th>
                  <th>{t('leaderboard.streak')}</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.rank} className={e.rank <= 3 ? styles.topThree : ''}>
                    <td className={styles.rank}>
                      {e.rank === 1 ? '👑' : e.rank === 2 ? '🥈' : e.rank === 3 ? '🥉' : `#${e.rank}`}
                    </td>
                    <td className={styles.username}>{e.username}</td>
                    <td className={styles.score}>{e.totalScore.toLocaleString()}</td>
                    <td>{e.correctAnswers}</td>
                    <td>x{e.maxStreak}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
