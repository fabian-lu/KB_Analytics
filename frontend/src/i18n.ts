import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import de from './locales/de.json'

// Get initial locale (same logic as useLanguage)
function getInitialLocale(): 'en' | 'de' {
  const stored = localStorage.getItem('locale')
  if (stored === 'en' || stored === 'de') {
    return stored
  }
  const browserLang = navigator.language.split('-')[0]
  if (browserLang === 'de') {
    return 'de'
  }
  return 'en'
}

const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: getInitialLocale(),
  fallbackLocale: 'en',
  messages: {
    en,
    de,
  },
})

export default i18n
