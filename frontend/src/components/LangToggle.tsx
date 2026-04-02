import { useTranslation } from 'react-i18next'
import styles from './LangToggle.module.css'

interface Props {
  className?: string
}

export default function LangToggle({ className }: Props) {
  const { t, i18n } = useTranslation()

  function toggle() {
    const next = i18n.language === 'da' ? 'en' : 'da'
    i18n.changeLanguage(next)
    localStorage.setItem('lang', next)
  }

  return (
    <button className={`btn btn-secondary ${styles.toggle} ${className || ''}`} onClick={toggle}>
      {t('lang.toggle')}
    </button>
  )
}
