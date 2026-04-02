import { useTranslation } from 'react-i18next'
import { Category } from '../api/client'
import styles from './CategorySelector.module.css'

interface Props {
  categories: Category[]
  selected: number[]
  onChange: (ids: number[]) => void
}

export default function CategorySelector({ categories, selected, onChange }: Props) {
  const { i18n } = useTranslation()
  const isDa = i18n.language === 'da'

  function toggle(id: number) {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id))
    } else {
      onChange([...selected, id])
    }
  }

  return (
    <div className={styles.grid}>
      {categories.map((cat) => {
        const active = selected.includes(cat.id)
        return (
          <button
            key={cat.id}
            className={`${styles.chip} ${active ? styles.active : ''}`}
            style={{ '--cat-color': cat.color } as React.CSSProperties}
            onClick={() => toggle(cat.id)}
          >
            {isDa ? cat.nameDa : cat.nameEn}
            {active && <span className={styles.check}>✓</span>}
          </button>
        )
      })}
    </div>
  )
}
