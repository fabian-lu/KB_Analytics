<template>
  <div class="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
    <!-- Player image -->
    <img
      :src="player.profile_image"
      :alt="player.name"
      class="w-10 h-10 rounded-full object-cover"
    />

    <!-- Player info -->
    <div class="flex-1 min-w-0">
      <p class="font-medium text-gray-900 dark:text-white truncate">
        {{ player.name }}
      </p>
      <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
        {{ player.team_name }}
      </p>
    </div>

    <!-- €/point stat -->
    <div class="text-right">
      <p class="font-bold" :class="valueClass">
        {{ formatEurosPerPoint(player.euros_per_point) }}
      </p>
      <p class="text-xs text-gray-500 dark:text-gray-400">
        €/pt
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PlayerSummary } from '@/types/dashboard'

const props = defineProps<{
  player: PlayerSummary
  type: 'best' | 'worst'
}>()

const valueClass = computed(() => {
  return props.type === 'best'
    ? 'text-green-600 dark:text-green-400'
    : 'text-red-600 dark:text-red-400'
})

function formatEurosPerPoint(value: number | null) {
  if (value === null) return '—'
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}
</script>
