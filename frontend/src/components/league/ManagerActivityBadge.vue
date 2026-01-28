<template>
  <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
        {{ t('managers.activity.title') }}
      </h3>

      <!-- Engagement badge -->
      <span
        class="px-2.5 py-1 rounded-full text-xs font-medium"
        :class="engagementClass"
      >
        {{ t(`managers.activity.engagement.${activity.engagement_level}`) }}
      </span>
    </div>

    <!-- Stats grid -->
    <div class="grid grid-cols-2 gap-3">
      <div class="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
        <p class="text-lg font-bold text-gray-900 dark:text-white">
          {{ activity.total_transfers }}
        </p>
        <p class="text-[10px] text-gray-500 dark:text-gray-400">
          {{ t('managers.activity.totalTransfers') }}
        </p>
      </div>

      <div class="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
        <p class="text-lg font-bold text-gray-900 dark:text-white">
          {{ activity.transfers_per_week.toFixed(1) }}
        </p>
        <p class="text-[10px] text-gray-500 dark:text-gray-400">
          {{ t('managers.activity.transfersPerWeek') }}
        </p>
      </div>

      <div class="text-center p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
        <p class="text-lg font-bold text-emerald-600 dark:text-emerald-400">
          {{ activity.buys }}
        </p>
        <p class="text-[10px] text-gray-500 dark:text-gray-400">
          {{ t('managers.activity.buys') }}
        </p>
      </div>

      <div class="text-center p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
        <p class="text-lg font-bold text-red-600 dark:text-red-400">
          {{ activity.sells }}
        </p>
        <p class="text-[10px] text-gray-500 dark:text-gray-400">
          {{ t('managers.activity.sells') }}
        </p>
      </div>
    </div>

    <!-- Last transfer -->
    <div class="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
      <span class="text-xs text-gray-500 dark:text-gray-400">
        {{ t('managers.activity.lastTransfer') }}
      </span>
      <span class="text-xs font-medium text-gray-700 dark:text-gray-300">
        {{ lastTransferText }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ManagerActivity } from '@/types/league'

const props = defineProps<{
  activity: ManagerActivity
}>()

const { t } = useI18n()

const engagementClass = computed(() => {
  const level = props.activity.engagement_level
  switch (level) {
    case 'very_active':
      return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
    case 'active':
      return 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300'
    case 'moderate':
      return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
    case 'passive':
      return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
    case 'inactive':
      return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
    default:
      return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
  }
})

const lastTransferText = computed(() => {
  const days = props.activity.days_since_last_transfer
  if (days === 0) return t('managers.activity.today')
  return t('managers.activity.daysAgo', { days })
})
</script>
