<template>
  <div
    class="flex-shrink-0 flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-gray-700
           cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-accent/50 transition-all hover:scale-105 touch-none"
  >
    <img
      :src="player.profile_image"
      :alt="player.name"
      class="w-10 h-10 rounded-full object-cover pointer-events-none"
    />
    <div class="hidden lg:block min-w-0">
      <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
        {{ player.name }}
      </p>
      <p class="text-xs text-gray-500 dark:text-gray-400">
        {{ player.total_points }} pts
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PlayerSummary } from '@/types/dashboard'

defineProps<{
  player: PlayerSummary
}>()
</script>
