<template>
  <div :class="readonly ? '' : 'touch-none'">
    <!-- Mobile: Circle with last name -->
    <div
      class="lg:hidden flex flex-col items-center transition-transform"
      :class="readonly ? '' : 'cursor-grab active:cursor-grabbing hover:scale-110'"
    >
      <div class="relative">
        <img
          :src="player.profile_image"
          :alt="player.name"
          class="w-10 h-10 md:w-14 md:h-14 rounded-full ring-2 object-cover bg-gray-300"
          :class="highlight ? 'ring-amber-400' : 'ring-white/60'"
        />
        <span
          v-if="highlight"
          class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center text-[7px] font-bold text-amber-900"
        >
          &#9733;
        </span>
      </div>
      <span class="mt-1 text-[9px] md:text-xs text-white font-medium drop-shadow-md max-w-[60px] md:max-w-[80px] truncate text-center">
        {{ lastName }}
      </span>
    </div>

    <!-- Desktop: Card with details (vertical layout) -->
    <div
      class="hidden lg:flex flex-col items-center p-2 rounded-lg backdrop-blur-sm shadow-md w-20 transition-transform"
      :class="[
        readonly ? '' : 'cursor-grab active:cursor-grabbing hover:scale-105',
        highlight ? 'bg-amber-400/30 ring-2 ring-amber-400' : 'bg-white/20',
      ]"
    >
      <!-- Player image with team logo overlay -->
      <div class="relative">
        <img
          :src="player.profile_image"
          :alt="player.name"
          class="w-12 h-12 rounded-full object-cover bg-gray-300"
        />
        <img
          v-if="player.team_logo"
          :src="player.team_logo"
          :alt="player.team_name"
          class="absolute -bottom-1 -right-1 w-5 h-5 object-contain bg-white rounded-full p-0.5"
        />
        <span
          v-if="highlight"
          class="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-[8px] font-bold text-amber-900"
        >
          &#9733;
        </span>
      </div>

      <!-- Name + Position badge -->
      <div class="flex items-center gap-1 mt-1.5">
        <span class="text-xs font-semibold text-white truncate max-w-[50px]">{{ lastName }}</span>
        <span class="px-1 py-0.5 text-[9px] font-bold rounded bg-white/20 text-white">
          {{ positionLabel }}
        </span>
      </div>

      <!-- Stats -->
      <div class="flex flex-col items-center text-xs text-white/90 mt-1">
        <span>&Oslash; {{ player.avg_points.toFixed(0) }} pts</span>
        <span>{{ formatValue(player.market_value) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PlayerSummary } from '@/types/dashboard'

const props = defineProps<{
  player: PlayerSummary
  readonly?: boolean
  highlight?: boolean
}>()

const lastName = computed(() => {
  const parts = props.player.name.split(' ')
  return parts[parts.length - 1]
})

const positionLabel = computed(() => {
  const labels: Record<number, string> = { 1: 'GK', 2: 'DF', 3: 'MF', 4: 'FW' }
  return labels[props.player.position] || '??'
})

function formatValue(value: number): string {
  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(1) + 'M'
  }
  if (value >= 1_000) {
    return (value / 1_000).toFixed(0) + 'K'
  }
  return value.toString()
}
</script>
