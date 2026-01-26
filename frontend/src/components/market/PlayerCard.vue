<template>
  <button
    class="w-full flex flex-col rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-cyan-300 dark:hover:border-cyan-700 hover:shadow-md transition-all text-left cursor-pointer overflow-hidden"
    @click="$emit('click')"
  >
    <!-- Header: position + flags + status -->
    <div class="flex items-center justify-between px-3 md:px-4 pt-3 md:pt-4 pb-1">
      <div class="flex items-center gap-1.5 md:gap-2">
        <span
          class="text-[10px] md:text-xs font-bold uppercase tracking-wide px-2 md:px-2.5 py-0.5 md:py-1 rounded-md text-white"
          :class="POSITION_COLORS[player.position].bg"
        >
          {{ t(`position.${posKey}`) }}
        </span>
        <!-- Flag badges -->
        <span v-if="player.is_set_piece_taker" class="text-[10px] md:text-sm" :title="t('marketPlayers.setPiece')">⚽</span>
        <span v-if="player.is_new_signing" class="text-[8px] md:text-[10px] font-bold px-1 md:px-1.5 py-px rounded bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400">NEW</span>
        <span v-if="player.is_comeback" class="text-[10px] md:text-sm" :title="t('marketPlayers.comeback')">🔄</span>
        <span v-if="player.rotation_risk" class="text-[10px] md:text-sm" :title="t('marketPlayers.rotationRisk')">⚠️</span>
      </div>
      <span
        v-if="player.status !== 'fit'"
        class="text-[10px] md:text-xs font-medium px-2 md:px-2.5 py-0.5 md:py-1 rounded-full"
        :class="statusBadge"
      >
        {{ t(`player.status.${player.status}`) }}
      </span>
      <span
        v-else
        class="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-emerald-500"
        :title="t('player.status.fit')"
      />
    </div>

    <!-- Player info with team logo -->
    <div class="flex items-center gap-3 md:gap-4 px-3 md:px-4 pb-1 md:pb-2">
      <div class="relative flex-shrink-0">
        <img
          :src="player.profile_image"
          :alt="player.name"
          class="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover bg-gray-200 dark:bg-gray-700"
        />
        <img
          :src="player.team_logo"
          :alt="player.team_short_name"
          class="absolute -bottom-0.5 -right-0.5 w-5 h-5 md:w-6 md:h-6 rounded-full bg-white dark:bg-gray-800 ring-1 ring-white dark:ring-gray-800 object-contain"
        />
      </div>
      <div class="min-w-0">
        <div class="text-sm md:text-base lg:text-lg font-semibold text-gray-900 dark:text-white truncate">{{ player.name }}</div>
        <div class="text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate">{{ player.team_name }}</div>
        <div v-if="player.status_note" class="text-[10px] md:text-xs truncate" :class="statusTextColor">{{ player.status_note }}</div>
      </div>
    </div>

    <!-- Value + trend badges (1d / 7d / 30d) -->
    <div class="px-3 md:px-4 pb-2 md:pb-3">
      <div class="text-base md:text-lg lg:text-xl font-bold text-gray-900 dark:text-white">
        {{ formatMoney(player.market_value) }}
      </div>
      <div class="flex items-center gap-2 md:gap-2.5 mt-0.5 md:mt-1">
        <ValueBadge :value="player.value_change_1d" label="1d" />
        <ValueBadge :value="player.value_change_7d" label="7d" />
        <ValueBadge :value="player.value_change_30d" label="30d" />
      </div>
      <!-- Friday projection -->
      <div class="text-[10px] md:text-xs text-gray-400 dark:text-gray-500 mt-0.5 md:mt-1">
        {{ t('marketPlayers.fridayProj') }}: {{ formatMoney(player.friday_projection) }}
      </div>
    </div>

    <!-- Stats grid: 3 columns x 2 rows -->
    <div class="grid grid-cols-3 gap-px bg-gray-100 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-800">
      <StatCell :value="player.avg_points" :label="t('marketPlayers.avg')" />
      <StatCell :value="player.ppm" :label="t('marketPlayers.ppm')" />
      <StatCell :value="`${player.goals}/${player.assists}`" :label="t('marketPlayers.goalsAssists')" />
      <StatCell :value="player.raw_points_avg" :label="t('marketPlayers.rawPts')" />
      <StatCell :value="player.stability" label="σ" />
      <StatCell :value="player.points_per_minute.toFixed(2)" :label="t('marketPlayers.ptsMn')" />
    </div>

    <!-- Form bar -->
    <div class="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 md:py-2 border-t border-gray-100 dark:border-gray-800">
      <span class="text-[10px] md:text-xs text-gray-400 dark:text-gray-500 uppercase w-8 md:w-10">{{ t('marketPlayers.form') }}</span>
      <div class="flex-1 h-1.5 md:h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <div
          class="h-full rounded-full transition-all"
          :class="formBarColor"
          :style="{ width: `${formBarWidth}%` }"
        />
      </div>
      <span class="text-[11px] md:text-sm font-semibold w-7 md:w-9 text-right" :class="formTextColor">
        {{ player.form }}
      </span>
    </div>

    <!-- Home / Away split -->
    <div class="flex items-center gap-1 md:gap-2 px-3 md:px-4 pb-2 md:pb-3 text-[10px] md:text-xs">
      <span class="text-gray-400 dark:text-gray-500 uppercase w-8 md:w-10">{{ t('marketPlayers.homeAway') }}</span>
      <span class="font-medium text-gray-700 dark:text-gray-300">{{ t('marketPlayers.home') }} {{ player.home_avg }}</span>
      <span class="text-gray-300 dark:text-gray-600">/</span>
      <span class="font-medium text-gray-700 dark:text-gray-300">{{ t('marketPlayers.away') }} {{ player.away_avg }}</span>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed, defineComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { POSITION_COLORS } from '@/types/player'
