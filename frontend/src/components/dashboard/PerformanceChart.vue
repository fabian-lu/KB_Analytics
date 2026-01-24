<template>
  <div class="p-4 rounded-xl bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-800">
    <!-- Header with toggle -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ t('dashboard.performanceHistory') }}
      </h3>
      <div class="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <button
          @click="chartType = 'bar'"
          class="px-3 py-1 text-sm rounded-md transition-colors"
          :class="chartType === 'bar'
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400'"
        >
          Bar
        </button>
        <button
          @click="chartType = 'line'"
          class="px-3 py-1 text-sm rounded-md transition-colors"
          :class="chartType === 'line'
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400'"
        >
          Line
        </button>
      </div>
    </div>

    <!-- Bar Chart (scrollable only when needed) -->
    <div v-if="chartType === 'bar'" class="h-64 overflow-x-auto">
      <div class="h-full" :style="barChartContainerStyle">
        <Bar :data="barChartData" :options="barChartOptions" :plugins="[crownPlugin]" />
      </div>
    </div>

    <!-- Line Chart (no scroll, area gradient) -->
    <div v-else class="h-64">
      <Line :data="lineChartData" :options="lineChartOptions" />
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
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Bar, Line } from 'vue-chartjs'
import type { MatchdayPerformance } from '@/types/dashboard'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const props = defineProps<{
  history: MatchdayPerformance[]
}>()

const { t } = useI18n()
const chartType = ref<'bar' | 'line'>('bar')

const BAR_WIDTH = 24 // Fixed bar width in pixels
const BAR_SPACING = 8 // Space between bars

// Only set min-width when we need scrolling (content would exceed container)
const barChartContainerStyle = computed(() => {
  const totalWidth = props.history.length * (BAR_WIDTH + BAR_SPACING) + 60 // +60 for y-axis
  return { minWidth: `${totalWidth}px` }
})

function getColorForPoints(points: number): string {
  if (points < 300) return '#dc2626'
  if (points < 500) return '#f87171'
  if (points < 800) return '#fb923c'
  if (points < 1200) return '#86efac'
  return '#16a34a'
}

// Custom plugin to draw crowns on top of winner bars
const crownPlugin = {
  id: 'crownPlugin',
  afterDatasetsDraw(chart: any) {
    const { ctx } = chart
    const meta = chart.getDatasetMeta(0)

    meta.data.forEach((element: any, index: number) => {
      const matchday = props.history[index]
      if (matchday.is_winner) {
        const x = element.x
        const y = element.y - 15

        ctx.save()
        ctx.font = '14px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'bottom'
        ctx.fillText('👑', x, y)
        ctx.restore()
      }
    })
  },
}

// Bar chart config
const barChartData = computed(() => ({
  labels: props.history.map(h => `${h.matchday}`),
  datasets: [
    {
      label: 'Points',
      data: props.history.map(h => h.points),
      backgroundColor: props.history.map(h => getColorForPoints(h.points)),
      borderColor: props.history.map(h => getColorForPoints(h.points)),
      borderWidth: 0,
      borderRadius: 4,
      barThickness: BAR_WIDTH,
    },
  ],
}))

const barChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: { top: 20 },
  },
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
        title: (context: any) => {
          const matchday = props.history[context[0].dataIndex]
          return matchday.is_winner
            ? `👑 ${t('dashboard.matchday')} ${matchday.matchday} - ${t('dashboard.matchdayWin')}!`
            : `${t('dashboard.matchday')} ${matchday.matchday}`
        },
        label: (context: any) => `${context.raw} ${t('dashboard.points')}`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(156, 163, 175, 0.2)' },
      ticks: { color: 'rgb(156, 163, 175)' },
      title: {
        display: true,
        text: t('dashboard.points'),
        color: 'rgb(156, 163, 175)',
        font: { size: 11 },
      },
    },
    x: {
      grid: { display: false },
      ticks: {
        color: 'rgb(156, 163, 175)',
        font: { size: 10 },
      },
      title: {
        display: true,
        text: t('dashboard.matchday'),
        color: 'rgb(156, 163, 175)',
        font: { size: 11 },
      },
    },
  },
}))

// Line chart config (area chart with gradient)
const lineChartData = computed(() => ({
  labels: props.history.map(h => h.matchday),
  datasets: [
    {
      label: 'Points',
      data: props.history.map(h => h.points),
      borderColor: '#22c55e',
      borderWidth: 2,
      fill: true,
      backgroundColor: (context: any) => {
        const chart = context.chart
        const { ctx, chartArea } = chart
        if (!chartArea) return 'rgba(34, 197, 94, 0.1)'

        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
        gradient.addColorStop(0, 'rgba(34, 197, 94, 0.4)')
        gradient.addColorStop(1, 'rgba(34, 197, 94, 0.02)')
        return gradient
      },
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointHoverBackgroundColor: '#22c55e',
    },
  ],
}))

const lineChartOptions = computed(() => ({
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
        title: (context: any) => {
          const matchday = props.history[context[0].dataIndex]
          return matchday.is_winner
            ? `👑 ${t('dashboard.matchday')} ${matchday.matchday} - ${t('dashboard.matchdayWin')}!`
            : `${t('dashboard.matchday')} ${matchday.matchday}`
        },
        label: (context: any) => `${context.raw} ${t('dashboard.points')}`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(156, 163, 175, 0.2)' },
      ticks: { color: 'rgb(156, 163, 175)' },
      title: {
        display: true,
        text: t('dashboard.points'),
        color: 'rgb(156, 163, 175)',
        font: { size: 11 },
      },
    },
    x: {
      grid: { display: false },
      ticks: {
        color: 'rgb(156, 163, 175)',
        font: { size: 9 },
        maxRotation: 0,
        callback: function(_value: any, index: number) {
          // Show fewer labels on mobile
          if (props.history.length > 20) {
            return index % 5 === 0 ? props.history[index].matchday : ''
          }
          return props.history[index].matchday
        },
      },
      title: {
        display: true,
        text: t('dashboard.matchday'),
        color: 'rgb(156, 163, 175)',
        font: { size: 11 },
      },
    },
  },
}))
</script>
