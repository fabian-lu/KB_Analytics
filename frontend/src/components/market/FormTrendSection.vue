<template>
  <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
    <!-- Header -->
    <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="text-lg">{{ variant === 'hot' ? '🔥' : '❄️' }}</span>
        <h3 class="text-sm md:text-base font-semibold text-gray-900 dark:text-white">
          {{ variant === 'hot' ? t('analysis.hotForm') : t('analysis.coldStreaks') }}
        </h3>
      </div>
      <span class="text-xs text-gray-400 dark:text-gray-500">
        {{ t('analysis.formVsSeason') }}
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
            {{ item.player.team_short_name }}
          </div>
        </div>

        <!-- Form vs Season -->
        <div class="text-right">
          <div class="text-sm font-semibold" :class="variant === 'hot' ? 'text-emerald-500' : 'text-red-500'">
            {{ item.player.form.toFixed(1) }}
          </div>
          <div class="text-[10px] text-gray-400 dark:text-gray-500">
            {{ t('analysis.season') }}: {{ item.player.season_avg.toFixed(1) }}
          </div>
        </div>

        <!-- Diff badge -->
        <div
          class="flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium"
          :class="variant === 'hot'
            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
            : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'"
        >
          {{ variant === 'hot' ? '+' : '' }}{{ item.formDiff.toFixed(1) }}
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
import type { FormPlayer } from '@/types/analysis'
import { POSITION_COLORS } from '@/types/player'

const props = defineProps<{
  allPlayers: MarketPlayer[]
  variant: 'hot' | 'cold'
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

const players = computed<FormPlayer[]>(() => {
  const limit = props.limit ?? 5

  // Calculate form difference (form - season_avg)
  const withDiff = props.allPlayers
    .filter(p => p.status === 'fit') // Only fit players
    .map(p => ({
      player: p,
      formDiff: p.form - p.season_avg,
    }))

  if (props.variant === 'hot') {
    // Rising form: positive diff, sorted by highest diff
    return withDiff
      .filter(p => p.formDiff > 0)
      .sort((a, b) => b.formDiff - a.formDiff)
      .slice(0, limit)
  } else {
    // Cold streaks: negative diff, sorted by most negative
    return withDiff
      .filter(p => p.formDiff < 0)
      .sort((a, b) => a.formDiff - b.formDiff)
      .slice(0, limit)
  }
})
</script>
