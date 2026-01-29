<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">

    <!-- Header -->
    <div class="mb-4">
      <h1 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
        {{ t('transfers.title') }}
      </h1>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        {{ t('transfers.subtitle') }}
      </p>
    </div>

    <!-- Selected Manager Detail Panel -->
    <section v-if="selectedManagerStats" class="mb-6">
      <div class="rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 border border-cyan-200 dark:border-cyan-800 p-4 md:p-6">
        <!-- Header with close button -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <img
              :src="selectedManagerStats.manager.profile_image"
              :alt="selectedManagerStats.manager.name"
              class="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow"
            />
            <div>
              <h2 class="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                {{ selectedManagerStats.manager.name }}
              </h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('transfers.traderProfile') }}</p>
            </div>
          </div>
          <button
            class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            @click="clearManagerSelection"
          >
            <X class="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
          <div class="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
            <div class="text-xs text-gray-500 dark:text-gray-400">{{ t('transfers.totalTransfers') }}</div>
            <div class="text-lg font-bold text-gray-900 dark:text-white">{{ selectedManagerStats.total_transfers }}</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
            <div class="text-xs text-gray-500 dark:text-gray-400">{{ t('transfers.buys') }} / {{ t('transfers.sells') }}</div>
            <div class="text-lg font-bold text-gray-900 dark:text-white">
              <span class="text-emerald-600">{{ selectedManagerStats.buys }}</span>
              /
              <span class="text-red-500">{{ selectedManagerStats.sells }}</span>
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
            <div class="text-xs text-gray-500 dark:text-gray-400">{{ t('transfers.totalSpent') }}</div>
            <div class="text-lg font-bold text-red-500">{{ formatMoney(selectedManagerStats.total_spent) }}</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
            <div class="text-xs text-gray-500 dark:text-gray-400">{{ t('transfers.totalReceived') }}</div>
            <div class="text-lg font-bold text-emerald-600">{{ formatMoney(selectedManagerStats.total_received) }}</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
            <div class="text-xs text-gray-500 dark:text-gray-400">{{ t('transfers.avgOverpay') }}</div>
            <div class="text-lg font-bold" :class="selectedManagerStats.avg_overpay_pct > 0 ? 'text-red-500' : 'text-emerald-600'">
              {{ selectedManagerStats.avg_overpay_pct >= 0 ? '+' : '' }}{{ selectedManagerStats.avg_overpay_pct.toFixed(1) }}%
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
            <div class="text-xs text-gray-500 dark:text-gray-400">{{ t('transfers.roi') }}</div>
            <div class="text-lg font-bold" :class="selectedManagerStats.roi_pct >= 0 ? 'text-emerald-600' : 'text-red-500'">
              {{ selectedManagerStats.roi_pct >= 0 ? '+' : '' }}{{ selectedManagerStats.roi_pct.toFixed(1) }}%
            </div>
          </div>
        </div>

        <!-- Flip Stats & Pattern Analysis -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <!-- Flip Stats -->
          <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <RefreshCw class="w-4 h-4 text-cyan-500" />
              {{ t('transfers.flipStats') }}
            </h3>
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('transfers.flipProfit') }}</span>
                <span class="font-semibold" :class="selectedManagerStats.flip_profit >= 0 ? 'text-emerald-600' : 'text-red-500'">
                  {{ formatMoney(selectedManagerStats.flip_profit) }}
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('transfers.profitableFlips') }}</span>
                <span class="font-semibold text-emerald-600">{{ selectedManagerStats.profitable_flips }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('transfers.unprofitableFlips') }}</span>
                <span class="font-semibold text-red-500">{{ selectedManagerStats.unprofitable_flips }}</span>
              </div>
              <div class="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700">
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('transfers.flipWinRate') }}</span>
                <span class="font-semibold text-gray-900 dark:text-white">
                  {{ flipWinRate }}%
                </span>
              </div>
            </div>
          </div>

          <!-- Position Overpay Pattern -->
          <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Target class="w-4 h-4 text-amber-500" />
              {{ t('transfers.positionPattern') }}
            </h3>
            <div class="space-y-2">
              <div
                v-for="pos in positionOverpayData"
                :key="pos.position"
                class="flex items-center gap-2"
              >
                <span
                  class="w-8 h-5 rounded text-[10px] font-bold text-white flex items-center justify-center"
                  :class="POSITION_COLORS[pos.position].bg"
                >
                  {{ pos.label }}
                </span>
                <div class="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all"
                    :class="pos.value > 0 ? 'bg-red-400' : 'bg-emerald-400'"
                    :style="{ width: `${Math.min(Math.abs(pos.value) * 2, 100)}%` }"
                  />
                </div>
                <span
                  class="text-xs font-medium w-14 text-right"
                  :class="pos.value > 0 ? 'text-red-500' : 'text-emerald-500'"
                >
                  {{ pos.value >= 0 ? '+' : '' }}{{ pos.value.toFixed(1) }}%
                </span>
              </div>
            </div>
            <p class="text-[10px] text-gray-400 dark:text-gray-500 mt-3">
              {{ t('transfers.overpayExplanation') }}
            </p>
          </div>
        </div>

        <!-- Average Prices -->
        <div class="mt-4 flex flex-wrap gap-4 text-sm">
          <div class="flex items-center gap-2">
            <Download class="w-4 h-4 text-emerald-500" />
            <span class="text-gray-600 dark:text-gray-400">{{ t('transfers.avgBuyPrice') }}:</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ formatMoney(selectedManagerStats.avg_buy_price) }}</span>
          </div>
          <div class="flex items-center gap-2">
            <Upload class="w-4 h-4 text-red-500" />
            <span class="text-gray-600 dark:text-gray-400">{{ t('transfers.avgSellPrice') }}:</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ formatMoney(selectedManagerStats.avg_sell_price) }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Top Transfers Section (7 days) -->
    <section class="mb-6">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-base md:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <TrendingUp class="w-4 h-4 md:w-5 md:h-5 text-cyan-500" />
          {{ t('transfers.topTransfers') }}
        </h2>
      </div>
      <div v-if="topTransfers.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <TopTransferCard
          v-for="transfer in topTransfers"
          :key="transfer.id"
          :transfer="transfer"
          @click="openPlayer(transfer.player.id)"
        />
      </div>
      <div v-else class="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-6 text-center">
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('transfers.noRecentTransfers') }}</p>
      </div>
    </section>

    <!-- Trader Rankings Section -->
    <section class="mb-6">
      <div class="flex items-center gap-2 mb-3">
        <Trophy class="w-4 h-4 md:w-5 md:h-5 text-amber-500" />
        <h2 class="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
          {{ t('transfers.traderRankings') }}
        </h2>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Best Traders -->
        <div class="rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4">
          <h3 class="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-1.5">
            <ThumbsUp class="w-4 h-4" />
            {{ t('transfers.bestTraders') }}
          </h3>
          <div class="space-y-2">
            <TraderRankingRow
              v-for="(stat, idx) in bestTraders"
              :key="stat.manager.id"
              :stat="stat"
              :rank="idx + 1"
              variant="best"
              @click="viewManagerStats"
            />
          </div>
        </div>

        <!-- Worst Traders -->
        <div class="rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4">
          <h3 class="text-sm font-semibold text-red-600 dark:text-red-400 mb-3 flex items-center gap-1.5">
            <ThumbsDown class="w-4 h-4" />
            {{ t('transfers.worstTraders') }}
          </h3>
          <div class="space-y-2">
            <TraderRankingRow
              v-for="(stat, idx) in worstTraders"
              :key="stat.manager.id"
              :stat="stat"
              :rank="idx + 1"
              variant="worst"
              @click="viewManagerStats"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Transfer Stats Summary -->
    <section class="mb-6">
      <div class="flex items-center gap-2 mb-3">
        <BarChart3 class="w-4 h-4 md:w-5 md:h-5 text-cyan-500" />
        <h2 class="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
          {{ t('transfers.transferStats') }}
        </h2>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          :value="totalStats.total"
          :label="t('transfers.totalTransfers')"
          icon="activity"
        />
        <StatCard
          :value="totalStats.buys"
          :label="t('transfers.buys')"
          icon="download"
          color="emerald"
        />
        <StatCard
          :value="totalStats.sells"
          :label="t('transfers.sells')"
          icon="upload"
          color="red"
        />
        <StatCard
          :value="formatMoney(totalStats.avgBuyPrice)"
          :label="t('transfers.avgBuyPrice')"
          icon="tag"
        />
        <StatCard
          :value="formatMoney(totalStats.avgSellPrice)"
          :label="t('transfers.avgSellPrice')"
          icon="tag"
        />
        <StatCard
          :value="formatMoney(totalStats.netSpending)"
          :label="t('transfers.netSpending')"
          icon="wallet"
          :color="totalStats.netSpending > 0 ? 'red' : 'emerald'"
        />
      </div>
    </section>

    <!-- Transfer Feed Section -->
    <section>
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-base md:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <History class="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
          {{ t('league.tabs.transfers') }}
        </h2>
        <span class="text-xs text-gray-400 dark:text-gray-500">
          {{ t('transfers.transferCount', { count: filteredTransfers.length }) }}
        </span>
      </div>

      <!-- Filters -->
      <div class="flex flex-col sm:flex-row gap-3 mb-4">
        <!-- Search with autocomplete -->
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
          <input
            ref="searchInputRef"
            v-model="searchQuery"
            type="search"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            :placeholder="t('transfers.searchPlaceholder')"
            class="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500"
            @focus="showSuggestions = true"
            @blur="onBlur"
            @keydown.escape="showSuggestions = false"
            @keydown.down.prevent="navigateSuggestion(1)"
            @keydown.up.prevent="navigateSuggestion(-1)"
            @keydown.enter.prevent="selectHighlighted"
          />

          <!-- Autocomplete dropdown -->
          <div
            v-if="showSuggestions && (managerSuggestions.length > 0 || playerSuggestions.length > 0)"
            class="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto"
          >
            <!-- Manager suggestions -->
            <div v-if="managerSuggestions.length > 0">
              <div class="px-3 py-1.5 text-[10px] font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50">
                {{ t('transfers.filterByManager') }}
              </div>
              <button
                v-for="(manager, idx) in managerSuggestions"
                :key="`manager-${manager.id}`"
                class="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                :class="{ 'bg-cyan-50 dark:bg-cyan-900/20': highlightedIndex === idx }"
                @mousedown.prevent="selectManager(manager)"
              >
                <img :src="manager.profile_image" :alt="manager.name" class="w-6 h-6 rounded-full object-cover bg-gray-200 dark:bg-gray-700" />
                <span class="text-sm text-gray-900 dark:text-white">{{ manager.name }}</span>
                <span class="text-xs text-gray-400 ml-auto">{{ getManagerTransferCount(manager.id) }} {{ t('transfers.totalTransfers').toLowerCase() }}</span>
              </button>
            </div>

            <!-- Player suggestions -->
            <div v-if="playerSuggestions.length > 0">
              <div class="px-3 py-1.5 text-[10px] font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50">
                {{ t('transfers.filterByPlayer') }}
              </div>
              <button
                v-for="(player, idx) in playerSuggestions"
                :key="`player-${player.id}`"
                class="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                :class="{ 'bg-cyan-50 dark:bg-cyan-900/20': highlightedIndex === managerSuggestions.length + idx }"
                @mousedown.prevent="selectPlayerFilter(player)"
              >
                <img :src="player.profile_image" :alt="player.name" class="w-6 h-6 rounded-full object-cover bg-gray-200 dark:bg-gray-700" />
                <span class="text-sm text-gray-900 dark:text-white">{{ player.name }}</span>
                <span class="text-xs text-gray-400">{{ player.team_name }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Selected filter chips -->
        <div v-if="selectedFilterChips.length > 0" class="flex flex-wrap gap-1.5 items-center">
          <span
            v-for="chip in selectedFilterChips"
            :key="`${chip.type}-${chip.id}`"
            class="inline-flex items-center gap-1 pl-2 pr-1 py-1 text-xs font-medium rounded-full bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300"
          >
            <img
              :src="chip.image"
              :alt="chip.label"
              class="w-3.5 h-3.5 rounded-full object-cover"
            />
            {{ chip.label }}
            <button
              class="ml-0.5 p-0.5 rounded-full hover:bg-cyan-200 dark:hover:bg-cyan-800 transition-colors"
              @click="removeFilterChip(chip)"
            >
              <X class="w-3 h-3" />
            </button>
          </span>
        </div>

        <!-- Type filter -->
        <div class="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          <button
            v-for="f in typeFilters"
            :key="f.key"
            class="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
            :class="activeTypeFilter === f.key
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
            @click="activeTypeFilter = f.key"
          >
            {{ f.label }}
          </button>
        </div>

        <!-- Sort -->
        <div class="flex items-center gap-2">
          <ArrowUpDown class="w-3.5 h-3.5 text-gray-400" />
          <select
            v-model="activeSort"
            class="text-xs font-medium bg-transparent text-gray-600 dark:text-gray-400 border-none focus:outline-none focus:ring-0 cursor-pointer"
          >
            <option v-for="opt in sortOptions" :key="opt.key" :value="opt.key">
              {{ opt.label }}
            </option>
          </select>
        </div>
      </div>

      <!-- Transfer Feed -->
      <div v-if="filteredTransfers.length > 0" class="space-y-2">
        <TransferFeedItem
          v-for="transfer in paginatedTransfers"
          :key="transfer.id"
          :transfer="transfer"
          @player-click="openPlayer"
        />

        <!-- Load more -->
        <div v-if="filteredTransfers.length > displayCount" class="pt-2 text-center">
          <button
            class="px-4 py-2 text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
            @click="loadMore"
          >
            Load more ({{ filteredTransfers.length - displayCount }} remaining)
          </button>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-else
        class="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-8 text-center"
      >
        <ArrowLeftRight class="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
        <p class="text-gray-500 dark:text-gray-400">{{ t('transfers.noTransfers') }}</p>
      </div>
    </section>

    <!-- Player modal -->
    <PlayerModal
      v-if="selectedPlayerId"
      :player-id="selectedPlayerId"
      :open="!!selectedPlayerId"
      @close="selectedPlayerId = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineComponent, h, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { onBeforeRouteLeave } from 'vue-router'
import {
  Search,
  ArrowUpDown,
  TrendingUp,
  Trophy,
  ThumbsUp,
  ThumbsDown,
  BarChart3,
  History,
  ArrowLeftRight,
  Activity,
  Download,
  Upload,
  Tag,
  Wallet,
  X,
  RefreshCw,
  Target,
} from 'lucide-vue-next'
import TransferFeedItem from '@/components/league/TransferFeedItem.vue'
import PlayerModal from '@/components/player/PlayerModal.vue'
import { mockTransferHistory, mockTraderStats, mockManagerProfiles } from '@/mocks/leagueMock'
import { POSITION_COLORS } from '@/types/player'
import type { LeagueTransfer, ManagerTraderStats, TransferSortOption } from '@/types/league'
import type { Manager, PlayerSummary } from '@/types/dashboard'

const { t } = useI18n()

// Filter chip type
interface FilterChip {
  type: 'manager' | 'player'
  id: string
  label: string
  image: string
}

type TypeFilter = 'all' | 'buys' | 'sells' | 'recent'

// ── Navigation guard ──
onBeforeRouteLeave((_to, _from, next) => {
  if (selectedPlayerId.value) {
    selectedPlayerId.value = null
    next(false)
  } else {
    next()
  }
})

// ── State ──
const searchQuery = ref('')
const selectedManagerId = ref('')
const selectedPlayerFilterId = ref('')
const activeTypeFilter = ref<TypeFilter>('all')
const activeSort = ref<TransferSortOption>('date')
const displayCount = ref(20)
const selectedPlayerId = ref<string | null>(null)

// Autocomplete state
const searchInputRef = ref<HTMLInputElement | null>(null)
const showSuggestions = ref(false)
const highlightedIndex = ref(-1)

// Separate state for viewing manager details (independent from filter)
const viewingManagerId = ref<string | null>(null)

// ── Computed ──
const allManagers = computed(() => mockManagerProfiles.map(p => p.manager))

// Get unique players from transfer history
const allPlayersInTransfers = computed(() => {
  const playerMap = new Map<string, PlayerSummary>()
  for (const transfer of mockTransferHistory) {
    playerMap.set(transfer.player.id, transfer.player)
  }
  return Array.from(playerMap.values())
})

// Selected filter chips for display
const selectedFilterChips = computed<FilterChip[]>(() => {
  const chips: FilterChip[] = []
  if (selectedManagerId.value) {
    const manager = allManagers.value.find(m => m.id === selectedManagerId.value)
    if (manager) {
      chips.push({
        type: 'manager',
        id: manager.id,
        label: manager.name,
        image: manager.profile_image,
      })
    }
  }
  if (selectedPlayerFilterId.value) {
    const player = allPlayersInTransfers.value.find(p => p.id === selectedPlayerFilterId.value)
    if (player) {
      chips.push({
        type: 'player',
        id: player.id,
        label: player.name,
        image: player.profile_image,
      })
    }
  }
  return chips
})

// Manager autocomplete suggestions
const managerSuggestions = computed(() => {
  if (!searchQuery.value.trim()) return []
  const q = searchQuery.value.toLowerCase().trim()
  return allManagers.value
    .filter(manager =>
      manager.id !== selectedManagerId.value &&
      manager.name.toLowerCase().includes(q)
    )
    .slice(0, 4)
})

// Player autocomplete suggestions
const playerSuggestions = computed(() => {
  if (!searchQuery.value.trim()) return []
  const q = searchQuery.value.toLowerCase().trim()
  return allPlayersInTransfers.value
    .filter(player =>
      player.id !== selectedPlayerFilterId.value &&
      player.name.toLowerCase().includes(q)
    )
    .slice(0, 5)
})

// Selected manager's detailed stats (for viewing panel, independent from filter)
const selectedManagerStats = computed(() => {
  if (!viewingManagerId.value) return null
  return mockTraderStats.find(s => s.manager.id === viewingManagerId.value) || null
})

// Flip win rate for selected manager
const flipWinRate = computed(() => {
  if (!selectedManagerStats.value) return '0'
  const total = selectedManagerStats.value.profitable_flips + selectedManagerStats.value.unprofitable_flips
  if (total === 0) return '0'
  return ((selectedManagerStats.value.profitable_flips / total) * 100).toFixed(0)
})

// Position overpay data for selected manager
const positionOverpayData = computed(() => {
  if (!selectedManagerStats.value) return []
  const posLabels: Record<number, string> = { 1: 'GK', 2: 'DEF', 3: 'MID', 4: 'FWD' }
  return [1, 2, 3, 4].map(pos => ({
    position: pos,
    label: posLabels[pos],
    value: selectedManagerStats.value!.position_overpay[pos] || 0,
  }))
})

// Reset highlight when suggestions change
watch([managerSuggestions, playerSuggestions], () => {
  highlightedIndex.value = -1
})

// Show suggestions when search query changes
watch(searchQuery, (newVal) => {
  if (newVal.trim()) {
    showSuggestions.value = true
  }
})

const typeFilters = computed(() => [
  { key: 'all' as const, label: t('transfers.filterAll') },
  { key: 'buys' as const, label: t('transfers.filterBuys') },
  { key: 'sells' as const, label: t('transfers.filterSells') },
  { key: 'recent' as const, label: t('transfers.filterRecent') },
])

const sortOptions = computed(() => [
  { key: 'date' as const, label: t('transfers.sortDate') },
  { key: 'price' as const, label: t('transfers.sortPrice') },
  { key: 'price_diff' as const, label: t('transfers.sortPriceDiff') },
])

// Top transfers (biggest in last 7 days)
const topTransfers = computed(() => {
  return mockTransferHistory
    .filter(t => t.days_ago <= 7 && t.type === 'buy') // Only buys to avoid duplicates
    .sort((a, b) => b.price - a.price)
    .slice(0, 6)
})

// Best traders (by ROI)
const bestTraders = computed(() => {
  return [...mockTraderStats]
    .filter(s => s.total_transfers >= 3) // Minimum transfers to qualify
    .sort((a, b) => b.roi_pct - a.roi_pct)
    .slice(0, 4)
})

// Worst traders (by avg overpay)
const worstTraders = computed(() => {
  return [...mockTraderStats]
    .filter(s => s.buys >= 2) // Minimum buys to qualify
    .sort((a, b) => b.avg_overpay_pct - a.avg_overpay_pct)
    .slice(0, 4)
})

// Total stats across all managers
const totalStats = computed(() => {
  const buys = mockTransferHistory.filter(t => t.type === 'buy')
  const sells = mockTransferHistory.filter(t => t.type === 'sell')

  const totalSpent = buys.reduce((sum, t) => sum + t.price, 0)
  const totalReceived = sells.reduce((sum, t) => sum + t.price, 0)

  return {
    total: mockTransferHistory.length,
    buys: buys.length,
    sells: sells.length,
    avgBuyPrice: buys.length > 0 ? Math.round(totalSpent / buys.length) : 0,
    avgSellPrice: sells.length > 0 ? Math.round(totalReceived / sells.length) : 0,
    netSpending: totalSpent - totalReceived,
  }
})

// Filtered transfers
const filteredTransfers = computed(() => {
  let transfers = [...mockTransferHistory]

  // Manager filter
  if (selectedManagerId.value) {
    transfers = transfers.filter(t =>
      t.manager.id === selectedManagerId.value ||
      (t.counterparty && t.counterparty.id === selectedManagerId.value)
    )
  }

  // Player filter
  if (selectedPlayerFilterId.value) {
    transfers = transfers.filter(t => t.player.id === selectedPlayerFilterId.value)
  }

  // Type filter
  switch (activeTypeFilter.value) {
    case 'buys':
      transfers = transfers.filter(t => t.type === 'buy')
      break
    case 'sells':
      transfers = transfers.filter(t => t.type === 'sell')
      break
    case 'recent':
      transfers = transfers.filter(t => t.days_ago <= 7)
      break
  }

  // Sort
  switch (activeSort.value) {
    case 'date':
      transfers.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      break
    case 'price':
      transfers.sort((a, b) => b.price - a.price)
      break
    case 'price_diff':
      transfers.sort((a, b) => Math.abs(b.price_diff) - Math.abs(a.price_diff))
      break
  }

  return transfers
})

const paginatedTransfers = computed(() => {
  return filteredTransfers.value.slice(0, displayCount.value)
})

// ── Actions ──
function loadMore() {
  displayCount.value += 20
}

function openPlayer(playerId: string) {
  selectedPlayerId.value = playerId
}

// ── Autocomplete actions ──
function onBlur() {
  setTimeout(() => {
    showSuggestions.value = false
    highlightedIndex.value = -1
  }, 300)
}

function navigateSuggestion(dir: number) {
  const total = managerSuggestions.value.length + playerSuggestions.value.length
  if (total === 0) return
  highlightedIndex.value = (highlightedIndex.value + dir + total) % total
}

function selectHighlighted() {
  if (highlightedIndex.value < 0) return

  const managerCount = managerSuggestions.value.length

  if (highlightedIndex.value < managerCount) {
    selectManager(managerSuggestions.value[highlightedIndex.value])
  } else {
    const playerIdx = highlightedIndex.value - managerCount
    selectPlayerFilter(playerSuggestions.value[playerIdx])
  }
}

function selectManager(manager: Manager) {
  selectedManagerId.value = manager.id
  searchQuery.value = ''
  showSuggestions.value = false
  highlightedIndex.value = -1
  displayCount.value = 20 // Reset pagination
}

function selectPlayerFilter(player: PlayerSummary) {
  selectedPlayerFilterId.value = player.id
  searchQuery.value = ''
  showSuggestions.value = false
  highlightedIndex.value = -1
  displayCount.value = 20 // Reset pagination
}

function removeFilterChip(chip: FilterChip) {
  if (chip.type === 'manager') {
    selectedManagerId.value = ''
  } else if (chip.type === 'player') {
    selectedPlayerFilterId.value = ''
  }
}

function clearManagerSelection() {
  viewingManagerId.value = null
}

function viewManagerStats(managerId: string) {
  viewingManagerId.value = managerId
}

function getManagerTransferCount(managerId: string): number {
  return mockTransferHistory.filter(
    t => t.manager.id === managerId || (t.counterparty && t.counterparty.id === managerId)
  ).length
}

function formatMoney(value: number) {
  const abs = Math.abs(value)
  const sign = value < 0 ? '-' : ''
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `${sign}${(abs / 1_000).toFixed(0)}K`
  return `${sign}${abs}`
}

// ── Inline Components ──

const TopTransferCard = defineComponent({
  props: {
    transfer: { type: Object as () => LeagueTransfer, required: true },
  },
  emits: ['click'],
  setup(props, { emit }) {

    return () => h('button', {
      class: 'w-full flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-cyan-300 dark:hover:border-cyan-700 hover:shadow-sm transition-all text-left',
      onClick: () => emit('click'),
    }, [
      // Player avatar
      h('img', {
        src: props.transfer.player.profile_image,
        alt: props.transfer.player.name,
        class: 'w-10 h-10 md:w-12 md:h-12 rounded-full object-cover bg-gray-200 dark:bg-gray-700 flex-shrink-0',
      }),
      // Info
      h('div', { class: 'flex-1 min-w-0' }, [
        h('div', { class: 'text-sm md:text-base font-semibold text-gray-900 dark:text-white truncate' }, props.transfer.player.name),
        h('div', { class: 'flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400' }, [
          h('img', {
            src: props.transfer.manager.profile_image,
            class: 'w-3.5 h-3.5 rounded-full',
          }),
          h('span', { class: 'truncate' }, props.transfer.manager.name.split(' ')[0]),
        ]),
      ]),
      // Price
      h('div', { class: 'text-right flex-shrink-0' }, [
        h('div', { class: 'text-sm md:text-base font-bold text-gray-900 dark:text-white' }, formatMoney(props.transfer.price)),
        h('div', {
          class: `text-[10px] md:text-xs font-medium ${props.transfer.price_diff > 0 ? 'text-red-500' : 'text-emerald-500'}`,
        }, `${props.transfer.price_diff >= 0 ? '+' : ''}${props.transfer.price_diff_pct.toFixed(0)}%`),
      ]),
    ])
  },
})

const TraderRankingRow = defineComponent({
  props: {
    stat: { type: Object as () => ManagerTraderStats, required: true },
    rank: { type: Number, required: true },
    variant: { type: String as () => 'best' | 'worst', required: true },
  },
  emits: ['click'],
  setup(props, { emit }) {
    const { t: tr } = useI18n()

    const primaryValue = computed(() => {
      if (props.variant === 'best') {
        return `${props.stat.roi_pct >= 0 ? '+' : ''}${props.stat.roi_pct.toFixed(1)}%`
      }
      return `+${props.stat.avg_overpay_pct.toFixed(1)}%`
    })

    const primaryLabel = computed(() => {
      return props.variant === 'best' ? tr('transfers.roi') : tr('transfers.avgOverpay')
    })

    const secondaryValue = computed(() => {
      if (props.variant === 'best') {
        return formatMoney(props.stat.flip_profit)
      }
      return formatMoney(props.stat.total_spent)
    })

    const secondaryLabel = computed(() => {
      return props.variant === 'best' ? tr('transfers.flipProfit') : tr('transfers.spent')
    })

    return () => h('button', {
      class: 'w-full flex items-center gap-3 py-2 px-2 -mx-2 rounded-lg border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer text-left',
      onClick: () => emit('click', props.stat.manager.id),
    }, [
      // Rank
      h('span', {
        class: `w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
          props.rank === 1 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
          props.rank === 2 ? 'bg-gray-100 dark:bg-gray-800 text-gray-500' :
          'bg-gray-50 dark:bg-gray-800/50 text-gray-400'
        }`,
      }, props.rank),
      // Manager
      h('img', {
        src: props.stat.manager.profile_image,
        alt: props.stat.manager.name,
        class: 'w-8 h-8 rounded-full object-cover',
      }),
      h('div', { class: 'flex-1 min-w-0' }, [
        h('div', { class: 'text-sm font-medium text-gray-900 dark:text-white truncate' }, props.stat.manager.name),
        h('div', { class: 'text-[10px] text-gray-400 dark:text-gray-500' },
          `${props.stat.total_transfers} ${tr('transfers.totalTransfers').toLowerCase()}`
        ),
      ]),
      // Stats
      h('div', { class: 'text-right' }, [
        h('div', {
          class: `text-sm font-bold ${props.variant === 'best' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`,
        }, primaryValue.value),
        h('div', { class: 'text-[10px] text-gray-400 dark:text-gray-500' }, primaryLabel.value),
      ]),
      // Secondary stat (desktop)
      h('div', { class: 'hidden md:block text-right min-w-[60px]' }, [
        h('div', { class: 'text-sm font-medium text-gray-700 dark:text-gray-300' }, secondaryValue.value),
        h('div', { class: 'text-[10px] text-gray-400 dark:text-gray-500' }, secondaryLabel.value),
      ]),
    ])
  },
})

const StatCard = defineComponent({
  props: {
    value: { type: [String, Number], required: true },
    label: { type: String, required: true },
    icon: { type: String, required: true },
    color: { type: String, default: 'gray' },
  },
  setup(props) {
    const iconMap: Record<string, any> = {
      activity: Activity,
      download: Download,
      upload: Upload,
      tag: Tag,
      wallet: Wallet,
    }

    const colorClasses: Record<string, string> = {
      gray: 'text-gray-500 dark:text-gray-400',
      emerald: 'text-emerald-500',
      red: 'text-red-500',
    }

    return () => h('div', {
      class: 'rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-3 md:p-4',
    }, [
      h('div', { class: 'flex items-center gap-2 mb-1' }, [
        h(iconMap[props.icon] || Activity, {
          class: `w-4 h-4 ${colorClasses[props.color] || colorClasses.gray}`,
        }),
        h('span', { class: 'text-[10px] md:text-xs text-gray-400 dark:text-gray-500 uppercase' }, props.label),
      ]),
      h('div', {
        class: `text-lg md:text-xl font-bold ${colorClasses[props.color] || 'text-gray-900 dark:text-white'}`,
      }, String(props.value)),
    ])
  },
})
</script>
