import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Category,
  adminGetCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
} from '../../api/client'
import styles from './AdminPanel.module.css'

const COLORS = ['#ff00ff', '#00ffff', '#ffff00', '#00ff88', '#ff8800', '#ff0066']

export default function AdminCategories() {
  const { t } = useTranslation()
  const [categories, setCategories] = useState<Category[]>([])
  const [editing, setEditing] = useState<Category | null>(null)
  const [form, setForm] = useState({ nameDa: '', nameEn: '', color: '#ff00ff' })

  useEffect(() => { load() }, [])

  async function load() {
    const res = await adminGetCategories()
    setCategories(res.data)
  }

  function startEdit(cat: Category) {
    setEditing(cat)
    setForm({ nameDa: cat.nameDa, nameEn: cat.nameEn, color: cat.color })
  }

  function startNew() {
    setEditing({ id: 0, nameDa: '', nameEn: '', color: '#ff00ff' })
    setForm({ nameDa: '', nameEn: '', color: '#ff00ff' })
  }

  async function save() {
    if (!editing) return
    if (editing.id === 0) {
      await adminCreateCategory(form)
    } else {
      await adminUpdateCategory(editing.id, form)
    }
    setEditing(null)
    load()
  }

  async function remove(id: number) {
    if (!confirm('Slet denne ordklasse?')) return
    await adminDeleteCategory(id)
    load()
  }

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <h3>{t('admin.tabs.categories')}</h3>
        <button className="btn btn-success" onClick={startNew}>+ {t('admin.actions.add')}</button>
      </div>

      {editing && (
        <div className={styles.form}>
          <input className="input" placeholder={t('admin.category.nameDa')}
            value={form.nameDa} onChange={(e) => setForm({ ...form, nameDa: e.target.value })} />
          <input className="input" placeholder={t('admin.category.nameEn')}
            value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} />
          <div className={styles.colorRow}>
            {COLORS.map((c) => (
              <button key={c} className={`${styles.colorSwatch} ${form.color === c ? styles.colorActive : ''}`}
                style={{ background: c }} onClick={() => setForm({ ...form, color: c })} />
            ))}
          </div>
          <div className={styles.formActions}>
            <button className="btn btn-primary" onClick={save}>{t('admin.actions.save')}</button>
            <button className="btn btn-secondary" onClick={() => setEditing(null)}>{t('admin.actions.cancel')}</button>
          </div>
        </div>
      )}

      <table className={styles.table}>
        <thead>
          <tr><th>Dansk</th><th>English</th><th>Farve</th><th></th></tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.nameDa}</td>
              <td>{cat.nameEn}</td>
              <td><span className={styles.colorDot} style={{ background: cat.color }} /></td>
              <td className={styles.actions}>
                <button className="btn btn-secondary" onClick={() => startEdit(cat)}>{t('admin.actions.edit')}</button>
                <button className="btn btn-danger" onClick={() => remove(cat.id)}>{t('admin.actions.delete')}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
