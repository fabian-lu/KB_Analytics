<template>
  <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div class="p-4">
      <!-- Responsive container: centered, fits screen on desktop -->
      <div class="relative w-full max-w-md lg:max-w-lg mx-auto">
        <canvas ref="canvasRef" />
      </div>

      <!-- Legend -->
      <div class="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
        <div
          v-for="(player, idx) in players"
          :key="player.id"
          class="flex items-center gap-1.5 text-xs md:text-sm text-gray-700 dark:text-gray-300"
        >
          <span
            class="w-3 h-3 rounded-full flex-shrink-0"
            :style="{ backgroundColor: PALETTE[idx % PALETTE.length] }"
          />
          {{ player.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  Chart as ChartJS,
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import type { MarketPlayer } from '@/types/market'

ChartJS.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const props = defineProps<{
  players: MarketPlayer[]
  allPlayers: MarketPlayer[]
}>()

const { t } = useI18n()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: ChartJS | null = null

const PALETTE = [
  '#06b6d4', // cyan
  '#f43f5e', // rose
  '#f59e0b', // amber
  '#8b5cf6', // violet
  '#10b981', // emerald
  '#a855f7', // purple
  '#f97316', // orange
  '#14b8a6', // teal
]

interface MetricDef {
  key: string
  label: () => string
  getValue: (p: MarketPlayer) => number
  invert?: boolean // true = lower is better (stability)
}

const metrics: MetricDef[] = [
  { key: 'avg_points', label: () => t('compare.radarAvgPts'), getValue: p => p.avg_points },
  { key: 'ppm', label: () => t('compare.radarPPM'), getValue: p => p.ppm },
  { key: 'form', label: () => t('compare.radarForm'), getValue: p => p.form },
  { key: 'stability', label: () => t('compare.radarStability'), getValue: p => p.stability, invert: true },
  { key: 'offense', label: () => t('compare.radarOffense'), getValue: p => p.appearances > 0 ? (p.goals + p.assists) / p.appearances : 0 },
  { key: 'raw_points', label: () => t('compare.radarRawPts'), getValue: p => p.raw_points_avg },
]

function normalizeValue(value: number, maxVal: number, invert: boolean): number {
  if (maxVal <= 0) return 0
  const normalized = (value / maxVal) * 100
  if (invert) {
    // For inverted metrics (stability), lower raw = higher score
    return Math.max(0, 100 - normalized)
  }
  return Math.min(100, normalized)
}

function createChart() {
  if (!canvasRef.value || props.players.length < 1) return

  const ctx = canvasRef.value.getContext('2d')
  if (!ctx) return

  if (chartInstance) {
    chartInstance.destroy()
  }

  // Calculate max values from all players for normalization
  const maxValues: Record<string, number> = {}
  for (const metric of metrics) {
    let max = 0
    for (const p of props.allPlayers) {
      const val = metric.getValue(p)
      if (val > max) max = val
    }
    maxValues[metric.key] = max
  }

  const labels = metrics.map(m => m.label())

  const datasets = props.players.map((player, idx) => {
    const color = PALETTE[idx % PALETTE.length]
    const data = metrics.map(m => {
      const rawVal = m.getValue(player)
      return normalizeValue(rawVal, maxValues[m.key], !!m.invert)
    })

    return {
      label: player.name,
      data,
      backgroundColor: `${color}30`,
      borderColor: color,
      borderWidth: 2,
      pointBackgroundColor: color,
      pointBorderColor: '#fff',
      pointBorderWidth: 1,
      pointRadius: 4,
      pointHoverRadius: 6,
      fill: true,
      // Store raw values for tooltip
      rawValues: metrics.map(m => m.getValue(player)),
    }
  })

  const isDark = document.documentElement.classList.contains('dark')

  chartInstance = new ChartJS(ctx, {
    type: 'radar',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      animation: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          titleColor: '#fff',
          bodyColor: '#fff',
          padding: 10,
          cornerRadius: 8,
          displayColors: true,
          callbacks: {
            title: (context) => {
              const idx = context[0]?.dataIndex
              if (idx !== undefined) {
                return metrics[idx].label()
              }
              return ''
            },
            label: (context) => {
              const dataset = context.dataset as any
              const rawVal = dataset.rawValues?.[context.dataIndex]
              const metricDef = metrics[context.dataIndex]
              let displayVal = rawVal?.toFixed(1) ?? '0'
              if (metricDef.key === 'offense') {
                displayVal = rawVal?.toFixed(2) ?? '0'
              }
              return `${dataset.label}: ${displayVal}`
            },
          },
        },
      },
      scales: {
        r: {
          min: 0,
          max: 100,
          beginAtZero: true,
          ticks: {
            stepSize: 25,
            display: false,
          },
          grid: {
            color: isDark ? 'rgba(156, 163, 175, 0.15)' : 'rgba(156, 163, 175, 0.25)',
          },
          angleLines: {
            color: isDark ? 'rgba(156, 163, 175, 0.15)' : 'rgba(156, 163, 175, 0.25)',
          },
          pointLabels: {
            // Use dark color for both light and dark mode for readability
            color: isDark ? 'rgb(229, 231, 235)' : 'rgb(31, 41, 55)',
            font: { size: 12, weight: 600 },
          },
        },
      },
    },
  })
}

watch(() => props.players, () => {
  nextTick(() => createChart())
}, { deep: true })

onMounted(() => {
  nextTick(() => createChart())
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})
</script>
