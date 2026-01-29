<template>
  <button
    class="w-full flex flex-col rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-cyan-300 dark:hover:border-cyan-700 hover:shadow-md transition-all text-left cursor-pointer overflow-hidden"
    @click="$emit('click')"
  >
    <!-- Header: position + status -->
    <div class="flex items-center justify-between px-3 md:px-4 pt-3 md:pt-4 pb-1">
      <div class="flex items-center gap-1.5 md:gap-2">
        <span
          class="text-[10px] md:text-xs font-bold uppercase tracking-wide px-2 md:px-2.5 py-0.5 md:py-1 rounded-md text-white"
          :class="POSITION_COLORS[listing.player.position].bg"
        >
          {{ t(`position.${posKey}`) }}
        </span>
      </div>
      <span
        v-if="listing.player.status !== 'fit'"
        class="text-[10px] md:text-xs font-medium px-2 md:px-2.5 py-0.5 md:py-1 rounded-full"
        :class="statusBadge"
      >
        {{ t(`player.status.${listing.player.status}`) }}
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
          :src="listing.player.profile_image"
          :alt="listing.player.name"
          class="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover bg-gray-200 dark:bg-gray-700"
        />
        <img
          :src="listing.player.team_logo"
          :alt="listing.player.team_short_name"
          class="absolute -bottom-0.5 -right-0.5 w-5 h-5 md:w-6 md:h-6 rounded-full bg-white dark:bg-gray-800 ring-1 ring-white dark:ring-gray-800 object-contain"
        />
      </div>
      <div class="min-w-0">
        <div class="text-sm md:text-base lg:text-lg font-semibold text-gray-900 dark:text-white truncate">{{ listing.player.name }}</div>
        <div class="text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate">{{ listing.player.team_name }}</div>
      </div>
    </div>

    <!-- Seller info -->
    <div class="flex items-center gap-2 px-3 md:px-4 pb-2 md:pb-3">
      <span class="text-[10px] md:text-xs text-gray-400 dark:text-gray-500">{{ t('transferMarket.seller') }}:</span>
      <div class="flex items-center gap-1.5">
        <img
          :src="listing.seller.profile_image"
          :alt="listing.seller.name"
          class="w-4 h-4 md:w-5 md:h-5 rounded-full object-cover"
        />
        <span class="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{{ listing.seller.name }}</span>
      </div>
    </div>

    <!-- Price comparison section -->
    <div class="px-3 md:px-4 pb-2 md:pb-3 border-t border-gray-100 dark:border-gray-800 pt-2 md:pt-3">
      <div class="flex items-center justify-between gap-2 mb-1">
        <!-- Asking Price -->
        <div>
          <div class="text-[10px] md:text-xs text-gray-400 dark:text-gray-500 mb-0.5">{{ t('transferMarket.askingPrice') }}</div>
          <div class="text-base md:text-lg lg:text-xl font-bold text-gray-900 dark:text-white">
            {{ formatMoney(listing.asking_price) }}
          </div>
        </div>
        <!-- Market Value -->
        <div class="text-right">
          <div class="text-[10px] md:text-xs text-gray-400 dark:text-gray-500 mb-0.5">{{ t('transferMarket.marketValue') }}</div>
          <div class="text-sm md:text-base text-gray-600 dark:text-gray-400">
            {{ formatMoney(listing.player.market_value) }}
          </div>
        </div>
      </div>

      <!-- Price difference badge -->
      <div class="flex items-center justify-between">
        <span
          class="inline-flex items-center gap-1 text-xs md:text-sm font-semibold px-2 md:px-2.5 py-0.5 md:py-1 rounded-full"
          :class="priceDiffBadge"
        >
          <span>{{ listing.price_diff >= 0 ? '▲' : '▼' }}</span>
          <span>{{ Math.abs(listing.price_diff_pct).toFixed(1) }}%</span>
          <span class="font-normal opacity-80">({{ formatMoneyCompact(listing.price_diff) }})</span>
        </span>
        <span class="text-[10px] md:text-xs" :class="priceDiffLabelColor">
          {{ priceDiffLabel }}
        </span>
      </div>
    </div>

    <!-- Time listed -->
    <div class="flex items-center justify-between px-3 md:px-4 py-1.5 md:py-2 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
      <span class="text-[10px] md:text-xs text-gray-400 dark:text-gray-500">{{ t('transferMarket.listed') }}</span>
      <span class="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ formatTimeListed(listing.hours_listed) }}
      </span>
    </div>

    <!-- Stats grid: 3 columns -->
    <div class="grid grid-cols-3 gap-px bg-gray-100 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-800">
      <StatCell :value="listing.player.avg_points" :label="t('marketPlayers.avg')" />
      <StatCell :value="listing.player.ppm" :label="t('marketPlayers.ppm')" />
      <StatCell :value="valueTrendDisplay" :label="t('transferMarket.sortValueChange').replace(' (7d)', '')" :class-override="valueTrendColor" />
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed, defineComponent, h } from 'vue'
import { useI18n } from 'vue-i18n'
import { POSITION_COLORS } from '@/types/player'
import type { TransferMarketListing } from '@/types/league'

