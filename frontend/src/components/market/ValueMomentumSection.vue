<template>
  <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
    <!-- Header -->
    <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="text-lg">{{ variant === 'accelerating' ? '🚀' : '📉' }}</span>
        <h3 class="text-sm md:text-base font-semibold text-gray-900 dark:text-white">
          {{ variant === 'accelerating' ? t('analysis.accelerating') : t('analysis.decelerating') }}
        </h3>
      </div>
      <span class="text-xs text-gray-400 dark:text-gray-500">
        {{ t('analysis.valueChange') }}
      </span>
    </div>

    <!-- Players list -->
    <div class="divide-y divide-gray-100 dark:divide-gray-800">
      <button
        v-for="item in players"
        :key="item.player.id"
        class="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
        @click="$emit('playerClick', item.player)"
      >
        <!-- Player image -->
        <div class="relative flex-shrink-0">
          <img
            :src="item.player.profile_image"
            :alt="item.player.name"
            class="w-10 h-10 rounded-full object-cover bg-gray-200 dark:bg-gray-700"
          />
          <span
            class="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
            :class="POSITION_COLORS[item.player.position].bg"
          >
            {{ positionLabel(item.player.position) }}
          </span>
        </div>

        <!-- Player info -->
        <div class="flex-1 min-w-0">
          <div class="text-sm font-medium text-gray-900 dark:text-white truncate">
            {{ item.player.name }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400 truncate">
            {{ item.player.team_short_name }} · {{ formatMoney(item.player.market_value) }}
          </div>
        </div>

        <!-- Value changes -->
        <div class="text-right flex-shrink-0">
          <div class="flex items-center gap-2 justify-end">
            <span class="text-[10px] text-gray-400">7d</span>
            <span
              class="text-xs font-medium"
              :class="item.change7d >= 0 ? 'text-emerald-500' : 'text-red-500'"
            >
              {{ item.change7d >= 0 ? '+' : '' }}{{ formatMoneyCompact(item.change7d) }}
            </span>
          </div>
          <div class="flex items-center gap-2 justify-end mt-0.5">
            <span class="text-[10px] text-gray-400">30d</span>
            <span
              class="text-xs font-medium"
              :class="item.change30d >= 0 ? 'text-emerald-500' : 'text-red-500'"
            >
              {{ item.change30d >= 0 ? '+' : '' }}{{ formatMoneyCompact(item.change30d) }}
            </span>
          </div>
        </div>

        <!-- Acceleration indicator -->
        <div
          class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
          :class="variant === 'accelerating'
            ? 'bg-emerald-100 dark:bg-emerald-900/30'
            : 'bg-red-100 dark:bg-red-900/30'"
        >
          <span class="text-sm">{{ variant === 'accelerating' ? '↗' : '↘' }}</span>
        </div>
      </button>

      <!-- Empty state -->
      <div v-if="players.length === 0" class="px-4 py-8 text-center text-sm text-gray-400 dark:text-gray-500">
        {{ t('analysis.noPlayers') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { MarketPlayer } from '@/types/market'
import type { ValueMomentumPlayer } from '@/types/analysis'
import { POSITION_COLORS } from '@/types/player'

const props = defineProps<{
  allPlayers: MarketPlayer[]
  variant: 'accelerating' | 'decelerating'
  limit?: number
}>()

defineEmits<{
  playerClick: [player: MarketPlayer]
}>()

const { t } = useI18n()

const positionLabel = (pos: number) => {
  const labels: Record<number, string> = { 1: 'G', 2: 'D', 3: 'M', 4: 'F' }
  return labels[pos] || '?'
}

const players = computed<ValueMomentumPlayer[]>(() => {
  const limit = props.limit ?? 5

  // Calculate acceleration: compare 7d daily rate vs 30d daily rate
  const withMomentum = props.allPlayers.map(p => {
    const dailyRate7d = p.value_change_7d / 7
    const dailyRate30d = p.value_change_30d / 30
    const acceleration = dailyRate7d - dailyRate30d // Positive = accelerating

    return {
      player: p,
      momentum: acceleration > 0 ? 'accelerating' : 'decelerating',
      change7d: p.value_change_7d,
      change30d: p.value_change_30d,
      acceleration,
    } as ValueMomentumPlayer
  })

  if (props.variant === 'accelerating') {
    // Rising faster than before (positive acceleration)
    return withMomentum
      .filter(p => p.acceleration > 0 && p.change7d > 0)
      .sort((a, b) => b.acceleration - a.acceleration)
      .slice(0, limit)
  } else {
    // Falling faster than before (negative acceleration)
    return withMomentum
      .filter(p => p.acceleration < 0)
      .sort((a, b) => a.acceleration - b.acceleration)
      .slice(0, limit)
  }
})

function formatMoney(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M €`
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K €`
  return `${value} €`
}

function formatMoneyCompact(value: number): string {
  const abs = Math.abs(value)
  const sign = value < 0 ? '-' : ''
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `${sign}${(abs / 1_000).toFixed(0)}K`
  return `${sign}${abs}`
}
</script>
