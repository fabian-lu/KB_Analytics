<template>
  <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 md:p-6">
    <div class="flex flex-col sm:flex-row items-center sm:items-start gap-4">
      <!-- Large Avatar -->
      <div class="relative flex-shrink-0">
        <img
          :src="profile.manager.profile_image"
          :alt="profile.manager.name"
          class="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover ring-4 ring-cyan-100 dark:ring-cyan-900"
        />
        <!-- Rank badge -->
        <div
          class="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg"
          :class="rankBadgeClass"
        >
          {{ profile.rank }}
        </div>
      </div>

      <!-- Name and rank text -->
      <div class="text-center sm:text-left flex-1">
        <h2 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          {{ profile.manager.name }}
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {{ t('managers.rankNum', { num: profile.rank }) }}
        </p>
      </div>
    </div>

    <!-- Stats row -->
    <div class="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-gray-100 dark:border-gray-800">
      <div class="text-center">
        <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('managers.teamValue') }}</p>
        <p class="text-lg md:text-xl font-bold text-gray-900 dark:text-white mt-0.5">
          {{ formatMoney(profile.team_value) }}
        </p>
      </div>
      <div class="text-center">
        <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('managers.budget') }}</p>
        <p class="text-lg md:text-xl font-bold text-gray-900 dark:text-white mt-0.5">
          {{ formatMoney(profile.budget) }}
        </p>
      </div>
      <div class="text-center">
        <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('managers.totalPoints') }}</p>
        <p class="text-lg md:text-xl font-bold text-cyan-600 dark:text-cyan-400 mt-0.5">
          {{ profile.total_points.toLocaleString() }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ManagerProfile } from '@/types/league'

const props = defineProps<{
  profile: ManagerProfile
}>()

const { t } = useI18n()

const rankBadgeClass = computed(() => {
  if (props.profile.rank === 1) return 'bg-amber-400 text-amber-900'
  if (props.profile.rank === 2) return 'bg-gray-300 text-gray-700'
  if (props.profile.rank === 3) return 'bg-orange-400 text-orange-900'
  return 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
})

function formatMoney(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`
  }
  return `${(value / 1000).toFixed(0)}K`
}
</script>
