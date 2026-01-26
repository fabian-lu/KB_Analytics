<template>
  <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
    <!-- Header with controls -->
    <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
      <div class="flex flex-col gap-3">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h3 class="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
            {{ t('analysis.chartTitle') }}
          </h3>
        </div>

        <!-- Position filter chips -->
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-xs text-gray-500 dark:text-gray-400">{{ t('analysis.players') }}:</span>
          <div class="flex gap-1">
            <button
              v-for="pos in positions"
              :key="pos.value"
              class="px-2 py-1 text-[10px] md:text-xs font-medium rounded-md transition-all"
              :class="[
                selectedPositions.length === 0 || selectedPositions.includes(pos.value)
                  ? `${pos.bg} text-white`
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              ]"
              @click="togglePosition(pos.value)"
            >
              {{ pos.label }}
            </button>
            <button
              v-if="selectedPositions.length > 0"
              class="px-2 py-1 text-[10px] md:text-xs font-medium rounded-md bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              @click="selectedPositions = []"
            >
              {{ t('analysis.showAll') }}
            </button>
          </div>
        </div>

        <!-- Trend line toggles -->
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-xs text-gray-500 dark:text-gray-400">{{ t('analysis.trendLine') }}:</span>
          <div class="flex gap-1">
            <!-- All players trend line toggle -->
            <button
              class="px-2 py-1 text-[10px] md:text-xs font-medium rounded-md transition-all border-2"
              :class="[
                visibleTrendLines.has('all')
                  ? 'bg-gray-600 text-white border-gray-600'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700'
              ]"
              @click="toggleTrendLine('all')"
            >
              {{ t('analysis.allTrend') }}
            </button>
            <!-- Position trend line toggles -->
            <button
              v-for="pos in positions"
              :key="`trend-${pos.value}`"
              class="px-2 py-1 text-[10px] md:text-xs font-medium rounded-md transition-all border-2"
              :class="[
                visibleTrendLines.has(pos.value)
                  ? `${pos.bg} text-white border-transparent`
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700'
              ]"
              @click="toggleTrendLine(pos.value)"
            >
              {{ pos.label }}
            </button>
          </div>
        </div>

        <!-- Outlier filter -->
        <div class="flex flex-wrap items-center gap-2">
          <span class="text-xs text-gray-500 dark:text-gray-400">{{ t('analysis.outliers') }}:</span>
          <div class="flex gap-1">
            <button
              v-for="option in outlierOptions"
              :key="option.value"
              class="px-2 py-1 text-[10px] md:text-xs font-medium rounded-md transition-all"
              :class="[
                outlierFilter === option.value
                  ? option.activeClass
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              ]"
              @click="outlierFilter = option.value"
            >
              {{ option.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Search input for highlighting -->
      <div class="mt-3 relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          ref="searchInputRef"
          v-model="searchQuery"
          type="search"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          :placeholder="t('analysis.searchHighlight')"
          class="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500"
          @focus="showSuggestions = true"
          @blur="onBlur"
          @input="onInputNative"
          @keyup="onInputNative"
        />
        <!-- Search suggestions dropdown -->
        <div
          v-if="showSuggestions && searchSuggestions.length > 0"
          class="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto"
        >
          <button
            v-for="player in searchSuggestions"
            :key="player.id"
            class="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700"
            @mousedown.prevent="addHighlight(player)"
          >
            <img :src="player.profile_image" :alt="player.name" class="w-6 h-6 rounded-full object-cover bg-gray-200 dark:bg-gray-700" />
            <span class="text-gray-900 dark:text-white">{{ player.name }}</span>
            <span class="text-gray-400 text-xs">{{ player.team_short_name }}</span>
          </button>
        </div>
      </div>

      <!-- Highlighted players chips -->
      <div v-if="highlightedPlayerIds.size > 0" class="flex flex-wrap gap-1.5 mt-2">
        <span
          v-for="hp in highlightedPlayersData"
          :key="hp.id"
          class="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 text-xs font-medium rounded-full bg-red-500 text-white"
        >
          {{ hp.name }}
          <button
            class="p-0.5 rounded-full hover:bg-white/20"
            @click="removeHighlight(hp.id)"
          >
            <X class="w-3 h-3" />
          </button>
        </span>
        <button
          class="text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 px-1"
          @click="clearHighlights"
        >
          {{ t('analysis.clearAll') }}
        </button>
      </div>
    </div>

    <!-- Chart -->
    <div class="p-4">
      <div class="h-80 md:h-96 relative">
        <canvas ref="canvasRef" />
        <!-- Labels overlay for highlighted players -->
        <div
          v-for="label in highlightedLabels"
          :key="label.id"
          class="absolute pointer-events-none text-[10px] md:text-xs font-semibold text-red-600 dark:text-red-400 bg-white/90 dark:bg-gray-900/90 px-1 rounded shadow-sm"
          :style="{ left: `${label.x}px`, top: `${label.y - 20}px`, transform: 'translateX(-50%)' }"
        >
          {{ label.name }}
        </div>
      </div>

      <!-- Legend / interpretation guide -->
      <div class="mt-4 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-400">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded-full bg-cyan-500" />
            <span>{{ t('analysis.players') }}</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded-full bg-red-500" />
            <span>{{ t('analysis.highlighted') }}</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-emerald-500">{{ t('analysis.aboveLine') }}</span>
          <span>/</span>
          <span class="text-red-500">{{ t('analysis.belowLine') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { Search, X } from 'lucide-vue-next'
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js'
import type { MarketPlayer } from '@/types/market'
import type { ChartDataPoint } from '@/types/analysis'

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend)

const props = defineProps<{
  players: MarketPlayer[]
}>()

defineEmits<{
  playerClick: [player: MarketPlayer]
}>()

const { t } = useI18n()

// ── State ────────────────────────────────────────
const canvasRef = ref<HTMLCanvasElement | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)
const selectedPositions = ref<number[]>([])
const visibleTrendLines = ref<Set<number | 'all'>>(new Set(['all'])) // Only "All" shown by default
const outlierFilter = ref<'all' | 'over' | 'under'>('all')
const searchQuery = ref('')
const showSuggestions = ref(false)
const highlightedPlayerIds = ref<Set<string>>(new Set())
const highlightedLabels = ref<{ id: string; name: string; x: number; y: number }[]>([])
let chartInstance: ChartJS | null = null

// Outlier threshold (standard deviations from regression line)
const OUTLIER_THRESHOLD = 1.0

// Detect mobile
const isMobile = ref(false)
onMounted(() => {
  isMobile.value = window.innerWidth < 768
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 768
  })
})

