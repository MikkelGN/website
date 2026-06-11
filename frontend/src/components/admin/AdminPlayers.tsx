import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AdminPlayer,
  adminGetPlayers,
  adminCreatePlayer,
  adminUpdatePlayer,
  adminResetPin,
  adminDeletePlayer,
} from '../../api/client'
import { AVATAR_KEYS, AVATARS } from '../../lib/avatars'
import styles from './AdminPanel.module.css'

export default function AdminPlayers() {
  const { t } = useTranslation()
  const [players, setPlayers] = useState<AdminPlayer[]>([])
  const [editing, setEditing] = useState<AdminPlayer | null>(null)
  const [form, setForm] = useState({ displayName: '', avatarKey: 'star', pin: '' })

  useEffect(() => { load() }, [])

  async function load() {
    const res = await adminGetPlayers()
    setPlayers(res.data)
  }

  function startNew() {
    setEditing({ id: 0, displayName: '', avatarKey: 'star', createdAt: '' })
    setForm({ displayName: '', avatarKey: 'star', pin: '' })
  }

  function startEdit(player: AdminPlayer) {
    setEditing(player)
    setForm({ displayName: player.displayName, avatarKey: player.avatarKey, pin: '' })
  }

  async function save() {
    if (!editing) return
    if (editing.id === 0) {
      if (!/^\d{4}$/.test(form.pin)) return
      await adminCreatePlayer(form)
    } else {
      await adminUpdatePlayer(editing.id, { displayName: form.displayName, avatarKey: form.avatarKey })
      if (/^\d{4}$/.test(form.pin)) {
        await adminResetPin(editing.id, form.pin)
      }
    }
    setEditing(null)
    load()
  }

  async function remove(id: number) {
    if (!confirm(t('admin.player.confirmDelete'))) return
    await adminDeletePlayer(id)
    load()
  }

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <h3>{t('admin.tabs.players')} ({players.length})</h3>
        <button className="btn btn-success" onClick={startNew}>+ {t('admin.actions.add')}</button>
      </div>

      {editing && (
        <div className={styles.form}>
          <input className="input" placeholder={t('admin.player.name')}
            value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} />
          <div className={styles.colorRow}>
            {AVATAR_KEYS.map((key) => (
              <button key={key}
                className={`${styles.avatarSwatch} ${form.avatarKey === key ? styles.colorActive : ''}`}
                onClick={() => setForm({ ...form, avatarKey: key })}>
                {AVATARS[key]}
              </button>
            ))}
          </div>
          <input className="input" inputMode="numeric" maxLength={4}
            placeholder={editing.id === 0 ? t('admin.player.pin') : t('admin.player.newPin')}
            value={form.pin}
            onChange={(e) => setForm({ ...form, pin: e.target.value.replace(/\D/g, '') })} />
          <div className={styles.formActions}>
            <button className="btn btn-primary" onClick={save}
              disabled={!form.displayName.trim() || (editing.id === 0 && !/^\d{4}$/.test(form.pin))}>
              {t('admin.actions.save')}
            </button>
            <button className="btn btn-secondary" onClick={() => setEditing(null)}>{t('admin.actions.cancel')}</button>
          </div>
        </div>
      )}

      <table className={styles.table}>
        <thead>
          <tr><th></th><th>{t('admin.player.name')}</th><th>{t('admin.player.created')}</th><th></th></tr>
        </thead>
        <tbody>
          {players.map((p) => (
            <tr key={p.id}>
              <td>{AVATARS[p.avatarKey] ?? AVATARS.star}</td>
              <td className={styles.username}>{p.displayName}</td>
              <td>{p.createdAt ? new Date(p.createdAt).toLocaleDateString('da-DK') : ''}</td>
              <td className={styles.actions}>
                <button className="btn btn-secondary" onClick={() => startEdit(p)}>{t('admin.actions.edit')}</button>
                <button className="btn btn-danger" onClick={() => remove(p.id)}>{t('admin.actions.delete')}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
