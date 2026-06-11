import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getLeaderboard, GameType, LeaderboardEntry } from '../api/client'
import NavBar from '../components/NavBar'
import styles from './LeaderboardPage.module.css'

interface ExtraColumn {
  labelKey: string
  render: (entry: LeaderboardEntry, t: (key: string) => string) => string
}

interface TabConfig {
  gameType: GameType
  icon: string
  labelKey: string
  activeClass: string
  scoreClass: string
  extraColumns: ExtraColumn[]
}

const TABS: TabConfig[] = [
  {
    gameType: 'word-blitz',
    icon: '🔤',
    labelKey: 'leaderboard.tabWordBlitz',
    activeClass: 'tabActive',
    scoreClass: 'scorePrimary',
    extraColumns: [
      { labelKey: 'leaderboard.correct', render: (e) => String(e.metadata.correct ?? '') },
      { labelKey: 'leaderboard.streak', render: (e) => `x${e.metadata.streak ?? 0}` },
    ],
  },
  {
    gameType: 'math-blitz',
    icon: '🔢',
    labelKey: 'leaderboard.tabMath',
    activeClass: 'tabActive',
    scoreClass: 'scorePrimary',
    extraColumns: [
      {
        labelKey: 'leaderboard.difficulty',
        render: (e, t) => (e.metadata.difficulty ? t(`mathBlitz.${e.metadata.difficulty}`) : ''),
      },
    ],
  },
  {
    gameType: 'snake',
    icon: '🐍',
    labelKey: 'leaderboard.tabSnake',
    activeClass: 'tabActiveSnake',
    scoreClass: 'scoreSnake',
    extraColumns: [],
  },
  {
    gameType: 'tetris',
    icon: '🧱',
    labelKey: 'leaderboard.tabTetris',
    activeClass: 'tabActiveTetris',
    scoreClass: 'scoreTetris',
    extraColumns: [
      { labelKey: 'leaderboard.level', render: (e) => String(e.metadata.level ?? '') },
      { labelKey: 'leaderboard.lines', render: (e) => String(e.metadata.lines ?? '') },
    ],
  },
]

export default function LeaderboardPage() {
  const { t } = useTranslation()
  const [active, setActive] = useState<TabConfig>(TABS[0])
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getLeaderboard(active.gameType, 20)
      .then((r) => setEntries(r.data))
      .finally(() => setLoading(false))
  }, [active])

  const rankIcon = (rank: number) =>
    rank === 1 ? '👑' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`

  return (
    <div className="page">
      <NavBar />
      <div className="container">
        <h2 className={styles.title}>{t('leaderboard.title')}</h2>

        <div className={styles.tabs}>
          {TABS.map((tab) => (
            <button
              key={tab.gameType}
              className={`${styles.tab} ${active.gameType === tab.gameType ? styles[tab.activeClass] : ''}`}
              onClick={() => setActive(tab)}
            >
              {tab.icon} {t(tab.labelKey)}
            </button>
          ))}
        </div>

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
                  {active.extraColumns.map((col) => (
                    <th key={col.labelKey}>{t(col.labelKey)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.rank} className={e.rank <= 3 ? styles.topThree : ''}>
                    <td className={styles.rank}>{rankIcon(e.rank)}</td>
                    <td className={styles.username}>{e.displayName}</td>
                    <td className={styles[active.scoreClass]}>{e.score.toLocaleString()}</td>
                    {active.extraColumns.map((col) => (
                      <td key={col.labelKey}>{col.render(e, t)}</td>
                    ))}
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
