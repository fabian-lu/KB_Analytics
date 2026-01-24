import type { Directive } from 'vue'

/**
 * Directive that shows scrollbar only while scrolling.
 * Usage: v-scrollbar-autohide
 *
 * The element must have the 'scrollbar-autohide' CSS class.
 */
export const vScrollbarAutohide: Directive = {
  mounted(el: HTMLElement) {
    let timeout: number | null = null

    const onScroll = () => {
      el.classList.add('is-scrolling')

      if (timeout) {
        clearTimeout(timeout)
      }

      timeout = window.setTimeout(() => {
        el.classList.remove('is-scrolling')
      }, 1000) // Hide after 1 second of no scrolling
    }

    el.addEventListener('scroll', onScroll, { passive: true })

    // Store cleanup function on element
    ;(el as any)._scrollbarCleanup = () => {
      el.removeEventListener('scroll', onScroll)
      if (timeout) clearTimeout(timeout)
    }
  },

  unmounted(el: HTMLElement) {
    const cleanup = (el as any)._scrollbarCleanup
    if (cleanup) cleanup()
  },
}