// ── Position config ──────────────────────────────
const positions = [
  { value: 1, label: 'GK', bg: 'bg-amber-500', color: '#f59e0b' },
  { value: 2, label: 'DEF', bg: 'bg-blue-500', color: '#3b82f6' },
  { value: 3, label: 'MID', bg: 'bg-emerald-500', color: '#10b981' },
  { value: 4, label: 'FWD', bg: 'bg-rose-500', color: '#f43f5e' },
]

// ── Outlier options ──────────────────────────────
const outlierOptions = computed(() => [
  { value: 'all' as const, label: t('analysis.showAll'), activeClass: 'bg-gray-600 text-white' },
  { value: 'over' as const, label: t('analysis.overperformers'), activeClass: 'bg-emerald-500 text-white' },
  { value: 'under' as const, label: t('analysis.underperformers'), activeClass: 'bg-red-500 text-white' },
])

// ── All players data points (for trend lines) ────
const allDataPoints = computed<ChartDataPoint[]>(() => {
  return props.players.map(player => ({
    x: player.market_value / 1_000_000,
    y: player.avg_points,
    player,
  }))
})

// ── Filtered players (for display) ───────────────
const filteredPlayers = computed(() => {
  let result = props.players

  // Filter by position
  if (selectedPositions.value.length > 0) {
    result = result.filter(p => selectedPositions.value.includes(p.position))
  }

  // Filter by outlier status
  if (outlierFilter.value !== 'all' && allRegression.value.stdDev > 0) {
    const threshold = allRegression.value.stdDev * OUTLIER_THRESHOLD
    result = result.filter(player => {
      const residual = getResidual(player, allRegression.value)
      if (outlierFilter.value === 'over') {
        return residual > threshold  // Above the line by more than threshold
      } else {
        return residual < -threshold  // Below the line by more than threshold
      }
    })
  }

  return result
})

