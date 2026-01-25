<template>
  <div class="flex items-start gap-4">
    <!-- Player image with position gradient -->
    <div
      class="relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden"
      :class="`bg-gradient-to-br ${positionGradient}`"
    >
      <img
        :src="player.profile_image"
        :alt="player.name"
        class="absolute inset-1 w-[calc(100%-8px)] h-[calc(100%-8px)] rounded-lg object-cover"
      />
      <!-- Position badge -->
      <span
        class="absolute bottom-1 right-1 px-1.5 py-0.5 text-[10px] font-bold rounded text-white"
        :class="positionBg"
      >
        {{ positionLabel }}
      </span>
    </div>

    <!-- Player info -->
    <div class="flex-1 min-w-0 pt-1">
      <h2 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate pr-8">
        {{ player.name }}
      </h2>
      <div class="flex items-center gap-2 mt-0.5">
        <img :src="player.team.logo" :alt="player.team.name" class="w-4 h-4" />
        <span class="text-sm text-gray-600 dark:text-gray-400 truncate">{{ player.team.name }}</span>
        <span v-if="player.jersey_number" class="text-sm text-gray-400 dark:text-gray-500">
          #{{ player.jersey_number }}
        </span>
      </div>

      <!-- Status badge + mobile stats -->
      <div class="flex items-center gap-2 mt-2 flex-wrap">
        <span
          class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
          :class="statusClasses"
        >
          <span class="w-1.5 h-1.5 rounded-full" :class="statusDotClass" />
          {{ t(`player.status.${player.status}`) }}
        </span>
        <!-- Mobile inline stats -->
        <div class="flex sm:hidden items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <span class="font-semibold text-gray-900 dark:text-white">{{ formatValue(player.value.current) }}</span>
          <span class="text-gray-300 dark:text-gray-600">|</span>
          <span><span class="font-semibold text-gray-900 dark:text-white">{{ player.current_season.total_points }}</span> pts</span>
          <span class="text-gray-300 dark:text-gray-600">|</span>
          <span>Ø <span class="font-semibold text-gray-900 dark:text-white">{{ player.current_season.avg_points.toFixed(1) }}</span></span>
        </div>
        <span v-if="player.status_note" class="text-xs text-gray-500 dark:text-gray-400 truncate hidden sm:inline">
          {{ player.status_note }}
        </span>
      </div>
    </div>

    <!-- Key stats (desktop only) -->
    <div class="hidden sm:flex items-center gap-3">
      <div class="text-center px-3">
        <p class="text-lg font-bold text-gray-900 dark:text-white">{{ formatValue(player.value.current) }}</p>
        <p class="text-[10px] text-gray-500 dark:text-gray-400 uppercase">{{ t('player.value') }}</p>
        <TrendBadge :value="player.value.change_7d" :percentage="player.value.change_7d_pct" size="sm" />
      </div>
      <div class="text-center px-3 border-l border-gray-200 dark:border-gray-700">
        <p class="text-lg font-bold text-gray-900 dark:text-white">{{ player.current_season.total_points }}</p>
        <p class="text-[10px] text-gray-500 dark:text-gray-400 uppercase">{{ t('player.points') }}</p>
      </div>
      <div class="text-center px-3 border-l border-gray-200 dark:border-gray-700">
        <p class="text-lg font-bold text-gray-900 dark:text-white">{{ player.current_season.avg_points.toFixed(1) }}</p>
        <p class="text-[10px] text-gray-500 dark:text-gray-400 uppercase">{{ t('player.avgShort') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import TrendBadge from './shared/TrendBadge.vue'
import { POSITION_LABELS, POSITION_COLORS } from '@/types/player'
import type { PlayerDetail } from '@/types/player'

const props = defineProps<{
  player: PlayerDetail
}>()

const { t } = useI18n()

const positionLabel = computed(() => POSITION_LABELS[props.player.position] || '?')
const positionGradient = computed(() => POSITION_COLORS[props.player.position]?.gradient || 'from-gray-400 to-gray-600')
const positionBg = computed(() => POSITION_COLORS[props.player.position]?.bg || 'bg-gray-500')

const statusClasses = computed(() => {
  switch (props.player.status) {
    case 'fit':
      return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
    case 'injured':
      return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
    case 'suspended':
      return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
    case 'doubt':
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
    default:
      return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
  }
})

const statusDotClass = computed(() => {
  switch (props.player.status) {
    case 'fit':
      return 'bg-green-500'
    case 'injured':
      return 'bg-red-500'
    case 'suspended':
      return 'bg-orange-500'
    case 'doubt':
      return 'bg-yellow-500'
    default:
      return 'bg-gray-400'
  }
})

function formatValue(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(0)}K`
  }
  return value.toString()
}
</script>
