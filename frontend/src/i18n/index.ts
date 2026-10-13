import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import da from './da.json'
import en from './en.json'
import { useSettings } from '@/store/settingsStore'

i18n.use(initReactI18next).init({
  resources: { da: { translation: da }, en: { translation: en } },
  lng: useSettings.getState().lang,
  fallbackLng: 'da',
  interpolation: { escapeValue: false },
})

useSettings.subscribe((s) => {
  if (i18n.language !== s.lang) {
    void i18n.changeLanguage(s.lang)
    document.documentElement.lang = s.lang
  }
})

export default i18n
