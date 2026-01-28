<template>
  <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
    <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
      {{ t('managers.achievements.title') }}
    </h3>

    <div v-if="achievements.length === 0" class="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
      {{ t('managers.achievements.noAchievements') }}
    </div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <div
        v-for="ach in achievements"
        :key="ach.id"
        class="relative flex flex-col items-center p-3 rounded-lg border transition-all hover:shadow-md"
        :class="levelBorderClass(ach.level)"
      >
        <!-- Level indicator ribbon -->
        <div
          class="absolute top-0 right-0 px-1.5 py-0.5 text-[9px] font-bold uppercase rounded-bl-lg rounded-tr-lg"
          :class="levelBadgeClass(ach.level)"
        >
          {{ levelLabel(ach.level) }}
        </div>

        <!-- Icon -->
        <span class="text-2xl mb-1.5">{{ ach.icon }}</span>

        <!-- Name -->
        <p class="text-xs font-medium text-gray-900 dark:text-white text-center">
          {{ ach.name }}
        </p>

        <!-- Description -->
        <p class="text-[10px] text-gray-500 dark:text-gray-400 text-center mt-1 line-clamp-2">
          {{ ach.description }}
        </p>

        <!-- Earned date -->
        <p class="text-[9px] text-gray-400 mt-2">
          {{ formatDate(ach.earned_at) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { KickbaseAchievement } from '@/types/league'

defineProps<{
  achievements: KickbaseAchievement[]
}>()

const { t } = useI18n()

function levelLabel(level: 1 | 2 | 3): string {
  if (level === 1) return t('managers.achievements.level1')
  if (level === 2) return t('managers.achievements.level2')
  return t('managers.achievements.level3')
}

function levelBorderClass(level: 1 | 2 | 3): string {
  if (level === 1) return 'border-orange-300 dark:border-orange-700 bg-orange-50/50 dark:bg-orange-900/10'
  if (level === 2) return 'border-gray-300 dark:border-gray-500 bg-gray-50/50 dark:bg-gray-800/50'
  return 'border-amber-400 dark:border-amber-600 bg-amber-50/50 dark:bg-amber-900/10'
}

function levelBadgeClass(level: 1 | 2 | 3): string {
  if (level === 1) return 'bg-orange-400 text-orange-900'
  if (level === 2) return 'bg-gray-300 text-gray-700 dark:bg-gray-500 dark:text-gray-100'
  return 'bg-amber-400 text-amber-900'
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate)
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
</script>
