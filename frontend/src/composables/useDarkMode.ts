import { ref, watch } from 'vue'

// Check initial preference: localStorage > system preference > default light
function getInitialMode(): boolean {
  const stored = localStorage.getItem('darkMode')
  if (stored !== null) {
    return stored === 'true'
  }
  // Check system preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

// Shared state (outside function so it's singleton)
const isDark = ref(getInitialMode())

// Apply class to <html> element
function applyDarkMode(dark: boolean) {
  if (dark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Apply on load
applyDarkMode(isDark.value)

export function useDarkMode() {
  // Watch for changes and persist
  watch(isDark, (newValue) => {
    localStorage.setItem('darkMode', String(newValue))
    applyDarkMode(newValue)
  })

  function toggle() {
    isDark.value = !isDark.value
  }

  return {
    isDark,
    toggle,
  }
}
