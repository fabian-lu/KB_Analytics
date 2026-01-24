<template>
  <div class="min-h-screen bg-surface dark:bg-surface-dark">
    <!-- Header -->
    <PublicHeader @login-click="showLoginModal = true" />

    <!-- Main content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Hero section -->
      <section class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Kickbase Analytics
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Track your fantasy Bundesliga performance, analyze player values,
          and optimize your lineup with data-driven insights.
        </p>
      </section>

      <!-- Bundesliga Table -->
      <section class="bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Bundesliga Table 2024/25
          </h2>
        </div>

        <div v-if="loading" class="p-6 text-center text-gray-600 dark:text-gray-400">
          Loading...
        </div>

        <div v-else-if="error" class="p-6 text-center text-red-500">
          {{ error }}
        </div>

        <table v-else class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">#</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Team</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">P</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">W</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">D</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">L</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">GD</th>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Pts</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
            <tr
              v-for="team in standings"
              :key="team.position"
              class="hover:bg-gray-50 dark:hover:bg-gray-800/30"
            >
              <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">{{ team.position }}</td>
              <td class="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">{{ team.team_name }}</td>
              <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 text-center">{{ team.matches }}</td>
              <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 text-center">{{ team.won }}</td>
              <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 text-center">{{ team.draw }}</td>
              <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 text-center">{{ team.lost }}</td>
              <td class="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 text-center">{{ team.goal_diff }}</td>
              <td class="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white text-center">{{ team.points }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>

    <!-- Login Modal (placeholder for now) -->
    <div v-if="showLoginModal" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/50"
        @click="showLoginModal = false"
      />

      <!-- Modal -->
      <div class="relative bg-white dark:bg-card-dark rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
        <!-- Step 1: Credentials -->
        <template v-if="loginStep === 'credentials'">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Login</h2>

          <form @submit.prevent="handleLogin">
            <div class="mb-4">
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                autocomplete="email"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-surface-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
              >
            </div>

            <div class="mb-6">
              <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                v-model="password"
                type="password"
                required
                autocomplete="current-password"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-surface-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
              >
            </div>

            <p v-if="loginError" class="mb-4 text-sm text-red-500">
              {{ loginError }}
            </p>

            <button
              type="submit"
              class="w-full py-2 px-4 rounded-lg bg-accent text-white font-medium hover:bg-accent-dark transition-colors"
            >
              Login
            </button>
          </form>
        </template>

        <!-- Step 2: League Selection -->
        <template v-else-if="loginStep === 'league-select'">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Select League</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Choose which league you want to view:
          </p>

          <div class="space-y-2">
            <button
              v-for="league in leagues"
              :key="league.id"
              @click="selectLeague(league)"
              class="w-full p-4 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:border-accent hover:bg-accent/5 transition-colors"
            >
              <span class="font-medium text-gray-900 dark:text-white">{{ league.name }}</span>
            </button>
          </div>
        </template>

        <!-- Close button -->
        <button
          @click="showLoginModal = false; loginStep = 'credentials'"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getTable, login } from '@/api'
import { useAuth } from '@/composables/useAuth'
import { useLoading } from '@/composables/useLoading'
import PublicHeader from '@/components/layout/PublicHeader.vue'
import type { TeamStanding } from '@/types'

const router = useRouter()
const { setAuth, setCurrentLeague, leagues } = useAuth()
const { withLoading } = useLoading()

// Modal state
const showLoginModal = ref(false)
const loginStep = ref<'credentials' | 'league-select'>('credentials')

// Table state
const standings = ref<TeamStanding[]>([])
const loading = ref(true)
const error = ref('')

// Login state
const email = ref('')
const password = ref('')
const loginError = ref('')

onMounted(async () => {
  try {
    const data = await getTable({ season: '2024' })
    standings.value = data.standings
  } catch (e) {
    error.value = 'Failed to load table'
  } finally {
    loading.value = false
  }
})

async function handleLogin() {
  loginError.value = ''

  try {
    const data = await withLoading(
      () => login({ email: email.value, password: password.value }),
      'Logging in...'
    )

    // Store auth data
    setAuth({
      token: data.token,
      user: data.user,
      leagues: data.leagues,
    })

    // If only one league, select it and go to dashboard
    if (data.leagues.length === 1) {
      setCurrentLeague(data.leagues[0])
      showLoginModal.value = false
      await router.push('/dashboard')
    } else {
      // Show league selection
      loginStep.value = 'league-select'
    }
  } catch (e) {
    loginError.value = 'Login failed. Check your credentials.'
  }
}

async function selectLeague(league: typeof leagues.value[0]) {
  setCurrentLeague(league)
  showLoginModal.value = false
  loginStep.value = 'credentials' // Reset for next time
  await router.push('/dashboard')
}
</script>
