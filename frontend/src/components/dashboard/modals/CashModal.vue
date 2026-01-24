<template>
  <BaseModal :open="open" :title="t('dashboard.availableCash')" size="lg" @close="$emit('close')">
    <div v-scrollbar-autohide class="space-y-6 max-h-[70vh] overflow-y-auto scrollbar-autohide">
      <!-- Top Stats: Budget / Total Assets / Transfer Profit -->
      <div class="grid grid-cols-3 gap-2 sm:gap-4">
        <div class="p-2 sm:p-4 rounded-xl bg-gradient-to-br from-emerald-100 to-green-200 dark:from-emerald-900/40 dark:to-green-900/30 text-center overflow-hidden">
          <p class="text-[8px] sm:text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wide truncate">
            {{ t('cash.budget') }}
          </p>
          <p class="text-sm sm:text-xl font-bold text-emerald-900 dark:text-emerald-300 mt-1">
            {{ formatMoney(cashData.budget) }}
          </p>
        </div>
        <div class="p-2 sm:p-4 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 text-center overflow-hidden">
          <p class="text-[8px] sm:text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide truncate">
            {{ t('cash.totalAssets') }}
          </p>
          <p class="text-sm sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
            {{ formatMoney(cashData.total_assets) }}
          </p>
        </div>
        <div class="p-2 sm:p-4 rounded-xl bg-gradient-to-br text-center overflow-hidden" :class="cashData.total_transfer_profit >= 0 ? 'from-cyan-100 to-blue-200 dark:from-cyan-900/40 dark:to-blue-900/30' : 'from-red-100 to-rose-200 dark:from-red-900/40 dark:to-rose-900/30'">
          <p class="text-[8px] sm:text-xs uppercase tracking-wide truncate" :class="cashData.total_transfer_profit >= 0 ? 'text-cyan-600 dark:text-cyan-400' : 'text-red-600 dark:text-red-400'">
            {{ t('cash.transferProfit') }}
          </p>
          <p class="text-sm sm:text-xl font-bold mt-1" :class="cashData.total_transfer_profit >= 0 ? 'text-cyan-900 dark:text-cyan-300' : 'text-red-900 dark:text-red-300'">
            {{ cashData.total_transfer_profit >= 0 ? '+' : '' }}{{ formatMoney(cashData.total_transfer_profit) }}
          </p>
        </div>
      </div>

      <!-- Budget Forecast -->
      <div class="px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
        <div class="flex justify-between items-start mb-2">
          <p class="text-xs text-amber-600 dark:text-amber-400">{{ t('cash.spendableUntil', { matchday: nextMatchday }) }}</p>
          <p class="text-xs text-amber-600 dark:text-amber-400">{{ t('cash.mustBePositive') }}</p>
        </div>
        <p class="text-xl font-bold text-amber-900 dark:text-amber-300 mb-2">
          {{ formatMoneyExact(spendableBudget) }}
        </p>
        <div class="text-[10px] text-amber-700 dark:text-amber-400 space-y-0.5 font-mono">
          <p>{{ formatMoneyExact(cashData.budget) }} {{ t('cash.currentBudget') }}</p>
          <p>+ {{ formatMoneyExact(cashData.avg_daily_profit) }} × {{ cashData.days_until_matchday }} {{ t('cash.daysAvgProfit') }}</p>
          <p>+ {{ formatMoneyExact(cashData.daily_bonus) }} × {{ cashData.days_until_matchday }} {{ t('cash.daysDailyBonus') }}</p>
        </div>
      </div>

      <!-- Transfer Profit Chart -->
      <div>
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          {{ t('cash.profitHistory') }}
        </h3>
        <div class="h-48">
          <Line :data="chartData" :options="chartOptions" />
        </div>
      </div>

      <!-- Best & Worst Transfers -->
      <div class="grid grid-cols-2 gap-4">
        <!-- Best Transfers -->
        <div>
          <h3 class="text-sm font-semibold text-green-600 dark:text-green-400 mb-3">
            {{ t('cash.bestTransfers') }}
          </h3>
          <div class="space-y-2">
            <div
              v-for="transfer in cashData.best_transfers"
              :key="transfer.player_id"
              class="flex items-center gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
            >
              <img :src="transfer.player_image" :alt="transfer.player_name" class="w-8 h-8 rounded-full object-cover" />
              <div class="min-w-0 flex-1">
                <p class="text-xs font-medium text-gray-900 dark:text-white truncate">{{ transfer.player_name }}</p>
                <p class="text-xs text-green-600 dark:text-green-400">+{{ formatMoney(transfer.profit) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Worst Transfers -->
        <div>
          <h3 class="text-sm font-semibold text-red-600 dark:text-red-400 mb-3">
            {{ t('cash.worstTransfers') }}
          </h3>
          <div class="space-y-2">
            <div
              v-for="transfer in cashData.worst_transfers"
              :key="transfer.player_id"
              class="flex items-center gap-2 p-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            >
              <img :src="transfer.player_image" :alt="transfer.player_name" class="w-8 h-8 rounded-full object-cover" />
              <div class="min-w-0 flex-1">
                <p class="text-xs font-medium text-gray-900 dark:text-white truncate">{{ transfer.player_name }}</p>
                <p class="text-xs text-red-600 dark:text-red-400">{{ formatMoney(transfer.profit) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- League Budget Table -->
      <div>
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          {{ t('cash.leagueBudgets') }}
        </h3>
        <div class="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <!-- Table Header -->
          <div class="grid grid-cols-[auto_1fr_auto] gap-2 px-3 py-2 text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-100 dark:bg-gray-800">
            <span class="w-6 sm:w-8 text-center">#</span>
            <span>{{ t('cash.manager') }}</span>
            <span class="w-20 sm:w-24 text-right">{{ t('cash.budget') }}</span>
          </div>
          <!-- Table Rows -->
          <div class="divide-y divide-gray-100 dark:divide-gray-800 max-h-[280px] overflow-y-auto">
            <div
              v-for="(entry, index) in cashData.league_budgets"
              :key="entry.manager.id"
              class="grid grid-cols-[auto_1fr_auto] gap-2 px-3 py-2 items-center transition-colors"
              :class="entry.manager.id === currentUserId
                ? 'bg-accent/10 dark:bg-accent/20'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'"
            >
              <!-- Rank -->
              <span class="w-6 sm:w-8 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ index + 1 }}
              </span>
              <!-- Manager -->
              <div class="flex items-center gap-2 min-w-0">
                <img
                  :src="entry.manager.profile_image"
                  :alt="entry.manager.name"
                  class="w-6 h-6 rounded-full object-cover flex-shrink-0"
                />
                <span
                  class="text-xs sm:text-sm font-medium truncate"
                  :class="entry.manager.id === currentUserId
                    ? 'text-accent dark:text-accent-light'
                    : 'text-gray-900 dark:text-white'"
                >
                  {{ entry.manager.name }}
                </span>
              </div>
              <!-- Budget -->
              <span class="w-20 sm:w-24 text-right text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                {{ formatMoney(entry.budget) }}
              </span>
            </div>
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
import BaseModal from '@/components/ui/BaseModal.vue'
import type { CashData } from '@/types/dashboard'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip)

const props = defineProps<{
  open: boolean
  cashData: CashData
  currentUserId: string
  nextMatchday: number
}>()

defineEmits<{
  close: []
}>()

const { t } = useI18n()

// Calculate spendable budget: current + (avg_daily_profit + daily_bonus) * days
const spendableBudget = computed(() => {
  return props.cashData.budget +
    (props.cashData.avg_daily_profit + props.cashData.daily_bonus) * props.cashData.days_until_matchday
})

// Format date for display (e.g., "15 Aug" or "3 Jan")
function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr)
  const day = date.getDate()
  const month = date.toLocaleString('en', { month: 'short' })
  return `${day} ${month}`
}

// Chart data - shows transfer profit over time (daily data)
const chartData = computed(() => ({
  labels: props.cashData.profit_history.map(v => v.date),
  datasets: [
    {
      data: props.cashData.profit_history.map(v => v.transfer_profit / 1_000_000),
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
      tension: 0.3,
      pointRadius: 0,  // No dots
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
        title: (items: any[]) => formatDateShort(items[0].label),
        label: (context: any) => `${t('cash.transferProfit')}: ${context.raw >= 0 ? '+' : ''}${context.raw.toFixed(2)}M €`,
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
      ticks: {
        color: 'rgb(156, 163, 175)',
        maxRotation: 0,
        autoSkip: true,
        maxTicksLimit: 6,  // Show only ~6 labels on x-axis
        callback: function(_value: any, index: number) {
          const date = props.cashData.profit_history[index]?.date
          if (!date) return ''
          return formatDateShort(date)
        },
      },
    },
  },
}))

function formatMoney(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M €`
  }
  if (Math.abs(value) >= 1_000) {
    return `${(value / 1_000).toFixed(0)}K €`
  }
  return `${value} €`
}

function formatMoneyExact(value: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}
</script>
