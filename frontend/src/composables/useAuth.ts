/**
 * Auth composable - manages authentication state.
 *
 * Usage:
 *   const { isLoggedIn, user, token, leagues, logout } = useAuth()
 */

import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { User, League } from '@/types'
import { useLoading } from '@/composables/useLoading'

// Shared state (outside function so it's the same for all components)
const token = ref<string | null>(localStorage.getItem('token'))
const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'))
const leagues = ref<League[]>(JSON.parse(localStorage.getItem('leagues') || '[]'))
const currentLeague = ref<League | null>(JSON.parse(localStorage.getItem('currentLeague') || 'null'))

export function useAuth() {
  const router = useRouter()
  const { start, stop } = useLoading()

  // Computed - require both token AND a selected league
  const isLoggedIn = computed(() => !!token.value && !!currentLeague.value)

  // Methods
  function setAuth(data: { token: string; user: User; leagues: League[] }) {
    token.value = data.token
    user.value = data.user
    leagues.value = data.leagues

    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('leagues', JSON.stringify(data.leagues))
  }

  function setCurrentLeague(league: League) {
    currentLeague.value = league
    localStorage.setItem('currentLeague', JSON.stringify(league))
  }

  async function logout() {
    start('Logging out...')

    token.value = null
    user.value = null
    leagues.value = []
    currentLeague.value = null

    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('leagues')
    localStorage.removeItem('currentLeague')

    await router.push('/')
    stop()
  }

  return {
    token,
    user,
    leagues,
    currentLeague,
    isLoggedIn,
    setAuth,
    setCurrentLeague,
    logout,
  }
}
