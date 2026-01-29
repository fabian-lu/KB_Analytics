<template>
  <button
    class="w-full flex items-center gap-2.5 px-3 py-2.5 md:px-4 md:py-3.5 lg:px-5 lg:py-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-cyan-300 dark:hover:border-cyan-700 hover:shadow-sm transition-all text-left cursor-pointer"
    @click="$emit('click')"
  >
    <!-- Position badge -->
    <span
      class="flex-shrink-0 w-9 md:w-11 text-center text-[10px] md:text-xs font-bold uppercase tracking-wide py-0.5 md:py-1 rounded-md text-white"
      :class="POSITION_COLORS[listing.player.position].bg"
    >
      {{ t(`position.${posKey}`) }}
    </span>

    <!-- Avatar + team logo -->
    <div class="relative flex-shrink-0">
      <img
        :src="listing.player.profile_image"
        :alt="listing.player.name"
        class="w-9 h-9 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full object-cover bg-gray-200 dark:bg-gray-700"
      />
      <img
        :src="listing.player.team_logo"
        :alt="listing.player.team_short_name"
        class="absolute -bottom-0.5 -right-0.5 w-4 h-4 md:w-5 md:h-5 rounded-full bg-white dark:bg-gray-800 ring-1 ring-white dark:ring-gray-800 object-contain"
      />
    </div>

    <!-- Name + team + seller -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-1 md:gap-1.5">
        <span class="text-sm md:text-base lg:text-lg font-semibold text-gray-900 dark:text-white truncate">
          {{ listing.player.name }}
        </span>
        <!-- Status dot -->
        <span
          v-if="listing.player.status !== 'fit'"
          class="flex-shrink-0 w-2 h-2 md:w-2.5 md:h-2.5 rounded-full"
          :class="statusDotColor"
          :title="listing.player.status_note || listing.player.status"
        />
      </div>
      <div class="flex items-center gap-1 text-xs md:text-sm text-gray-500 dark:text-gray-400">
        <span class="truncate">{{ listing.player.team_name }}</span>
        <span class="text-gray-300 dark:text-gray-600">·</span>
        <span class="flex items-center gap-1 flex-shrink-0">
          <img
            :src="listing.seller.profile_image"
            :alt="listing.seller.name"
            class="w-3.5 h-3.5 md:w-4 md:h-4 rounded-full object-cover"
          />
          <span class="truncate max-w-[80px] md:max-w-[120px]">{{ listing.seller.name }}</span>
        </span>
      </div>
    </div>

    <!-- Stats columns -->
    <div class="flex items-center gap-2 md:gap-4 lg:gap-5 flex-shrink-0 text-right">
      <!-- Asking Price -->
      <div class="min-w-[60px] sm:min-w-[72px] md:min-w-[88px]">
        <div class="text-sm md:text-base lg:text-lg font-semibold text-gray-900 dark:text-white">
          {{ formatMoney(listing.asking_price) }}
        </div>
        <div class="text-[10px] md:text-xs text-gray-400 dark:text-gray-500">
          {{ t('transferMarket.askingPrice') }}
        </div>
      </div>

      <!-- Price Difference (hidden on small mobile) -->
      <div class="hidden sm:block min-w-[56px] md:min-w-[68px]">
        <div
          class="text-sm md:text-base font-semibold"
          :class="priceDiffColor"
        >
          {{ listing.price_diff >= 0 ? '+' : '' }}{{ formatMoneyCompact(listing.price_diff) }}
        </div>
        <div class="text-[10px] md:text-xs" :class="priceDiffLabelColor">
          {{ priceDiffLabel }}
        </div>
      </div>

      <!-- Time Listed (desktop only) -->
      <div class="hidden md:block min-w-[56px]">
        <div class="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300">
          {{ formatTimeListed(listing.hours_listed) }}
        </div>
        <div class="text-[10px] md:text-xs text-gray-400 dark:text-gray-500">
          {{ t('transferMarket.listed') }}
        </div>
      </div>

      <!-- Avg points (desktop only) -->
      <div class="hidden lg:block min-w-[44px]">
        <div class="text-base font-semibold text-gray-900 dark:text-white">{{ listing.player.avg_points }}</div>
        <div class="text-xs text-gray-400 dark:text-gray-500">{{ t('marketPlayers.avg') }}</div>
      </div>

      <!-- PPM (desktop only) -->
      <div class="hidden lg:block min-w-[44px]">
        <div class="text-base font-semibold text-gray-900 dark:text-white">{{ listing.player.ppm }}</div>
        <div class="text-xs text-gray-400 dark:text-gray-500">{{ t('marketPlayers.ppm') }}</div>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
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

const statusDotColor = computed(() => {
  switch (props.listing.player.status) {
    case 'injured': return 'bg-red-500'
    case 'suspended': return 'bg-orange-500'
    case 'doubt': return 'bg-yellow-500'
    default: return 'bg-gray-400'
  }
})

const priceDiffColor = computed(() => {
  if (props.listing.price_diff > 0) return 'text-red-500'
  if (props.listing.price_diff < 0) return 'text-emerald-500'
  return 'text-gray-500 dark:text-gray-400'
})

const priceDiffLabel = computed(() => {
  if (props.listing.price_diff_pct > 5) return t('transferMarket.overpriced')
  if (props.listing.price_diff_pct < -5) return t('transferMarket.bargain')
  return t('transferMarket.fairPrice')
})

const priceDiffLabelColor = computed(() => {
  if (props.listing.price_diff_pct > 5) return 'text-red-400'
  if (props.listing.price_diff_pct < -5) return 'text-emerald-400'
  return 'text-gray-400 dark:text-gray-500'
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
</script>
