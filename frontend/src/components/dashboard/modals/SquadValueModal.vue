<template>
  <BaseModal :open="open" :title="t('dashboard.squadValue')" size="lg" @close="$emit('close')">
    <div v-scrollbar-autohide class="space-y-6 max-h-[70vh] overflow-y-auto scrollbar-autohide">
      <!-- Value Breakdown: Total / Starting / Bench -->
      <div class="grid grid-cols-3 gap-2 sm:gap-4">
        <div class="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 text-center">
          <p class="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">
            {{ t('squadValue.total') }}
          </p>
          <p class="text-sm sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
            {{ formatMoney(totalValue) }}
          </p>
        </div>
        <div class="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-emerald-100 to-green-200 dark:from-emerald-900/40 dark:to-green-900/30 text-center">
          <p class="text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
            {{ t('squadValue.startingXI') }}
          </p>
          <p class="text-sm sm:text-xl font-bold text-emerald-900 dark:text-emerald-300 mt-1">
            {{ formatMoney(startingValue) }}
          </p>
        </div>
        <div class="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-200 dark:from-amber-900/40 dark:to-yellow-900/30 text-center">
          <p class="text-[10px] sm:text-xs text-amber-600 dark:text-amber-400 uppercase tracking-wide">
            {{ t('squadValue.bench') }}
          </p>
          <p class="text-sm sm:text-xl font-bold text-amber-900 dark:text-amber-300 mt-1">
            {{ formatMoney(benchValue) }}
          </p>
        </div>
      </div>

      <!-- Budget & Total Assets -->
      <div class="flex justify-between items-center px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800">
        <div>
          <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('squadValue.budget') }}</p>
          <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ formatMoney(budget) }}</p>
        </div>
        <div class="text-right">
          <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('squadValue.totalAssets') }}</p>
          <p class="text-lg font-semibold text-cyan-600 dark:text-cyan-400">{{ formatMoney(totalAssets) }}</p>
        </div>
      </div>

      <!-- Value by Position -->
      <div>
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          {{ t('squadValue.byPosition') }}
        </h3>
        <div class="space-y-2">
          <div v-for="pos in positionBreakdown" :key="pos.label" class="flex items-center gap-3">
            <span class="w-8 text-xs font-medium text-gray-600 dark:text-gray-400">{{ pos.label }}</span>
            <div class="flex-1 h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-500"
                :class="pos.colorClass"
                :style="{ width: `${pos.percentage}%` }"
              />
            </div>
            <span class="w-16 text-right text-xs font-medium text-gray-700 dark:text-gray-300">
              {{ formatMoney(pos.value) }}
            </span>
            <span class="w-10 text-right text-xs text-gray-500 dark:text-gray-400">
              {{ pos.percentage.toFixed(0) }}%
            </span>
          </div>
        </div>
      </div>

      <!-- Most/Least Valuable Players -->
      <div class="grid grid-cols-2 gap-4">
        <div class="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <p class="text-xs text-green-600 dark:text-green-400 mb-2">{{ t('squadValue.mostValuable') }}</p>
          <div class="flex items-center gap-2">
            <img :src="mostValuable.profile_image" :alt="mostValuable.name" class="w-8 h-8 rounded-full object-cover" />
            <div class="min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ mostValuable.name }}</p>
              <p class="text-xs text-green-600 dark:text-green-400">{{ formatMoney(mostValuable.market_value) }}</p>
            </div>
          </div>
        </div>
        <div class="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p class="text-xs text-red-600 dark:text-red-400 mb-2">{{ t('squadValue.leastValuable') }}</p>
          <div class="flex items-center gap-2">
            <img :src="leastValuable.profile_image" :alt="leastValuable.name" class="w-8 h-8 rounded-full object-cover" />
            <div class="min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ leastValuable.name }}</p>
              <p class="text-xs text-red-600 dark:text-red-400">{{ formatMoney(leastValuable.market_value) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- League Comparison -->
      <div>
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          {{ t('squadValue.leagueComparison') }}
        </h3>
        <!-- Min / Avg / Max boxes -->
        <div class="grid grid-cols-3 gap-2 text-center mb-4">
          <div class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
            <p class="text-[10px] text-gray-500 dark:text-gray-400">{{ t('squadValue.leagueMin') }}</p>
            <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ formatMoney(minValue) }}</p>
          </div>
          <div class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
            <p class="text-[10px] text-gray-500 dark:text-gray-400">{{ t('squadValue.leagueAvg') }}</p>
            <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ formatMoney(leagueAvgValue) }}</p>
          </div>
          <div class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
            <p class="text-[10px] text-gray-500 dark:text-gray-400">{{ t('squadValue.leagueMax') }}</p>
            <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ formatMoney(maxValue) }}</p>
          </div>
        </div>
        <!-- Manager markers bar -->
        <div class="mt-3 px-2">
          <div class="relative h-8 bg-gray-200 dark:bg-gray-700 rounded-full">
            <!-- Manager markers -->
            <PopoverRoot v-for="entry in sortedManagers" :key="entry.manager.id">
              <PopoverTrigger as-child>
                <button
                  class="absolute top-1 h-6 w-1.5 rounded-full transform -translate-x-1/2 transition-all hover:scale-x-150 hover:z-10 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-cyan-500"
                  :class="entry.manager.id === currentUserId ? 'bg-cyan-500' : 'bg-gray-500 dark:bg-gray-400'"
                  :style="{ left: `${getManagerPosition(entry.squad_value)}%` }"
                  :aria-label="entry.manager.name"
                />
              </PopoverTrigger>
              <PopoverPortal>
                <PopoverContent
                  class="z-50 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 p-3 min-w-[140px]"
                  :side-offset="8"
                >
                  <div class="flex items-center gap-2">
                    <img
                      :src="entry.manager.profile_image"
                      :alt="entry.manager.name"
                      class="w-8 h-8 rounded-full object-cover"
                    />
                    <div class="min-w-0">
                      <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {{ entry.manager.name }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        {{ formatMoney(entry.squad_value) }}
                      </p>
                    </div>
                  </div>
                  <PopoverArrow class="fill-white dark:fill-gray-800" />
                </PopoverContent>
              </PopoverPortal>
            </PopoverRoot>
            <!-- "You" label for current user -->
            <div
              class="absolute -bottom-5 transform -translate-x-1/2 text-[10px] font-medium text-cyan-600 dark:text-cyan-400 whitespace-nowrap"
              :style="{ left: `${getManagerPosition(currentUserValue)}%` }"
            >
              {{ t('squadValue.you') }} #{{ leagueComparison.your_rank }}
            </div>
          </div>
          <div class="flex justify-between text-[10px] text-gray-500 dark:text-gray-400 mt-6">
            <span>{{ formatMoney(minValue) }}</span>
            <span>{{ formatMoney(maxValue) }}</span>
          </div>
        </div>
      </div>

      <!-- Value History Chart -->
      <div>
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          {{ t('squadValue.history') }}
        </h3>
        <div class="h-48">
          <Line :data="chartData" :options="chartOptions" />
        </div>
        <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
          <div>
            <span class="text-gray-400">{{ t('squadValue.start') }}:</span>
            <span class="ml-1 font-medium text-gray-700 dark:text-gray-300">{{ formatMoney(valueHistory[0]?.total_value || 0) }}</span>
          </div>
          <div>
            <span :class="valueChange >= 0 ? 'text-green-500' : 'text-red-500'">
              {{ valueChange >= 0 ? '+' : '' }}{{ formatMoney(valueChange) }}
            </span>
            <span class="text-gray-400 ml-1">({{ valueChangePercent }}%)</span>
          </div>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js'
import { Line } from 'vue-chartjs'
import {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverPortal,
  PopoverArrow,
} from 'radix-vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import type { DashboardLineup, SquadValueSnapshot, LeagueValueComparison } from '@/types/dashboard'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip)

const props = defineProps<{
  open: boolean
  lineup: DashboardLineup
  budget: number
  valueHistory: SquadValueSnapshot[]
  leagueComparison: LeagueValueComparison
  currentUserId: string
}>()

defineEmits<{
  close: []
}>()

const { t } = useI18n()

// Calculate values from lineup
const allPlayers = computed(() => [...props.lineup.starting, ...props.lineup.bench])
const startingValue = computed(() => props.lineup.starting.reduce((sum, p) => sum + p.market_value, 0))
const benchValue = computed(() => props.lineup.bench.reduce((sum, p) => sum + p.market_value, 0))
const totalValue = computed(() => startingValue.value + benchValue.value)
const totalAssets = computed(() => totalValue.value + props.budget)

// Most/least valuable players
const mostValuable = computed(() => {
  return [...allPlayers.value].sort((a, b) => b.market_value - a.market_value)[0] || allPlayers.value[0]
})
const leastValuable = computed(() => {
  return [...allPlayers.value].sort((a, b) => a.market_value - b.market_value)[0] || allPlayers.value[0]
})

// Position breakdown
const positionBreakdown = computed(() => {
  const positions = [
    { label: 'GK', position: 1, colorClass: 'bg-yellow-500' },
    { label: 'DF', position: 2, colorClass: 'bg-blue-500' },
    { label: 'MF', position: 3, colorClass: 'bg-green-500' },
    { label: 'FW', position: 4, colorClass: 'bg-red-500' },
  ]

  return positions.map(pos => {
    const players = allPlayers.value.filter(p => p.position === pos.position)
    const value = players.reduce((sum, p) => sum + p.market_value, 0)
    const percentage = totalValue.value > 0 ? (value / totalValue.value) * 100 : 0

    return {
      ...pos,
      value,
      percentage,
    }
  })
})

// League comparison - sorted managers and positioning
const sortedManagers = computed(() => {
  return [...props.leagueComparison.managers].sort((a, b) => a.squad_value - b.squad_value)
})

// Actual min/max values (for display)
const minValue = computed(() => {
  return Math.min(...props.leagueComparison.managers.map(m => m.squad_value))
})

const maxValue = computed(() => {
  return Math.max(...props.leagueComparison.managers.map(m => m.squad_value))
})

const leagueAvgValue = computed(() => {
  const values = props.leagueComparison.managers.map(m => m.squad_value)
  return values.reduce((sum, v) => sum + v, 0) / values.length
})

// Padded min/max for bar positioning (5% padding on each side)
const barMinValue = computed(() => Math.floor(minValue.value * 0.95))
const barMaxValue = computed(() => Math.ceil(maxValue.value * 1.05))

const currentUserValue = computed(() => {
  const userEntry = props.leagueComparison.managers.find(m => m.manager.id === props.currentUserId)
  return userEntry?.squad_value || 0
})

function getManagerPosition(value: number): number {
  const range = barMaxValue.value - barMinValue.value
  if (range === 0) return 50
  return ((value - barMinValue.value) / range) * 100
}

// Value change calculations
const valueChange = computed(() => {
  if (props.valueHistory.length < 2) return 0
  const start = props.valueHistory[0].total_value
  const end = props.valueHistory[props.valueHistory.length - 1].total_value
  return end - start
})
const valueChangePercent = computed(() => {
  if (props.valueHistory.length < 2) return '0.0'
  const start = props.valueHistory[0].total_value
  if (start === 0) return '0.0'
  return ((valueChange.value / start) * 100).toFixed(1)
})

// Chart data
const chartData = computed(() => ({
  labels: props.valueHistory.map(v => v.matchday),
  datasets: [
    {
      data: props.valueHistory.map(v => v.total_value / 1_000_000),
      borderColor: '#06b6d4',
      backgroundColor: (context: any) => {
        const chart = context.chart
        const { ctx, chartArea } = chart
        if (!chartArea) return 'rgba(6, 182, 212, 0.1)'
        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
        gradient.addColorStop(0, 'rgba(6, 182, 212, 0.3)')
        gradient.addColorStop(1, 'rgba(6, 182, 212, 0.02)')
        return gradient
      },
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 4,
      borderWidth: 2,
    },
  ],
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: 'index' as const,
  },
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
        title: (items: any[]) => `${t('dashboard.matchday')} ${items[0].label}`,
        label: (context: any) => `${t('squadValue.total')}: ${context.raw.toFixed(1)}M €`,
      },
    },
  },
  scales: {
    y: {
      grid: { color: 'rgba(156, 163, 175, 0.2)' },
      ticks: {
        color: 'rgb(156, 163, 175)',
        callback: (value: string | number) => `${value}M`,
      },
    },
    x: {
      grid: { display: false },
      ticks: { color: 'rgb(156, 163, 175)' },
    },
  },
}))

function formatMoney(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M €`
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(0)}K €`
  }
  return `${value} €`
}
</script>
