import { useI18n } from 'vue-i18n'

export type Locale = 'en' | 'de'

export function useLanguage() {
  const { locale } = useI18n()

  function setLocale(newLocale: Locale) {
    locale.value = newLocale
    localStorage.setItem('locale', newLocale)
  }

  function toggle() {
    const newLocale = locale.value === 'en' ? 'de' : 'en'
    setLocale(newLocale)
  }

  return {
    locale,
    setLocale,
    toggle,
  }
}
