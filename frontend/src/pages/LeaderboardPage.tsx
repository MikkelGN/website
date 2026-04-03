import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getLeaderboard, getSnakeLeaderboard, LeaderboardEntry, SnakeLeaderboardEntry } from '../api/client'
import NavBar from '../components/NavBar'
import styles from './LeaderboardPage.module.css'

type Tab = 'wordblitz' | 'snake'

export default function LeaderboardPage() {
  const { t } = useTranslation()
  const [tab, setTab] = useState<Tab>('wordblitz')
  const [wbEntries, setWbEntries] = useState<LeaderboardEntry[]>([])
  const [snakeEntries, setSnakeEntries] = useState<SnakeLeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    if (tab === 'wordblitz') {
      getLeaderboard(20)
        .then((r) => setWbEntries(r.data))
        .finally(() => setLoading(false))
    } else {
      getSnakeLeaderboard(20)
        .then((r) => setSnakeEntries(r.data))
        .finally(() => setLoading(false))
    }
  }, [tab])

  const rankIcon = (rank: number) =>
    rank === 1 ? '👑' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`

  return (
    <div className="page">
      <NavBar />
      <div className="container">
        <h2 className={styles.title}>{t('leaderboard.title')}</h2>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === 'wordblitz' ? styles.tabActive : ''}`}
            onClick={() => setTab('wordblitz')}
          >
            🕹 {t('leaderboard.tabWordBlitz')}
          </button>
          <button
            className={`${styles.tab} ${tab === 'snake' ? styles.tabActiveSnake : ''}`}
            onClick={() => setTab('snake')}
          >
            🐍 {t('leaderboard.tabSnake')}
          </button>
        </div>

        {loading && <p className={styles.loading}>LOADING...</p>}

        {!loading && tab === 'wordblitz' && (
          wbEntries.length === 0
            ? <p className={styles.empty}>{t('leaderboard.empty')}</p>
            : (
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
                    {wbEntries.map((e) => (
                      <tr key={e.rank} className={e.rank <= 3 ? styles.topThree : ''}>
                        <td className={styles.rank}>{rankIcon(e.rank)}</td>
                        <td className={styles.username}>{e.username}</td>
                        <td className={styles.scorePrimary}>{e.totalScore.toLocaleString()}</td>
                        <td>{e.correctAnswers}</td>
                        <td>x{e.maxStreak}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
        )}

        {!loading && tab === 'snake' && (
          snakeEntries.length === 0
            ? <p className={styles.empty}>{t('leaderboard.empty')}</p>
            : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>{t('leaderboard.rank')}</th>
                      <th>{t('leaderboard.player')}</th>
                      <th>{t('leaderboard.score')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {snakeEntries.map((e) => (
                      <tr key={e.rank} className={e.rank <= 3 ? styles.topThree : ''}>
                        <td className={styles.rank}>{rankIcon(e.rank)}</td>
                        <td className={styles.username}>{e.username}</td>
                        <td className={styles.scoreSnake}>{e.score.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
        )}
      </div>
    </div>
  )
}