const props = defineProps<{
  listing: TransferMarketListing
}>()

defineEmits<{
  click: []
}>()

const { t } = useI18n()

const posKey = computed(() => {
  const map: Record<number, string> = { 1: 'gk', 2: 'def', 3: 'mid', 4: 'fwd' }
  return map[props.listing.player.position] || 'gk'
})

const statusBadge = computed(() => {
  switch (props.listing.player.status) {
    case 'injured': return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
    case 'suspended': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
    case 'doubt': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
    default: return 'bg-gray-100 dark:bg-gray-800 text-gray-500'
  }
})

const priceDiffBadge = computed(() => {
  if (props.listing.price_diff > 0) return 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
  if (props.listing.price_diff < 0) return 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
  return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
})

const priceDiffLabel = computed(() => {
  if (props.listing.price_diff_pct > 5) return t('transferMarket.overpriced')
  if (props.listing.price_diff_pct < -5) return t('transferMarket.bargain')
  return t('transferMarket.fairPrice')
})

const priceDiffLabelColor = computed(() => {
  if (props.listing.price_diff_pct > 5) return 'text-red-500'
  if (props.listing.price_diff_pct < -5) return 'text-emerald-500'
  return 'text-gray-500 dark:text-gray-400'
})

const valueTrendDisplay = computed(() => {
  const val = props.listing.player.value_change_7d
  const sign = val >= 0 ? '+' : ''
  if (Math.abs(val) >= 1_000_000) return `${sign}${(val / 1_000_000).toFixed(1)}M`
  if (Math.abs(val) >= 1_000) return `${sign}${(val / 1_000).toFixed(0)}K`
  return `${sign}${val}`
})

const valueTrendColor = computed(() => {
  if (props.listing.player.value_change_7d > 0) return 'text-emerald-500'
  if (props.listing.player.value_change_7d < 0) return 'text-red-500'
  return ''
})

function formatMoney(value: number) {
  const abs = Math.abs(value)
  const sign = value < 0 ? '-' : ''
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `${sign}${(abs / 1_000).toFixed(0)}K`
  return `${sign}${abs}`
}

function formatMoneyCompact(value: number) {
  const abs = Math.abs(value)
  const sign = value < 0 ? '' : '+'
  if (abs >= 1_000_000) return `${sign}${(value / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `${sign}${(value / 1_000).toFixed(0)}K`
  return `${sign}${value}`
}

function formatTimeListed(hours: number) {
  if (hours < 1) return t('transferMarket.justListed')
  if (hours < 24) return t('transferMarket.hoursAgo', { hours: Math.round(hours) })
  const days = Math.floor(hours / 24)
  return `${days}d ${Math.round(hours % 24)}h`
}

// ── Inline sub-component ──────────────────────
const StatCell = defineComponent({
  props: {
    value: { type: [String, Number], required: true },
    label: { type: String, required: true },
    classOverride: { type: String, default: '' },
  },
  setup(p) {
    return () => h('div', { class: 'bg-white dark:bg-gray-900 px-2 md:px-3 py-1.5 md:py-2 text-center' }, [
      h('div', {
        class: `text-sm md:text-base lg:text-lg font-bold ${p.classOverride || 'text-gray-900 dark:text-white'}`
      }, String(p.value)),
      h('div', { class: 'text-[9px] md:text-xs text-gray-400 dark:text-gray-500 uppercase' }, p.label),
    ])
  },
})
</script>