// ── Chart data points (filtered for display) ─────
const displayDataPoints = computed<ChartDataPoint[]>(() => {
  return filteredPlayers.value.map(player => ({
    x: player.market_value / 1_000_000,
    y: player.avg_points,
    player,
  }))
})

// ── Chart range calculation ──────────────────────
const chartRange = computed(() => {
  const allX = allDataPoints.value.map(p => p.x)
  const maxX = Math.max(...allX, 1)
  // Extend range: 0 to max + 10% padding
  return { minX: 0, maxX: maxX * 1.1 }
})

// ── Linear regression calculation ────────────────
interface RegressionResult {
  slope: number
  intercept: number
  r2: number
  stdDev: number  // Standard deviation of residuals
  line: { x: number; y: number }[]
}

function calculateRegression(points: ChartDataPoint[], extendToRange: { minX: number; maxX: number }): RegressionResult {
  const n = points.length
  if (n < 2) {
    return { slope: 0, intercept: 0, r2: 0, stdDev: 0, line: [] }
  }

  // Calculate means
  let sumX = 0, sumY = 0
  for (const p of points) {
    sumX += p.x
    sumY += p.y
  }
  const meanX = sumX / n
  const meanY = sumY / n

  // Calculate slope and intercept
  let numerator = 0, denominator = 0
  for (const p of points) {
    numerator += (p.x - meanX) * (p.y - meanY)
    denominator += (p.x - meanX) ** 2
  }

  const slope = denominator !== 0 ? numerator / denominator : 0
  const intercept = meanY - slope * meanX

  // Calculate R-squared and residual standard deviation
  let ssRes = 0, ssTot = 0
  const residuals: number[] = []
  for (const p of points) {
    const predicted = slope * p.x + intercept
    const residual = p.y - predicted
    residuals.push(residual)
    ssRes += residual ** 2
    ssTot += (p.y - meanY) ** 2
  }
  const r2 = ssTot !== 0 ? 1 - ssRes / ssTot : 0
  const stdDev = Math.sqrt(ssRes / n)

  // Generate line points extending across the full chart range
  // Add many intermediate points to enable hovering along the entire line
  const numPoints = 50
  const step = (extendToRange.maxX - extendToRange.minX) / (numPoints - 1)
  const line: { x: number; y: number }[] = []
  for (let i = 0; i < numPoints; i++) {
    const x = extendToRange.minX + step * i
    line.push({ x, y: slope * x + intercept })
  }

  return { slope, intercept, r2, stdDev, line }
}

// Helper to get residual (distance from regression line)
function getResidual(player: MarketPlayer, regression: RegressionResult): number {
  const x = player.market_value / 1_000_000
  const y = player.avg_points
  const predicted = regression.slope * x + regression.intercept
  return y - predicted  // Positive = above line (overperformer), Negative = below line (underperformer)
}

// ── All players regression (Bundesliga average) ──
const allRegression = computed(() => calculateRegression(allDataPoints.value, chartRange.value))

// ── Position-specific regressions (always from all players) ──
const positionRegressions = computed(() => {
  const result: Record<number, ReturnType<typeof calculateRegression>> = {}
  for (const pos of [1, 2, 3, 4]) {
    const posPoints = allDataPoints.value.filter(dp => dp.player.position === pos)
    if (posPoints.length >= 2) {
      result[pos] = calculateRegression(posPoints, chartRange.value)
    }
  }
  return result
})

// ── Search suggestions ───────────────────────────
const searchSuggestions = computed(() => {
  if (!searchQuery.value.trim()) return []
  const q = searchQuery.value.toLowerCase()
  return props.players
    .filter(p =>
      !highlightedPlayerIds.value.has(p.id) &&
      (p.name.toLowerCase().includes(q) || p.team_short_name.toLowerCase().includes(q))
    )
    .slice(0, 6)
})

