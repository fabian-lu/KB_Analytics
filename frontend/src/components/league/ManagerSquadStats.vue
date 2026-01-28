<template>
  <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
    <!-- Header with selector -->
    <div class="p-4 border-b border-gray-100 dark:border-gray-800">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
          {{ t('managers.squadStats.title') }}
        </h3>

        <!-- Squad selector -->
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
      </div>
    </div>

    <!-- Stats grid -->
    <div class="p-4">
      <div class="grid grid-cols-2 gap-3">
        <div class="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
          <p class="text-xl font-bold text-gray-900 dark:text-white">
            {{ currentStats.count }}
          </p>
          <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
            {{ t('managers.squadStats.players') }}
          </p>
        </div>

        <div class="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
          <p class="text-xl font-bold text-gray-900 dark:text-white">
            {{ formatMoney(currentStats.totalValue) }}
          </p>
          <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
            {{ t('managers.squadStats.totalValue') }}
          </p>
        </div>

        <div class="text-center p-3 rounded-lg bg-cyan-50 dark:bg-cyan-900/20">
          <p class="text-xl font-bold text-cyan-600 dark:text-cyan-400">
            {{ currentStats.totalPoints.toLocaleString() }}
          </p>
          <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
            {{ t('managers.squadStats.totalPoints') }}
          </p>
        </div>

        <div class="text-center p-3 rounded-lg bg-cyan-50 dark:bg-cyan-900/20">
          <p class="text-xl font-bold text-cyan-600 dark:text-cyan-400">
            {{ currentStats.avgPoints.toFixed(1) }}
          </p>
          <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
            {{ t('managers.squadStats.avgPoints') }}
          </p>
        </div>

        <div class="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
          <p class="text-xl font-bold text-gray-900 dark:text-white">
            {{ currentStats.avgValue }}
          </p>
          <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
            {{ t('managers.squadStats.avgValue') }}
          </p>
        </div>

        <div class="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
          <p class="text-xl font-bold text-gray-900 dark:text-white">
            {{ currentStats.efficiency.toFixed(1) }}
          </p>
          <p class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
            {{ t('managers.squadStats.efficiency') }}
          </p>
        </div>
      </div>

      <!-- Position breakdown -->
      <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">
          {{ t('managers.squadStats.byPosition') }}
        </p>
        <div class="flex gap-2">
          <div
            v-for="pos in positionBreakdown"
            :key="pos.label"
            class="flex-1 text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
          >
            <p class="text-xs font-bold text-gray-900 dark:text-white">{{ pos.count }}</p>
            <p class="text-[10px] text-gray-500 dark:text-gray-400">{{ pos.label }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { PlayerSummary } from '@/types/dashboard'

const props = defineProps<{
  starting: PlayerSummary[]
  bench: PlayerSummary[]
}>()

const { t } = useI18n()

type SquadOption = 'starting' | 'bench' | 'total'
const selectedSquad = ref<SquadOption>('starting')

const squadOptions = computed(() => [
  { value: 'starting' as const, label: t('managers.squadStats.startingXI') },
  { value: 'bench' as const, label: t('managers.squadStats.bench') },
  { value: 'total' as const, label: t('managers.squadStats.total') },
])

const currentPlayers = computed<PlayerSummary[]>(() => {
  switch (selectedSquad.value) {
    case 'starting':
      return props.starting
    case 'bench':
      return props.bench
    case 'total':
      return [...props.starting, ...props.bench]
  }
})

interface SquadStats {
  count: number
  totalPoints: number
  avgPoints: number
  totalValue: number
  avgValue: string
  efficiency: number
}

const currentStats = computed<SquadStats>(() => {
  const players = currentPlayers.value
  const count = players.length
  const totalPoints = players.reduce((s, p) => s + p.total_points, 0)
  const avgPoints = count > 0 ? totalPoints / count : 0
  const totalValue = players.reduce((s, p) => s + p.market_value, 0)
  const avgValue = count > 0 ? formatMoney(totalValue / count) : '0'
  const efficiency = totalValue > 0 ? totalPoints / (totalValue / 1_000_000) : 0

  return { count, totalPoints, avgPoints, totalValue, avgValue, efficiency }
})

const positionBreakdown = computed(() => {
  const players = currentPlayers.value
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 }
  for (const p of players) {
    counts[p.position] = (counts[p.position] || 0) + 1
  }
  return [
    { label: 'GK', count: counts[1] },
    { label: 'DEF', count: counts[2] },
    { label: 'MID', count: counts[3] },
    { label: 'FWD', count: counts[4] },
  ]
})

function formatMoney(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`
  }
  if (value >= 1_000) {
    return `${(value / 1000).toFixed(0)}K`
  }
  return value.toFixed(0)
}
</script>
