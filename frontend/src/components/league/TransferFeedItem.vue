<template>
  <div
    class="flex items-center gap-3 px-3 py-3 md:px-4 md:py-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
  >
    <!-- Transfer type indicator -->
    <div
      class="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center"
      :class="transfer.type === 'buy' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'"
    >
      <ArrowDownLeft
        v-if="transfer.type === 'buy'"
        class="w-4 h-4 md:w-5 md:h-5 text-emerald-600 dark:text-emerald-400"
      />
      <ArrowUpRight
        v-else
        class="w-4 h-4 md:w-5 md:h-5 text-red-600 dark:text-red-400"
      />
    </div>

    <!-- Player info -->
    <button
      class="flex items-center gap-2 md:gap-3 min-w-0 flex-1 text-left hover:opacity-80 transition-opacity"
      @click="$emit('playerClick', transfer.player.id)"
    >
      <div class="relative flex-shrink-0">
        <img
          :src="transfer.player.profile_image"
          :alt="transfer.player.name"
          class="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover bg-gray-200 dark:bg-gray-700"
        />
        <span
          class="absolute -bottom-0.5 -right-0.5 w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center text-[8px] md:text-[10px] font-bold text-white"
          :class="POSITION_COLORS[transfer.player.position].bg"
        >
          {{ posKey }}
        </span>
      </div>
      <div class="min-w-0">
        <div class="text-sm md:text-base font-semibold text-gray-900 dark:text-white truncate">
          {{ transfer.player.name }}
        </div>
        <div class="text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate">
          {{ transfer.player.team_name }}
        </div>
      </div>
    </button>

    <!-- Transfer details -->
    <div class="flex-shrink-0 flex flex-col items-end gap-0.5 min-w-[100px] md:min-w-[140px]">
      <!-- Manager info -->
      <div class="flex items-center gap-1.5 text-xs md:text-sm">
        <img
          :src="transfer.manager.profile_image"
          :alt="transfer.manager.name"
          class="w-4 h-4 md:w-5 md:h-5 rounded-full object-cover"
        />
        <span class="text-gray-700 dark:text-gray-300 truncate max-w-[60px] md:max-w-[80px]">
          {{ transfer.manager.name.split(' ')[0] }}
        </span>
        <span
          class="font-medium"
          :class="transfer.type === 'buy' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'"
        >
          {{ transfer.type === 'buy' ? t('transfers.bought') : t('transfers.sold') }}
        </span>
      </div>
      <!-- Counterparty -->
      <div class="flex items-center gap-1 text-[10px] md:text-xs text-gray-400 dark:text-gray-500">
        <span>{{ transfer.type === 'buy' ? t('transfers.from') : t('transfers.to') }}</span>
        <template v-if="transfer.counterparty">
          <img
            :src="transfer.counterparty.profile_image"
            :alt="transfer.counterparty.name"
            class="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full object-cover"
          />
          <span class="truncate max-w-[50px] md:max-w-[70px]">{{ transfer.counterparty.name.split(' ')[0] }}</span>
        </template>
        <span v-else class="text-cyan-500">{{ t('transfers.kickbase') }}</span>
      </div>
    </div>

    <!-- Price & diff -->
    <div class="flex-shrink-0 text-right min-w-[70px] md:min-w-[90px]">
      <div class="text-sm md:text-base font-semibold text-gray-900 dark:text-white">
        {{ formatMoney(transfer.price) }}
      </div>
      <div
        class="text-[10px] md:text-xs font-medium"
        :class="priceDiffColor"
      >
        {{ priceDiffText }}
      </div>
    </div>

    <!-- Date -->
    <div class="hidden sm:block flex-shrink-0 text-right min-w-[50px] md:min-w-[60px]">
      <div class="text-xs md:text-sm text-gray-500 dark:text-gray-400">
        {{ dateText }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowDownLeft, ArrowUpRight } from 'lucide-vue-next'
import { POSITION_COLORS } from '@/types/player'
import type { LeagueTransfer } from '@/types/league'

const props = defineProps<{
  transfer: LeagueTransfer
}>()

defineEmits<{
  playerClick: [playerId: string]
}>()

const { t } = useI18n()

const posKey = computed(() => {
  const map: Record<number, string> = { 1: 'GK', 2: 'DF', 3: 'MF', 4: 'FW' }
  return map[props.transfer.player.position] || 'GK'
})

const priceDiffColor = computed(() => {
  // For buys: positive diff (overpaid) is bad (red), negative (underpaid) is good (green)
  // For sells: positive diff means they sold above market (good), negative is bad
  const diff = props.transfer.price_diff
  if (props.transfer.type === 'buy') {
    if (diff > 0) return 'text-red-500'
    if (diff < 0) return 'text-emerald-500'
  } else {
    if (diff > 0) return 'text-emerald-500'
    if (diff < 0) return 'text-red-500'
  }
  return 'text-gray-400 dark:text-gray-500'
})

const priceDiffText = computed(() => {
  const diff = props.transfer.price_diff
  const pct = Math.abs(props.transfer.price_diff_pct)

  if (Math.abs(diff) < 50000) return t('transfers.fairDeal')

  const sign = diff > 0 ? '+' : ''
  const formatted = formatMoneyCompact(diff)

  if (props.transfer.type === 'buy') {
    return diff > 0
      ? `${sign}${pct.toFixed(0)}% ${t('transfers.overpaid')}`
      : `${pct.toFixed(0)}% ${t('transfers.underpaid')}`
  } else {
    return `${sign}${formatted}`
  }
})

const dateText = computed(() => {
  if (props.transfer.days_ago === 0) return t('transfers.today')
  if (props.transfer.days_ago === 1) return t('transfers.yesterday')
  return t('transfers.daysAgo', { days: props.transfer.days_ago })
})

function formatMoney(value: number) {
  const abs = Math.abs(value)
  if (abs >= 1_000_000) return `${(abs / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `${(abs / 1_000).toFixed(0)}K`
  return `${abs}`
}

function formatMoneyCompact(value: number) {
  const abs = Math.abs(value)
  const sign = value >= 0 ? '+' : '-'
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `${sign}${(abs / 1_000).toFixed(0)}K`
  return `${sign}${abs}`
}
</script>
