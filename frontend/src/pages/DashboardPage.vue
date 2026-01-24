<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
    <!-- Loading state -->
    <p v-if="loading" class="text-gray-600 dark:text-gray-400">
      {{ t('common.loading') }}
    </p>

    <!-- Error state -->
    <p v-else-if="error" class="text-red-500">
      {{ error }}
    </p>

    <!-- Dashboard content -->
    <template v-else-if="dashboard">
      <!-- User Profile Header -->
      <UserProfileCard
        :user="dashboard.user"
        :next-deadline="dashboard.next_deadline"
      />

      <!-- Top Stats Grid (4 cards) -->
      <StatsGridTop
        :stats="dashboard.stats"
        :league-ranking="dashboard.league_ranking"
        :current-user-id="dashboard.user.id"
        :lineup="dashboard.lineup"
        :squad-value-history="dashboard.squad_value_history"
        :league-value-comparison="dashboard.league_value_comparison"
        :cash-data="dashboard.cash_data"
        :next-matchday="dashboard.next_deadline.matchday"
        :matchday-data="dashboard.matchday_data"
      />

      <!-- Performance Chart -->
      <PerformanceChart :history="dashboard.performance_history" />

      <!-- Bottom Stats Grid (3 cards) -->
      <StatsGridBottom :stats="dashboard.stats" />

      <!-- Player Value Section -->
      <PlayerValueSection
        :best-players="dashboard.best_value_players"
        :worst-players="dashboard.worst_value_players"
      />

      <!-- Lineup Section -->
      <LineupSection :lineup="dashboard.lineup" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuth } from '@/composables/useAuth'
import { useLoading } from '@/composables/useLoading'
import type { DashboardResponse } from '@/types/dashboard'

// Components
import UserProfileCard from '@/components/dashboard/UserProfileCard.vue'
import StatsGridTop from '@/components/dashboard/StatsGridTop.vue'
import StatsGridBottom from '@/components/dashboard/StatsGridBottom.vue'
import PerformanceChart from '@/components/dashboard/PerformanceChart.vue'
import PlayerValueSection from '@/components/dashboard/PlayerValueSection.vue'
import LineupSection from '@/components/dashboard/lineup/LineupSection.vue'

// Mock data (will be replaced with API call)
import { mockDashboardData } from '@/mocks/dashboardMock'

const { t } = useI18n()
const { token, currentLeague } = useAuth()
const { withLoading } = useLoading()

const dashboard = ref<DashboardResponse | null>(null)
const loading = ref(true)
const error = ref('')

async function loadDashboard() {
  if (!token.value || !currentLeague.value?.id) return

  loading.value = true
  error.value = ''

  try {
    // TODO: Replace with real API call
    // dashboard.value = await getDashboard({
    //   leagueId: currentLeague.value.id,
    //   token: token.value,
    // })

    // Using mock data for now
    await new Promise(resolve => setTimeout(resolve, 300)) // Simulate network delay
    dashboard.value = mockDashboardData
  } catch (e) {
    error.value = 'Failed to load dashboard'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDashboard()
})

// Reload data when league changes
watch(() => currentLeague.value?.id, async (newId, oldId) => {
  if (newId && newId !== oldId) {
    await withLoading(() => loadDashboard(), 'Switching league...')
  }
})
</script>
