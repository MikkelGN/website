import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getPlayers, loginPlayer, PlayerSummary } from '../api/client'
import { useAuthStore } from '../store/authStore'
import { avatarEmoji } from '../lib/avatars'
import LangToggle from '../components/LangToggle'
import PinPad from '../components/PinPad'
import styles from './ProfilePickerPage.module.css'

export default function ProfilePickerPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const setPlayer = useAuthStore((s) => s.setPlayer)

  const [players, setPlayers] = useState<PlayerSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<PlayerSummary | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [verifying, setVerifying] = useState(false)

  useEffect(() => {
    getPlayers()
      .then((res) => setPlayers(res.data))
      .catch(() => setError(t('error.network')))
      .finally(() => setLoading(false))
  }, [t])

  function pick(player: PlayerSummary) {
    setSelected(player)
    setError(null)
  }

  async function submitPin(pin: string) {
    if (!selected) return
    setVerifying(true)
    setError(null)
    try {
      const res = await loginPlayer(selected.id, pin)
      const { token, playerId, displayName, avatarKey } = res.data
      setPlayer(token, playerId, displayName, avatarKey)
      navigate('/')
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status
      setError(status === 429 ? t('login.locked') : t('login.wrongPin'))
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.langToggle}>
        <LangToggle />
      </div>

      <div className={styles.logo}>
        <h1>{t('app.title')}</h1>
      </div>

      {!selected && (
        <div className={styles.pickerCard}>
          <h2 className={styles.prompt}>{t('login.whoIsPlaying')}</h2>
          {loading && <p className={styles.hint}>…</p>}
          {!loading && players.length === 0 && <p className={styles.hint}>{t('login.noProfiles')}</p>}
          <div className={styles.profileGrid}>
            {players.map((p) => (
              <button key={p.id} className={styles.profileCard} onClick={() => pick(p)}>
                <span className={styles.avatar}>{avatarEmoji(p.avatarKey)}</span>
                <span className={styles.name}>{p.displayName}</span>
              </button>
            ))}
          </div>
          {error && <p className={styles.error}>{error}</p>}
        </div>
      )}

      {selected && (
        <div className={styles.pickerCard}>
          <div className={styles.selectedProfile}>
            <span className={styles.avatar}>{avatarEmoji(selected.avatarKey)}</span>
            <span className={styles.name}>{selected.displayName}</span>
          </div>
          <h2 className={styles.prompt}>{t('login.enterPin')}</h2>
          <PinPad onSubmit={submitPin} disabled={verifying} error={!!error} />
          {error && <p className={styles.error}>{error}</p>}
          <button className={styles.backBtn} onClick={() => { setSelected(null); setError(null) }}>
            ← {t('login.back')}
          </button>
        </div>
      )}
    </div>
  )
}
