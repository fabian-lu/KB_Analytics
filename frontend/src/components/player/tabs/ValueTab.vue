<template>
  <div class="space-y-6">
    <!-- Current Value -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
      <StatBox
        :label="t('player.currentValue')"
        :value="player.value.current"
        format="money"
        variant="info"
      />
      <StatBox
        :label="t('player.change1d')"
        :value="formatChange(player.value.change_1d)"
        :sub-value="formatPercent(player.value.change_1d_pct)"
        :variant="player.value.change_1d >= 0 ? 'success' : 'danger'"
      />
      <StatBox
        :label="t('player.change7d')"
        :value="formatChange(player.value.change_7d)"
        :sub-value="formatPercent(player.value.change_7d_pct)"
        :variant="player.value.change_7d >= 0 ? 'success' : 'danger'"
      />
      <StatBox
        :label="t('player.change1m')"
        :value="formatChange(player.value.change_1m)"
        :sub-value="formatPercent(player.value.change_1m_pct)"
        :variant="player.value.change_1m >= 0 ? 'success' : 'danger'"
      />
    </div>

    <!-- Price Chart -->
    <div>
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        {{ t('player.priceHistory') }}
      </h3>
      <div class="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-4">
        <div class="h-56">
          <Line :data="chartData" :options="chartOptions" />
        </div>
        <div class="flex items-center justify-center gap-6 mt-4 text-xs">
          <div class="flex items-center gap-2">
            <span class="w-3 h-0.5 bg-cyan-500" />
            <span class="text-gray-600 dark:text-gray-400">{{ t('player.actualPrice') }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-3 h-0.5 bg-cyan-500/50 border-dashed border-t border-cyan-500" />
            <span class="text-gray-600 dark:text-gray-400">{{ t('player.forecast') }}</span>
          </div>
          <div v-if="player.ownership.buy_price" class="flex items-center gap-2">
            <span class="w-3 h-0.5 bg-violet-500" />
            <span class="text-gray-600 dark:text-gray-400">{{ t('player.buyPrice') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Profit (if owned) -->
    <div v-if="player.ownership.owner && player.ownership.buy_price">
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        {{ t('player.yourInvestment') }}
      </h3>
      <div class="rounded-xl p-4 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800">
        <div class="grid grid-cols-3 gap-4">
          <div class="text-center">
            <p class="text-xs text-violet-600 dark:text-violet-400 uppercase">{{ t('player.buyPrice') }}</p>
            <p class="text-lg font-bold text-gray-900 dark:text-white">{{ formatMoney(player.ownership.buy_price) }}</p>
          </div>
          <div class="text-center border-x border-violet-200 dark:border-violet-700">
            <p class="text-xs text-violet-600 dark:text-violet-400 uppercase">{{ t('player.currentValue') }}</p>
            <p class="text-lg font-bold text-gray-900 dark:text-white">{{ formatMoney(player.value.current) }}</p>
          </div>
          <div class="text-center">
            <p class="text-xs text-violet-600 dark:text-violet-400 uppercase">{{ t('player.profit') }}</p>
            <p
              class="text-lg font-bold"
              :class="player.ownership.profit! >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
            >
              {{ player.ownership.profit! >= 0 ? '+' : '' }}{{ formatMoney(player.ownership.profit!) }}
            </p>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-violet-200 dark:border-violet-700">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('player.returnOnInvestment') }}</span>
            <span
              class="text-lg font-bold"
              :class="player.ownership.profit_pct! >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
            >
              {{ player.ownership.profit_pct! >= 0 ? '+' : '' }}{{ player.ownership.profit_pct!.toFixed(1) }}%
            </span>
          </div>
          <div class="mt-2 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
            <div
              class="h-full rounded-full transition-all"
              :class="player.ownership.profit_pct! >= 0 ? 'bg-green-500' : 'bg-red-500'"
              :style="{ width: `${Math.min(100, Math.abs(player.ownership.profit_pct!))}%` }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Price Forecast -->
    <div>
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        {{ t('player.priceForecast') }}
      </h3>
      <div class="rounded-xl p-4 bg-gray-50 dark:bg-gray-800/50">
        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">{{ t('player.in7Days') }}</p>
            <p class="text-lg font-bold text-gray-900 dark:text-white">{{ formatMoney(forecast7d.value) }}</p>
            <TrendBadge :value="forecast7d.value - player.value.current" size="sm" />
          </div>
          <div class="border-x border-gray-200 dark:border-gray-700">
            <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">{{ t('player.in14Days') }}</p>
            <p class="text-lg font-bold text-gray-900 dark:text-white">{{ formatMoney(forecast14d.value) }}</p>
            <TrendBadge :value="forecast14d.value - player.value.current" size="sm" />
          </div>
          <div>
            <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">{{ t('player.in30Days') }}</p>
            <p class="text-lg font-bold text-gray-900 dark:text-white">{{ formatMoney(forecast30d.value) }}</p>
            <TrendBadge :value="forecast30d.value - player.value.current" size="sm" />
          </div>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
          {{ t('player.forecastDisclaimer') }}
        </p>
      </div>
    </div>

    <!-- Efficiency -->
    <div>
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        {{ t('player.efficiency') }}
      </h3>
      <div class="grid grid-cols-2 gap-3">
        <div class="rounded-xl p-4 bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800">
          <p class="text-xs text-cyan-600 dark:text-cyan-400 uppercase mb-1">{{ t('player.eurosPerPoint') }}</p>
          <p class="text-2xl font-bold text-cyan-700 dark:text-cyan-300">
            {{ formatMoney(player.efficiency.euros_per_point) }}
          </p>
          <div class="mt-2">
            <RankBadge :rank="player.efficiency.bundesliga_rank" :total="player.efficiency.total_bundesliga" />
          </div>
        </div>
        <div class="rounded-xl p-4 bg-gray-50 dark:bg-gray-800/50">
          <p class="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">{{ t('player.positionAvg') }}</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ formatMoney(player.position_average.euros_per_point) }}
          </p>
          <p class="text-xs mt-2" :class="isMoreEfficient ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
            {{ isMoreEfficient ? t('player.moreEfficient') : t('player.lessEfficient') }}
          </p>
        </div>
      </div>
    </div>
  </div>
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
import StatBox from '../shared/StatBox.vue'
import TrendBadge from '../shared/TrendBadge.vue'
import RankBadge from '../shared/RankBadge.vue'
import type { PlayerDetail } from '@/types/player'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip)

