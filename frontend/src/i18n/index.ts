import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import da from './da.json'
import en from './en.json'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      da: { translation: da },
      en: { translation: en },
    },
    lng: localStorage.getItem('lang') || 'da',
    fallbackLng: 'da',
    interpolation: { escapeValue: false },
  })

export default i18n
