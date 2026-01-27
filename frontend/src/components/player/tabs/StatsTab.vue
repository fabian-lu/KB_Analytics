<template>
  <div class="space-y-6">
    <!-- Season Selector -->
    <div class="flex gap-2 overflow-x-auto pb-2">
      <button
        v-for="season in availableSeasons"
        :key="season"
        @click="selectedSeason = season"
        class="flex-shrink-0 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
        :class="selectedSeason === season
          ? 'bg-cyan-500 text-white'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'"
      >
        {{ season }}
      </button>
    </div>

    <!-- Performance Chart -->
    <div>
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        {{ t('player.performanceChart') }}
      </h3>
      <div class="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-4">
        <div class="h-48 overflow-x-auto">
          <div class="min-w-[600px] h-full">
            <Bar :data="chartData" :options="chartOptions" />
          </div>
        </div>
      </div>
    </div>

    <!-- Season Stats -->
    <div>
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        {{ t('player.seasonStats') }}
      </h3>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatBox :label="t('player.totalPoints')" :value="seasonStats?.total_points || 0" variant="info" />
        <StatBox :label="t('player.avgPoints')" :value="(seasonStats?.avg_points || 0).toFixed(1)" />
        <StatBox :label="t('player.goals')" :value="seasonStats?.goals || 0" :variant="(seasonStats?.goals || 0) > 5 ? 'success' : 'default'" />
        <StatBox :label="t('player.assists')" :value="seasonStats?.assists || 0" />
      </div>
    </div>

    <!-- Games & Minutes -->
    <div>
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        {{ t('player.appearances') }}
      </h3>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatBox
          :label="t('player.gamesPlayed')"
          :value="`${seasonStats?.games_played || 0}/${seasonStats?.games_total || 0}`"
        />
        <StatBox :label="t('player.starts')" :value="seasonStats?.starting_appearances || 0" />
        <StatBox :label="t('player.avgMinutes')" :value="`${seasonStats?.avg_minutes || 0}'`" />
        <StatBox :label="t('player.pointsPer90')" :value="pointsPer90.toFixed(1)" variant="info" />
      </div>
    </div>

    <!-- Cards -->
    <div>
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        {{ t('player.discipline') }}
      </h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <StatBox :label="t('player.yellowCards')" :value="seasonStats?.yellow_cards || 0" :variant="(seasonStats?.yellow_cards || 0) > 4 ? 'warning' : 'default'" />
        <StatBox :label="t('player.redCards')" :value="seasonStats?.red_cards || 0" :variant="(seasonStats?.red_cards || 0) > 0 ? 'danger' : 'default'" />
        <StatBox v-if="player.position <= 2" :label="t('player.cleanSheets')" :value="seasonStats?.clean_sheets || 0" :variant="(seasonStats?.clean_sheets || 0) > 5 ? 'success' : 'default'" />
      </div>
    </div>

    <!-- Home vs Away -->
    <div>
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        {{ t('player.homeVsAway') }}
      </h3>
      <div class="grid grid-cols-2 gap-4">
        <!-- Home -->
        <div class="rounded-xl p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <p class="text-xs text-green-600 dark:text-green-400 uppercase font-medium mb-2">{{ t('player.home') }}</p>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-xs text-gray-600 dark:text-gray-400">{{ t('player.games') }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ player.home_stats.games }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-xs text-gray-600 dark:text-gray-400">{{ t('player.avgPoints') }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ player.home_stats.avg_points.toFixed(1) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-xs text-gray-600 dark:text-gray-400">{{ t('player.goals') }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ player.home_stats.goals }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-xs text-gray-600 dark:text-gray-400">{{ t('player.assists') }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ player.home_stats.assists }}</span>
            </div>
          </div>
        </div>

        <!-- Away -->
        <div class="rounded-xl p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p class="text-xs text-blue-600 dark:text-blue-400 uppercase font-medium mb-2">{{ t('player.away') }}</p>
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-xs text-gray-600 dark:text-gray-400">{{ t('player.games') }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ player.away_stats.games }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-xs text-gray-600 dark:text-gray-400">{{ t('player.avgPoints') }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ player.away_stats.avg_points.toFixed(1) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-xs text-gray-600 dark:text-gray-400">{{ t('player.goals') }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ player.away_stats.goals }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-xs text-gray-600 dark:text-gray-400">{{ t('player.assists') }}</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">{{ player.away_stats.assists }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Comparison bar -->
      <div class="mt-3 flex items-center gap-2">
        <span class="text-xs text-gray-500 dark:text-gray-400 w-12">{{ t('player.home') }}</span>
        <div class="flex-1 h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex">
          <div
            class="h-full bg-green-500"
            :style="{ width: `${homePercentage}%` }"
          />
          <div
            class="h-full bg-blue-500"
            :style="{ width: `${100 - homePercentage}%` }"
          />
        </div>
        <span class="text-xs text-gray-500 dark:text-gray-400 w-12 text-right">{{ t('player.away') }}</span>
      </div>
    </div>

    <!-- Win / Draw / Loss Impact -->
    <div>
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        {{ t('player.resultImpact') }}
      </h3>
      <div class="grid grid-cols-3 gap-3">
        <!-- Win -->
        <div class="rounded-xl p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-center">
          <p class="text-xs text-emerald-600 dark:text-emerald-400 uppercase font-medium mb-1">{{ t('player.win') }}</p>
          <p class="text-xl font-bold text-gray-900 dark:text-white">{{ player.result_sensitivity.avg_points_win.toFixed(1) }}</p>
          <p class="text-[10px] text-gray-500 dark:text-gray-400">{{ player.result_sensitivity.games_won }} {{ t('player.games') }}</p>
        </div>
        <!-- Draw -->
        <div class="rounded-xl p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-center">
          <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium mb-1">{{ t('player.draw') }}</p>
          <p class="text-xl font-bold text-gray-900 dark:text-white">{{ player.result_sensitivity.avg_points_draw.toFixed(1) }}</p>
          <p class="text-[10px] text-gray-500 dark:text-gray-400">{{ player.result_sensitivity.games_drawn }} {{ t('player.games') }}</p>
        </div>
        <!-- Loss -->
        <div class="rounded-xl p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-center">
          <p class="text-xs text-red-500 dark:text-red-400 uppercase font-medium mb-1">{{ t('player.loss') }}</p>
          <p class="text-xl font-bold text-gray-900 dark:text-white">{{ player.result_sensitivity.avg_points_loss.toFixed(1) }}</p>
          <p class="text-[10px] text-gray-500 dark:text-gray-400">{{ player.result_sensitivity.games_lost }} {{ t('player.games') }}</p>
        </div>
      </div>

      <!-- Sensitivity bar -->
      <div class="mt-3 rounded-xl p-3 bg-gray-50 dark:bg-gray-800/50">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-xs text-gray-500 dark:text-gray-400">{{ t('player.resultSensitivity') }}</span>
          <span class="text-sm font-semibold" :class="sensitivityColor">{{ player.result_sensitivity.sensitivity }}%</span>
        </div>
        <div class="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <div
            class="h-full rounded-full transition-all"
            :class="sensitivityBarColor"
            :style="{ width: `${Math.min(100, player.result_sensitivity.sensitivity)}%` }"
          />
        </div>
        <p class="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5">
          {{ t('player.resultSensitivityExplanation') }}
        </p>
      </div>
    </div>

    <!-- Raw Points -->
    <div>
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        {{ t('player.rawPoints') }}
      </h3>
      <div class="rounded-xl p-4 bg-gray-50 dark:bg-gray-800/50">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ player.raw_points_avg.toFixed(1) }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('player.avgPerMatchday') }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ t('player.vsTotal') }}</p>
            <p class="text-lg font-medium text-gray-900 dark:text-white">{{ player.current_season.avg_points.toFixed(1) }}</p>
          </div>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {{ t('player.rawPointsExplanation') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js'
import { Bar } from 'vue-chartjs'
import StatBox from '../shared/StatBox.vue'
import type { PlayerDetail } from '@/types/player'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

const props = defineProps<{
  player: PlayerDetail
}>()

const { t } = useI18n()

const availableSeasons = computed(() =>
  props.player.performance_history.map(s => s.season)
)

const selectedSeason = ref(availableSeasons.value[0] || '')

const selectedSeasonData = computed(() =>
  props.player.performance_history.find(s => s.season === selectedSeason.value)
)

const seasonStats = computed(() => {
  if (selectedSeason.value === props.player.current_season.season) {
    return props.player.current_season
  }
  // Calculate from matchday data for historical seasons
  const data = selectedSeasonData.value
  if (!data) return null

  const matchdays = data.matchdays
  const gamesPlayed = matchdays.filter(m => m.minutes_played > 0).length
  const totalPoints = matchdays.reduce((sum, m) => sum + m.points, 0)
  const totalMinutes = matchdays.reduce((sum, m) => sum + m.minutes_played, 0)

  return {
    season: data.season,
    games_played: gamesPlayed,
    games_total: matchdays.length,
    starting_appearances: matchdays.filter(m => m.was_starter).length,
    avg_minutes: gamesPlayed > 0 ? Math.round(totalMinutes / gamesPlayed) : 0,
    total_points: totalPoints,
    avg_points: gamesPlayed > 0 ? totalPoints / gamesPlayed : 0,
    goals: matchdays.reduce((sum, m) => sum + m.goals, 0),
    assists: matchdays.reduce((sum, m) => sum + m.assists, 0),
    yellow_cards: matchdays.reduce((sum, m) => sum + m.yellow_cards, 0),
    red_cards: matchdays.reduce((sum, m) => sum + m.red_cards, 0),
    clean_sheets: 0, // Not tracked per matchday in mock
  }
})

const pointsPer90 = computed(() => {
  if (!seasonStats.value) return 0
  const totalMinutes = seasonStats.value.avg_minutes * seasonStats.value.games_played
  if (totalMinutes === 0) return 0
  return (seasonStats.value.total_points / totalMinutes) * 90
})

const sensitivityColor = computed(() => {
  const s = props.player.result_sensitivity.sensitivity
  if (s >= 60) return 'text-red-500'
  if (s >= 40) return 'text-amber-500'
  return 'text-emerald-500'
})

const sensitivityBarColor = computed(() => {
  const s = props.player.result_sensitivity.sensitivity
  if (s >= 60) return 'bg-red-500'
  if (s >= 40) return 'bg-amber-500'
  return 'bg-emerald-500'
})

const homePercentage = computed(() => {
  const total = props.player.home_stats.avg_points + props.player.away_stats.avg_points
  if (total === 0) return 50
  return (props.player.home_stats.avg_points / total) * 100
})

// Chart
const chartData = computed(() => {
  const data = selectedSeasonData.value
  if (!data) return { labels: [], datasets: [] }

  return {
    labels: data.matchdays.map(m => `MD${m.matchday}`),
    datasets: [
      {
        data: data.matchdays.map(m => m.points),
        backgroundColor: data.matchdays.map(m => {
          if (m.points >= 80) return 'rgba(34, 197, 94, 0.8)'
          if (m.points >= 50) return 'rgba(74, 222, 128, 0.8)'
          if (m.points >= 30) return 'rgba(251, 191, 36, 0.8)'
          if (m.points >= 15) return 'rgba(251, 146, 60, 0.8)'
          return 'rgba(248, 113, 113, 0.8)'
        }),
        borderRadius: 4,
        barThickness: 16,
      },
    ],
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      padding: 12,
      displayColors: false,
      callbacks: {
        title: (items: any[]) => `${t('dashboard.matchday')} ${items[0].label.replace('MD', '')}`,
        label: (context: any) => `${context.raw} ${t('player.points')}`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(156, 163, 175, 0.2)' },
      ticks: { color: 'rgb(156, 163, 175)' },
    },
    x: {
      grid: { display: false },
      ticks: {
        color: 'rgb(156, 163, 175)',
        maxRotation: 0,
      },
    },
  },
}))
</script>