// Highlighted players data for chips
const highlightedPlayersData = computed(() => {
  return props.players.filter(p => highlightedPlayerIds.value.has(p.id))
})

// Watch for mobile keyboard input
watch(searchQuery, (newVal) => {
  if (newVal.trim()) {
    showSuggestions.value = true
  }
})

// ── Chart rendering ──────────────────────────────
function getLastName(fullName: string): string {
  const parts = fullName.split(' ')
  return parts[parts.length - 1]
}

function createChart() {
  if (!canvasRef.value) return

  const ctx = canvasRef.value.getContext('2d')
  if (!ctx) return

  // Destroy existing chart
  if (chartInstance) {
    chartInstance.destroy()
  }

  // Split into normal and highlighted
  const normalPoints: any[] = []
  const highlightedPointsList: any[] = []

  for (const dp of displayDataPoints.value) {
    const point = {
      x: dp.x,
      y: dp.y,
      player: dp.player,
    }

    if (highlightedPlayerIds.value.has(dp.player.id)) {
      highlightedPointsList.push(point)
    } else {
      normalPoints.push(point)
    }
  }

  const datasets: any[] = []

  // Normal players dataset - all same color (cyan)
  if (normalPoints.length > 0) {
    datasets.push({
      label: t('analysis.players'),
      data: normalPoints,
      backgroundColor: 'rgba(6, 182, 212, 0.6)',
      borderColor: 'rgb(6, 182, 212)',
      borderWidth: 1,
      pointRadius: 5,
      pointHoverRadius: 8,
      order: 2,
    })
  }

  // Highlighted players dataset - RED and larger
  if (highlightedPointsList.length > 0) {
    datasets.push({
      label: t('analysis.highlighted'),
      data: highlightedPointsList,
      backgroundColor: 'rgb(239, 68, 68)',
      borderColor: '#ffffff',
      borderWidth: 2,
      pointRadius: 10,
      pointHoverRadius: 12,
      order: 1, // Draw on top
    })
  }

  // All players regression line (Bundesliga average)
  if (visibleTrendLines.value.has('all') && allRegression.value.line.length > 0) {
    datasets.push({
      label: `${t('analysis.allTrend')} (R²=${allRegression.value.r2.toFixed(2)})`,
      data: allRegression.value.line,
      type: 'line' as const,
      borderColor: 'rgba(107, 114, 128, 0.8)',
      borderWidth: 3,
      borderDash: [8, 4],
      pointRadius: 0,
      pointHitRadius: 10,  // Increase hit area for hover
      pointHoverRadius: 6,
      fill: false,
      tension: 0,
      order: 10,
    })
  }

  // Position-specific regression lines
  for (const [pos, regression] of Object.entries(positionRegressions.value)) {
    const posNum = Number(pos)
    const posConfig = positions.find(p => p.value === posNum)
    if (visibleTrendLines.value.has(posNum) && regression && regression.line.length > 0 && posConfig) {
      datasets.push({
        label: `${posConfig.label} ${t('analysis.trend')} (R²=${regression.r2.toFixed(2)})`,
        data: regression.line,
        type: 'line' as const,
        borderColor: posConfig.color,
        borderWidth: 2,
        borderDash: [4, 2],
        pointRadius: 0,
        pointHitRadius: 10,  // Increase hit area for hover
        pointHoverRadius: 6,
        fill: false,
        tension: 0,
        order: 10,
      })
    }
  }

  chartInstance = new ChartJS(ctx, {
    type: 'scatter',
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false, // Disable animation to prevent reload feel
      interaction: {
        mode: 'nearest',
        intersect: false,  // Allow hovering near elements, not just exactly on them
        axis: 'xy',
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          titleColor: '#fff',
          bodyColor: '#fff',
          padding: 12,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            title: (context: any) => {
              const point = context[0]?.raw
              if (!point?.player) {
                // It's a trend line - show the label
                return context[0]?.dataset?.label || ''
              }
              return point.player.name
            },
            label: (context: any) => {
              const point = context.raw
              if (!point?.player) {
                // Trend line - show explanation
                return t('analysis.expectedLine')
              }
              const p = point.player as MarketPlayer
              return [
                `${p.team_name}`,
                `${t('analysis.value')}: ${formatMoney(p.market_value)}`,
                `${t('analysis.avgPoints')}: ${p.avg_points}`,
                `${t('analysis.form')}: ${p.form}`,
              ]
            },
          },
        },
      },
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          min: chartRange.value.minX,
          max: chartRange.value.maxX,
          title: {
            display: true,
            text: t('analysis.marketValue'),
            color: 'rgb(156, 163, 175)',
            font: { size: 12 },
          },
          grid: { color: 'rgba(156, 163, 175, 0.15)' },
          ticks: {
            color: 'rgb(156, 163, 175)',
            callback: (value: any) => `${value}M`,
          },
        },
        y: {
          type: 'linear',
          title: {
            display: true,
            text: t('analysis.avgPoints'),
            color: 'rgb(156, 163, 175)',
            font: { size: 12 },
          },
          grid: { color: 'rgba(156, 163, 175, 0.15)' },
          ticks: { color: 'rgb(156, 163, 175)' },
          beginAtZero: true,
        },
      },
      onClick: (_event: any, elements: any[]) => {
        // On mobile, don't highlight on click
        if (isMobile.value) return

        if (elements.length > 0) {
          const element = elements[0]
          const datasetIndex = element.datasetIndex
          const index = element.index
          const point = chartInstance?.data.datasets[datasetIndex]?.data[index] as any
          if (point?.player) {
            toggleHighlight(point.player)
          }
        }
      },
    },
  })

  // Update labels after chart is created
  updateHighlightedLabels()
}

