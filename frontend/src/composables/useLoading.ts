import { ref } from 'vue'

// Module-level state (singleton)
const isLoading = ref(false)
const loadingMessage = ref('')

export function useLoading() {
  function start(message = '') {
    loadingMessage.value = message
    isLoading.value = true
  }

  function stop() {
    isLoading.value = false
    loadingMessage.value = ''
  }

  /**
   * Wraps an async function with loading state.
   * Automatically starts loading before and stops after (even on error).
   */
  async function withLoading<T>(fn: () => Promise<T>, message = ''): Promise<T> {
    start(message)
    try {
      return await fn()
    } finally {
      stop()
    }
  }

  return {
    isLoading,
    loadingMessage,
    start,
    stop,
    withLoading,
  }
}