const props = defineProps<{
  player: PlayerDetail
}>()

const { t } = useI18n()

const forecast7d = computed(() => props.player.price_forecast[6] || props.player.price_forecast[0])
const forecast14d = computed(() => props.player.price_forecast[13] || props.player.price_forecast[0])
const forecast30d = computed(() => props.player.price_forecast[props.player.price_forecast.length - 1] || props.player.price_forecast[0])

const isMoreEfficient = computed(() =>
  props.player.efficiency.euros_per_point < props.player.position_average.euros_per_point
)

// Chart data
const chartData = computed(() => {
  const history = props.player.price_history
  const forecast = props.player.price_forecast

  // Sample history to avoid too many points
  const sampledHistory = history.filter((_, i) => i % 3 === 0 || i === history.length - 1)

  const historyLabels = sampledHistory.map(p => {
    const date = new Date(p.date)
    return `${date.getDate()}.${date.getMonth() + 1}`
  })

  const forecastLabels = forecast.filter((_, i) => i % 5 === 0).map(p => {
    const date = new Date(p.date)
    return `${date.getDate()}.${date.getMonth() + 1}`
  })

  const allLabels = [...historyLabels, ...forecastLabels]

  const historyData = sampledHistory.map(p => p.value / 1_000_000)
  const forecastData = forecast.filter((_, i) => i % 5 === 0).map(p => p.value / 1_000_000)

  // Connect history to forecast
  const fullHistoryData = [...historyData, ...Array(forecastLabels.length).fill(null)]
  const fullForecastData = [...Array(historyLabels.length - 1).fill(null), historyData[historyData.length - 1], ...forecastData]

  const datasets: any[] = [
    {
      label: 'Price',
      data: fullHistoryData,
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
    {
      label: 'Forecast',
      data: fullForecastData,
      borderColor: 'rgba(6, 182, 212, 0.5)',
      borderDash: [5, 5],
      fill: false,
      tension: 0.4,
      pointRadius: 0,
      borderWidth: 2,
    },
  ]

  // Add buy price line if owned
  if (props.player.ownership.buy_price) {
    const buyPriceInM = props.player.ownership.buy_price / 1_000_000
    datasets.push({
      label: 'Buy Price',
      data: allLabels.map(() => buyPriceInM),
      borderColor: '#8b5cf6',
      borderDash: [3, 3],
      fill: false,
      pointRadius: 0,
      borderWidth: 1,
    })
  }

  return { labels: allLabels, datasets }
})

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
        label: (context: any) => {
          if (context.raw === null) return ''
          return `${context.raw.toFixed(1)}M €`
        },
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
        maxTicksLimit: 8,
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

function formatChange(value: number): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${formatMoney(value)}`
}

function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}%`
}
</script>