function updateHighlightedLabels() {
  if (!chartInstance) {
    highlightedLabels.value = []
    return
  }

  const labels: { id: string; name: string; x: number; y: number }[] = []

  // Find the highlighted dataset
  const datasets = chartInstance.data.datasets
  for (let di = 0; di < datasets.length; di++) {
    const dataset = datasets[di]
    if (dataset.label === t('analysis.highlighted')) {
      const meta = chartInstance.getDatasetMeta(di)
      for (let i = 0; i < meta.data.length; i++) {
        const point = meta.data[i]
        const dataPoint = dataset.data[i] as any
        if (dataPoint?.player) {
          labels.push({
            id: dataPoint.player.id,
            name: getLastName(dataPoint.player.name),
            x: point.x,
            y: point.y,
          })
        }
      }
    }
  }

  highlightedLabels.value = labels
}

// Watch for changes that need chart rebuild
watch([displayDataPoints, visibleTrendLines, outlierFilter], () => {
  nextTick(() => createChart())
}, { deep: true })

// Watch highlighted players - rebuild chart
watch(highlightedPlayerIds, () => {
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

// ── Actions ──────────────────────────────────────
function togglePosition(pos: number) {
  const idx = selectedPositions.value.indexOf(pos)
  if (idx >= 0) {
    selectedPositions.value.splice(idx, 1)
  } else {
    selectedPositions.value.push(pos)
  }
}

function toggleTrendLine(key: number | 'all') {
  const newSet = new Set(visibleTrendLines.value)
  if (newSet.has(key)) {
    newSet.delete(key)
  } else {
    newSet.add(key)
  }
  visibleTrendLines.value = newSet
}

function onInputNative(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.value !== searchQuery.value) {
    searchQuery.value = target.value
  }
  showSuggestions.value = true
}

function onBlur() {
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

function addHighlight(player: MarketPlayer) {
  if (highlightedPlayerIds.value.has(player.id)) return
  highlightedPlayerIds.value = new Set([...highlightedPlayerIds.value, player.id])
  searchQuery.value = ''
  showSuggestions.value = false
}

function removeHighlight(id: string) {
  const newSet = new Set(highlightedPlayerIds.value)
  newSet.delete(id)
  highlightedPlayerIds.value = newSet
}

function clearHighlights() {
  highlightedPlayerIds.value = new Set()
}

function toggleHighlight(player: MarketPlayer) {
  if (highlightedPlayerIds.value.has(player.id)) {
    removeHighlight(player.id)
  } else {
    addHighlight(player)
  }
}

function formatMoney(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M €`
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K €`
  return `${value} €`
}
</script>