import type { MarketPlayer } from '@/types/market'

const props = defineProps<{
  player: MarketPlayer
}>()

defineEmits<{
  click: []
}>()

const { t } = useI18n()

const posKey = computed(() => {
  const map: Record<number, string> = { 1: 'gk', 2: 'def', 3: 'mid', 4: 'fwd' }
  return map[props.player.position] || 'gk'
})

const statusBadge = computed(() => {
  switch (props.player.status) {
    case 'injured': return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
    case 'suspended': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
    case 'doubt': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
    default: return 'bg-gray-100 dark:bg-gray-800 text-gray-500'
  }
})

const statusTextColor = computed(() => {
  switch (props.player.status) {
    case 'injured': return 'text-red-500'
    case 'suspended': return 'text-orange-500'
    case 'doubt': return 'text-yellow-500'
    default: return 'text-gray-500'
  }
})

const formBarWidth = computed(() => Math.min(100, Math.max(0, (props.player.form / 60) * 100)))

const formBarColor = computed(() => {
  if (props.player.form_trend === 'rising' || props.player.form_trend === 'rising_slight') return 'bg-emerald-500'
  if (props.player.form_trend === 'falling' || props.player.form_trend === 'falling_slight') return 'bg-red-500'
  return 'bg-cyan-500'
})

const formTextColor = computed(() => {
  if (props.player.form_trend === 'rising' || props.player.form_trend === 'rising_slight') return 'text-emerald-500'
  if (props.player.form_trend === 'falling' || props.player.form_trend === 'falling_slight') return 'text-red-500'
  return 'text-gray-600 dark:text-gray-400'
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

// ── Inline sub-components ──────────────────────
const ValueBadge = defineComponent({
  props: { value: { type: Number, required: true }, label: { type: String, required: true } },
  setup(p) {
    return () => {
      const positive = p.value >= 0
      const cls = positive
        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
        : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
      const arrow = positive ? '▲' : '▼'
      return h('span', { class: `inline-flex items-center gap-0.5 text-[10px] md:text-xs font-medium px-1.5 md:px-2 py-0.5 md:py-1 rounded ${cls}` }, [
        `${arrow} ${formatMoneyCompact(Math.abs(p.value))}`,
        h('span', { class: 'text-[8px] md:text-[10px] opacity-60' }, p.label),
      ])
    }
  },
})

const StatCell = defineComponent({
  props: { value: { type: [String, Number], required: true }, label: { type: String, required: true } },
  setup(p) {
    return () => h('div', { class: 'bg-white dark:bg-gray-900 px-2 md:px-3 py-1.5 md:py-2 text-center' }, [
      h('div', { class: 'text-sm md:text-base lg:text-lg font-bold text-gray-900 dark:text-white' }, String(p.value)),
      h('div', { class: 'text-[9px] md:text-xs text-gray-400 dark:text-gray-500 uppercase' }, p.label),
    ])
  },
})
</script>
