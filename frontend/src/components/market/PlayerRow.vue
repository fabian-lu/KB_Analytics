<template>
  <button
    class="w-full flex items-center gap-2.5 px-3 py-2.5 md:px-4 md:py-3.5 lg:px-5 lg:py-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-cyan-300 dark:hover:border-cyan-700 hover:shadow-sm transition-all text-left cursor-pointer"
    @click="$emit('click')"
  >
    <!-- Position badge -->
    <span
      class="flex-shrink-0 w-9 md:w-11 text-center text-[10px] md:text-xs font-bold uppercase tracking-wide py-0.5 md:py-1 rounded-md text-white"
      :class="POSITION_COLORS[player.position].bg"
    >
      {{ t(`position.${posKey}`) }}
    </span>

    <!-- Avatar + team logo -->
    <div class="relative flex-shrink-0 group/avatar cursor-pointer" @click.stop="$emit('imageClick')">
      <img
        :src="player.profile_image"
        :alt="player.name"
        class="w-9 h-9 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full object-cover bg-gray-200 dark:bg-gray-700 transition-transform duration-150 group-hover/avatar:scale-110 group-hover/avatar:ring-2 group-hover/avatar:ring-cyan-400"
      />
      <img
        :src="player.team_logo"
        :alt="player.team_short_name"
        class="absolute -bottom-0.5 -right-0.5 w-4 h-4 md:w-5 md:h-5 rounded-full bg-white dark:bg-gray-800 ring-1 ring-white dark:ring-gray-800 object-contain"
      />
    </div>

    <!-- Name + team + badges -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-1 md:gap-1.5">
        <span class="text-sm md:text-base lg:text-lg font-semibold text-gray-900 dark:text-white truncate">
          {{ player.name }}
        </span>
        <!-- Status dot -->
        <span
          v-if="player.status !== 'fit'"
          class="flex-shrink-0 w-2 h-2 md:w-2.5 md:h-2.5 rounded-full"
          :class="statusDotColor"
          :title="player.status_note || player.status"
        />
        <!-- Flag badges -->
        <span v-if="player.is_set_piece_taker" class="flex-shrink-0 text-[10px] md:text-xs" title="Set piece taker">⚽</span>
        <span v-if="player.is_new_signing" class="flex-shrink-0 text-[9px] md:text-[11px] font-bold text-cyan-500" :title="t('marketPlayers.newSigning')">NEW</span>
        <span v-if="player.is_comeback" class="flex-shrink-0 text-[10px] md:text-xs" :title="t('marketPlayers.comeback')">🔄</span>
        <span v-if="player.rotation_risk" class="flex-shrink-0 text-[10px] md:text-xs" :title="t('marketPlayers.rotationRisk')">⚠️</span>
      </div>
      <div class="flex items-center gap-1 text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate">
        <span>{{ player.team_name }}</span>
        <span v-if="player.status !== 'fit'" class="text-[10px] md:text-xs">
          · <span :class="statusTextColor">{{ player.status_note || player.status }}</span>
        </span>
      </div>
    </div>

    <!-- Stats columns -->
    <div class="flex items-center gap-2 md:gap-5 lg:gap-6 flex-shrink-0 text-right">
      <!-- Market value + trend (mobile: compact) -->
      <div class="min-w-[68px] sm:min-w-[80px] md:min-w-[100px]">
        <div class="text-sm md:text-base lg:text-lg font-semibold text-gray-900 dark:text-white">
          {{ formatMoney(player.market_value) }}
        </div>
        <div class="flex items-center justify-end gap-0.5">
          <span
            class="text-[10px] md:text-xs font-medium"
            :class="player.value_change_7d >= 0 ? 'text-emerald-500' : 'text-red-500'"
          >
            {{ player.value_change_7d >= 0 ? '▲' : '▼' }}
            {{ formatMoneyCompact(Math.abs(player.value_change_7d)) }}
          </span>
        </div>
      </div>

      <!-- Avg points -->
      <div class="min-w-[36px] md:min-w-[48px]">
        <div class="text-sm md:text-base lg:text-lg font-semibold text-gray-900 dark:text-white">{{ player.avg_points }}</div>
        <div class="text-[10px] md:text-xs text-gray-400 dark:text-gray-500">{{ t('marketPlayers.avg') }}</div>
      </div>

      <!-- PPM (hidden on small mobile) -->
      <div class="hidden sm:block min-w-[36px] md:min-w-[48px]">
        <div class="text-sm md:text-base lg:text-lg font-semibold text-gray-900 dark:text-white">{{ player.ppm }}</div>
        <div class="text-[10px] md:text-xs text-gray-400 dark:text-gray-500">{{ t('marketPlayers.ppm') }}</div>
      </div>

      <!-- Raw Points (desktop only) -->
      <div class="hidden lg:block min-w-[48px]">
        <div class="text-base lg:text-lg font-semibold text-gray-900 dark:text-white">{{ player.raw_points_avg }}</div>
        <div class="text-xs text-gray-400 dark:text-gray-500">{{ t('marketPlayers.rawPts') }}</div>
      </div>

      <!-- Stability (desktop only) -->
      <div class="hidden lg:block min-w-[48px]">
        <div class="text-base lg:text-lg font-semibold text-gray-900 dark:text-white">{{ player.stability }}</div>
        <div class="text-xs text-gray-400 dark:text-gray-500">σ</div>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { POSITION_COLORS } from '@/types/player'
import type { MarketPlayer } from '@/types/market'

const props = defineProps<{
  player: MarketPlayer
}>()

defineEmits<{
  click: []
  imageClick: []
}>()

const { t } = useI18n()

const posKey = computed(() => {
  const map: Record<number, string> = { 1: 'gk', 2: 'def', 3: 'mid', 4: 'fwd' }
  return map[props.player.position] || 'gk'
})

const statusDotColor = computed(() => {
  switch (props.player.status) {
    case 'injured': return 'bg-red-500'
    case 'suspended': return 'bg-orange-500'
    case 'doubt': return 'bg-yellow-500'
    default: return 'bg-gray-400'
  }
})

const statusTextColor = computed(() => {
  switch (props.player.status) {
    case 'injured': return 'text-red-500'
    case 'suspended': return 'text-orange-500'
    case 'doubt': return 'text-yellow-500'
    default: return ''
  }
})

function formatMoney(value: number) {
  const abs = Math.abs(value)
  const sign = value < 0 ? '-' : ''
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(1)}M €`
  if (abs >= 1_000) return `${sign}${(abs / 1_000).toFixed(0)}K €`
  return `${sign}${abs} €`
}

function formatMoneyCompact(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`
  return `${value}`
}
</script>
