<template>
  <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
    <!-- Header with selectors -->
    <div class="p-4 border-b border-gray-100 dark:border-gray-800">
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        {{ t('managers.leagueComparison.title') }}
      </h3>

      <div class="flex flex-col sm:flex-row gap-2">
        <!-- Squad type selector -->
        <div class="flex rounded-lg bg-gray-100 dark:bg-gray-800 p-0.5">
          <button
            v-for="option in squadOptions"
            :key="option.value"
            class="px-2.5 py-1 text-xs font-medium rounded-md transition-colors"
            :class="selectedSquad === option.value
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
            @click="selectedSquad = option.value"
          >
            {{ option.label }}
          </button>
        </div>

        <!-- Metric selector -->
        <div class="flex rounded-lg bg-gray-100 dark:bg-gray-800 p-0.5">
          <button
            v-for="metric in metricOptions"
            :key="metric.value"
            class="px-2.5 py-1 text-xs font-medium rounded-md transition-colors"
            :class="selectedMetric === metric.value
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
            @click="selectedMetric = metric.value"
          >
            {{ metric.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Comparison bars -->
    <div class="p-4 space-y-3 max-h-80 overflow-y-auto">
      <div
        v-for="item in sortedComparison"
        :key="item.profile.manager.id"
        class="group"
      >
        <!-- Manager info row -->
        <div class="flex items-center gap-2 mb-1">
          <img
            :src="item.profile.manager.profile_image"
            :alt="item.profile.manager.name"
            class="w-6 h-6 rounded-full object-cover"
            :class="isSelected(item.profile.manager.id) ? 'ring-2 ring-cyan-500' : ''"
          />
          <span
            class="text-xs font-medium flex-1 truncate"
            :class="isSelected(item.profile.manager.id)
              ? 'text-cyan-700 dark:text-cyan-300'
              : 'text-gray-700 dark:text-gray-300'"
          >
            {{ item.profile.manager.name }}
          </span>
          <span class="text-xs font-semibold text-gray-900 dark:text-white">
            {{ formatValue(item.value) }}
          </span>
        </div>

        <!-- Bar -->
        <div class="relative h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            class="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
            :class="isSelected(item.profile.manager.id)
              ? 'bg-cyan-500'
              : 'bg-gray-300 dark:bg-gray-600 group-hover:bg-gray-400 dark:group-hover:bg-gray-500'"
            :style="{ width: `${item.barWidth}%` }"
          />
        </div>

        <!-- Player count -->
        <div class="text-[10px] text-gray-400 mt-0.5">
          {{ item.playerCount }} {{ t('managers.leagueComparison.players') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ManagerProfile } from '@/types/league'
import type { PlayerSummary } from '@/types/dashboard'

const props = defineProps<{
  allProfiles: ManagerProfile[]
  selectedId: string
}>()

const { t } = useI18n()

type SquadOption = 'starting' | 'bench' | 'total'
type MetricOption = 'avgPoints' | 'totalPoints' | 'totalValue' | 'efficiency'

const selectedSquad = ref<SquadOption>('total')
const selectedMetric = ref<MetricOption>('avgPoints')

const squadOptions = computed(() => [
  { value: 'starting' as const, label: t('managers.leagueComparison.startingXI') },
  { value: 'bench' as const, label: t('managers.leagueComparison.bench') },
  { value: 'total' as const, label: t('managers.leagueComparison.total') },
])

const metricOptions = computed(() => [
  { value: 'avgPoints' as const, label: t('managers.leagueComparison.avgPts') },
  { value: 'totalPoints' as const, label: t('managers.leagueComparison.totalPts') },
  { value: 'totalValue' as const, label: t('managers.leagueComparison.value') },
  { value: 'efficiency' as const, label: t('managers.leagueComparison.efficiency') },
])

interface ComparisonItem {
  profile: ManagerProfile
  value: number
  barWidth: number
  playerCount: number
}

function getPlayers(profile: ManagerProfile): PlayerSummary[] {
  switch (selectedSquad.value) {
    case 'starting':
      return profile.lineup.starting
    case 'bench':
      return profile.lineup.bench
    case 'total':
      return [...profile.lineup.starting, ...profile.lineup.bench]
  }
}

function getMetricValue(players: PlayerSummary[]): number {
  if (players.length === 0) return 0

  const totalPoints = players.reduce((s, p) => s + p.total_points, 0)
  const totalValue = players.reduce((s, p) => s + p.market_value, 0)

  switch (selectedMetric.value) {
    case 'avgPoints':
      return totalPoints / players.length
    case 'totalPoints':
      return totalPoints
    case 'totalValue':
      return totalValue
    case 'efficiency':
      return totalValue > 0 ? totalPoints / (totalValue / 1_000_000) : 0
  }
}

const sortedComparison = computed<ComparisonItem[]>(() => {
  const items = props.allProfiles.map(profile => {
    const players = getPlayers(profile)
    return {
      profile,
      value: getMetricValue(players),
      barWidth: 0,
      playerCount: players.length,
    }
  })

  // Sort by value descending
  items.sort((a, b) => b.value - a.value)

  // Calculate bar widths
  const maxValue = Math.max(...items.map(i => i.value), 1)
  for (const item of items) {
    item.barWidth = Math.round((item.value / maxValue) * 100)
  }

  return items
})

function isSelected(id: string): boolean {
  return props.selectedId === id
}

function formatValue(value: number): string {
  if (selectedMetric.value === 'totalValue') {
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`
    }
    return `${(value / 1000).toFixed(0)}K`
  }
  if (selectedMetric.value === 'totalPoints') {
    return value.toLocaleString()
  }
  return value.toFixed(1)
}
</script>
