import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Category, Word,
  adminGetCategories, adminGetWords,
  adminCreateWord, adminUpdateWord, adminDeleteWord,
} from '../../api/client'
import styles from './AdminPanel.module.css'

export default function AdminWords() {
  const { t } = useTranslation()
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCat, setSelectedCat] = useState<number | null>(null)
  const [words, setWords] = useState<Word[]>([])
  const [editing, setEditing] = useState<Word | null>(null)
  const [form, setForm] = useState({ text: '', categoryId: 0 })

  useEffect(() => {
    adminGetCategories().then((r) => {
      setCategories(r.data)
      if (r.data.length > 0) setSelectedCat(r.data[0].id)
    })
  }, [])

  useEffect(() => {
    if (selectedCat) {
      adminGetWords(selectedCat).then((r) => setWords(r.data))
    }
  }, [selectedCat])

  async function save() {
    if (!editing) return
    if (editing.id === 0) {
      await adminCreateWord(form)
    } else {
      await adminUpdateWord(editing.id, form)
    }
    setEditing(null)
    if (selectedCat) adminGetWords(selectedCat).then((r) => setWords(r.data))
  }

  async function remove(id: number) {
    if (!confirm('Slet dette ord?')) return
    await adminDeleteWord(id)
    if (selectedCat) adminGetWords(selectedCat).then((r) => setWords(r.data))
  }

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.catFilter}>
          {categories.map((c) => (
            <button key={c.id}
              className={`btn ${selectedCat === c.id ? 'btn-primary' : 'btn-secondary'} ${styles.filterBtn}`}
              onClick={() => setSelectedCat(c.id)}>
              {c.nameDa}
            </button>
          ))}
        </div>
        <button className="btn btn-success" onClick={() => {
          setEditing({ id: 0, text: '', categoryId: selectedCat ?? categories[0]?.id })
          setForm({ text: '', categoryId: selectedCat ?? categories[0]?.id })
        }}>+ {t('admin.actions.add')}</button>
      </div>

      {editing && (
        <div className={styles.form}>
          <input className="input" placeholder={t('admin.word.text')}
            value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} />
          <select className="input" value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.nameDa}</option>)}
          </select>
          <div className={styles.formActions}>
            <button className="btn btn-primary" onClick={save}>{t('admin.actions.save')}</button>
            <button className="btn btn-secondary" onClick={() => setEditing(null)}>{t('admin.actions.cancel')}</button>
          </div>
        </div>
      )}

      <table className={styles.table}>
        <thead><tr><th>Ord</th><th>Ordklasse</th><th></th></tr></thead>
        <tbody>
          {words.map((w) => (
            <tr key={w.id}>
              <td>{w.text}</td>
              <td>{categories.find((c) => c.id === w.categoryId)?.nameDa}</td>
              <td className={styles.actions}>
                <button className="btn btn-secondary" onClick={() => {
                  setEditing(w); setForm({ text: w.text, categoryId: w.categoryId })
                }}>{t('admin.actions.edit')}</button>
                <button className="btn btn-danger" onClick={() => remove(w.id)}>{t('admin.actions.delete')}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
