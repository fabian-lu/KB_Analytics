<template>
  <div class="flex gap-2 justify-center">
    <div class="px-3 py-2 md:p-4 rounded-lg md:rounded-xl bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 text-center">
      <p class="text-xs md:text-sm text-gray-500 dark:text-gray-400">
        {{ t('dashboard.avgPoints') }}
      </p>
      <p class="text-base md:text-2xl font-bold text-gray-900 dark:text-white">
        {{ Math.round(stats.avg_points_per_matchday) }}
      </p>
    </div>

    <div class="px-3 py-2 md:p-4 rounded-lg md:rounded-xl bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 text-center">
      <p class="text-xs md:text-sm text-gray-500 dark:text-gray-400">
        {{ t('dashboard.totalPoints') }}
      </p>
      <p class="text-base md:text-2xl font-bold text-gray-900 dark:text-white">
        {{ stats.total_points.toLocaleString() }}
      </p>
    </div>

    <div class="px-3 py-2 md:p-4 rounded-lg md:rounded-xl bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 text-center">
      <p class="text-xs md:text-sm text-gray-500 dark:text-gray-400">
        {{ t('dashboard.matchdayWins') }}
      </p>
      <p class="text-base md:text-2xl font-bold text-gray-900 dark:text-white">
        {{ stats.matchday_wins }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { DashboardStats } from '@/types/dashboard'

defineProps<{
  stats: DashboardStats
}>()

const { t } = useI18n()
</script>
