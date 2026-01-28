<template>
  <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
    <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
      {{ t('managers.pointsHistory.title') }}
    </h3>

    <!-- Chart container -->
    <div class="h-48 md:h-56">
      <Bar :data="chartData" :options="chartOptions" />
    </div>

    <!-- Legend -->
    <div class="flex items-center justify-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
      <div class="flex items-center gap-1">
        <div class="w-3 h-3 rounded bg-cyan-500" />
        <span>{{ t('managers.points') }}</span>
      </div>
      <div class="flex items-center gap-1">
        <Crown class="w-3.5 h-3.5 text-amber-500" />
        <span>{{ t('managers.pointsHistory.win') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Crown } from 'lucide-vue-next'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'vue-chartjs'
import type { ManagerMatchdayResult } from '@/types/league'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const props = defineProps<{
  history: ManagerMatchdayResult[]
}>()

const { t } = useI18n()

const chartData = computed(() => {
  const labels = props.history.map(h => `${t('managers.matchday')}${h.matchday}`)
  const data = props.history.map(h => h.points)
  const wins = props.history.map(h => h.rank === 1)

  // Color bars: gold for wins, cyan for normal
  const backgroundColors = wins.map(isWin =>
    isWin ? 'rgba(251, 191, 36, 0.8)' : 'rgba(6, 182, 212, 0.7)'
  )
  const borderColors = wins.map(isWin =>
    isWin ? 'rgb(251, 191, 36)' : 'rgb(6, 182, 212)'
  )

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const idx = context.dataIndex
          const result = props.history[idx]
          let label = `${context.parsed.y} ${t('managers.points')}`
          if (result.rank === 1) {
            label += ' 👑'
          } else {
            label += ` (#${result.rank})`
          }
          return label
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        font: { size: 10 },
        maxRotation: 45,
        minRotation: 45,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(156, 163, 175, 0.1)',
      },
      ticks: {
        font: { size: 10 },
      },
    },
  },
}))
</script>
