<template>
  <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
    <!-- Header -->
    <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="text-lg">⭐</span>
        <h3 class="text-sm md:text-base font-semibold text-gray-900 dark:text-white">
          {{ t('analysis.breakoutCandidates') }}
        </h3>
      </div>
      <span class="text-xs text-gray-400 dark:text-gray-500">
        {{ t('analysis.youngRising') }}
      </span>
    </div>

    <!-- Players list -->
    <div class="divide-y divide-gray-100 dark:divide-gray-800">
      <button
        v-for="player in candidates"
        :key="player.id"
        class="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
        @click="$emit('playerClick', player)"
      >
        <!-- Player image -->
        <div class="relative flex-shrink-0">
          <img
            :src="player.profile_image"
            :alt="player.name"
            class="w-10 h-10 rounded-full object-cover bg-gray-200 dark:bg-gray-700"
          />
          <span
            class="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
            :class="POSITION_COLORS[player.position].bg"
          >
            {{ positionLabel(player.position) }}
          </span>
        </div>

        <!-- Player info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-gray-900 dark:text-white truncate">
              {{ player.name }}
            </span>
            <span class="text-[10px] px-1.5 py-0.5 rounded bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 font-medium">
              {{ player.age }} {{ t('analysis.years') }}
            </span>
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400 truncate">
            {{ player.team_short_name }} · {{ formatMoney(player.market_value) }}
          </div>
        </div>

        <!-- Stats -->
        <div class="text-right flex-shrink-0">
          <div class="text-sm font-medium text-gray-900 dark:text-white">
            {{ player.avg_points }} {{ t('analysis.pts') }}
          </div>
          <div class="flex items-center gap-1 justify-end">
            <span
              class="text-xs"
              :class="player.form_trend.includes('rising') ? 'text-emerald-500' : 'text-gray-400'"
            >
              {{ t(`player.form.${player.form_trend}`) }}
            </span>
            <span
              v-if="player.form_trend.includes('rising')"
              class="text-emerald-500 text-xs"
            >
              ↑
            </span>
          </div>
        </div>

        <!-- Value change badge -->
        <div
          class="flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium"
          :class="player.value_change_7d >= 0
            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
            : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'"
        >
          {{ player.value_change_7d >= 0 ? '+' : '' }}{{ formatMoneyCompact(player.value_change_7d) }}
        </div>
      </button>

      <!-- Empty state -->
      <div v-if="candidates.length === 0" class="px-4 py-8 text-center text-sm text-gray-400 dark:text-gray-500">
        {{ t('analysis.noPlayers') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { MarketPlayer } from '@/types/market'
import { POSITION_COLORS } from '@/types/player'

const props = defineProps<{
  allPlayers: MarketPlayer[]
  maxAge?: number
  maxValue?: number
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

const candidates = computed(() => {
  const maxAge = props.maxAge ?? 24
  const maxValue = props.maxValue ?? 20_000_000 // Under 20M
  const limit = props.limit ?? 5

  return props.allPlayers
    .filter(p =>
      p.age <= maxAge &&
      p.market_value <= maxValue &&
      p.status === 'fit' &&
      (p.form_trend === 'rising' || p.form_trend === 'rising_slight') &&
      p.value_change_7d > 0
    )
    .sort((a, b) => {
      // Score by combination of form improvement and value increase
      const scoreA = (a.form - a.season_avg) + (a.value_change_7d / 100000)
      const scoreB = (b.form - b.season_avg) + (b.value_change_7d / 100000)
      return scoreB - scoreA
    })
    .slice(0, limit)
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
