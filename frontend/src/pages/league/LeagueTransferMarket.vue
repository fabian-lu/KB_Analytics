<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">

    <!-- Header -->
    <div class="mb-4">
      <h1 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
        {{ t('transferMarket.title') }}
      </h1>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        {{ t('transferMarket.subtitle') }}
      </p>
    </div>

    <!-- Search bar with autocomplete -->
    <div class="relative mb-3">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
      <input
        ref="searchInputRef"
        v-model="searchQuery"
        type="search"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
        :placeholder="t('transferMarket.searchPlaceholder')"
        class="w-full pl-10 pr-4 py-2.5 text-sm md:text-base rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-colors"
        @focus="showSuggestions = true"
        @blur="onBlur"
        @input="onInputNative"
        @keyup="onInputNative"
        @keydown.escape="showSuggestions = false"
        @keydown.down.prevent="navigateSuggestion(1)"
        @keydown.up.prevent="navigateSuggestion(-1)"
        @keydown.enter.prevent="selectHighlighted"
      />

      <!-- Autocomplete dropdown -->
      <div
        v-if="showSuggestions && (sellerSuggestions.length > 0 || teamSuggestions.length > 0 || playerSuggestions.length > 0)"
        class="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto"
      >
        <!-- Seller suggestions -->
        <div v-if="sellerSuggestions.length > 0">
          <div class="px-3 py-1.5 text-[10px] font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50">
            {{ t('transferMarket.filterBySeller') }}
          </div>
          <button
            v-for="(seller, idx) in sellerSuggestions"
            :key="`seller-${seller.id}`"
            class="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            :class="{ 'bg-cyan-50 dark:bg-cyan-900/20': highlightedIndex === idx }"
            @mousedown.prevent="selectSeller(seller)"
          >
            <img :src="seller.profile_image" :alt="seller.name" class="w-6 h-6 rounded-full object-cover bg-gray-200 dark:bg-gray-700" />
            <span class="text-sm text-gray-900 dark:text-white">{{ seller.name }}</span>
          </button>
        </div>

        <!-- Team suggestions -->
        <div v-if="teamSuggestions.length > 0">
          <div class="px-3 py-1.5 text-[10px] font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50">
            {{ t('marketPlayers.searchTeams') }}
          </div>
          <button
            v-for="(team, idx) in teamSuggestions"
            :key="`team-${team.id}`"
            class="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            :class="{ 'bg-cyan-50 dark:bg-cyan-900/20': highlightedIndex === sellerSuggestions.length + idx }"
            @mousedown.prevent="selectTeam(team)"
          >
            <img :src="team.logo" :alt="team.name" class="w-5 h-5 object-contain" />
            <span class="text-sm text-gray-900 dark:text-white">{{ team.name }}</span>
            <span class="text-xs text-gray-400">({{ team.short_name }})</span>
          </button>
        </div>

        <!-- Player suggestions -->
        <div v-if="playerSuggestions.length > 0">
          <div class="px-3 py-1.5 text-[10px] font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50">
            {{ t('marketPlayers.searchPlayers') }}
          </div>
          <button
            v-for="(listing, idx) in playerSuggestions"
            :key="`player-${listing.player.id}`"
            class="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            :class="{ 'bg-cyan-50 dark:bg-cyan-900/20': highlightedIndex === sellerSuggestions.length + teamSuggestions.length + idx }"
            @mousedown.prevent="selectPlayer(listing)"
          >
            <img :src="listing.player.profile_image" :alt="listing.player.name" class="w-6 h-6 rounded-full object-cover bg-gray-200 dark:bg-gray-700" />
            <span class="text-sm text-gray-900 dark:text-white">{{ listing.player.name }}</span>
            <span class="text-xs text-gray-400">{{ listing.player.team_short_name }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Selected search chips -->
    <div v-if="selectedFilters.length > 0" class="flex flex-wrap gap-1.5 mb-3">
      <span
        v-for="sel in selectedFilters"
        :key="`${sel.type}-${sel.id}`"
        class="inline-flex items-center gap-1 pl-2 pr-1 py-1 text-xs font-medium rounded-full bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300"
      >
        <img
          v-if="sel.type === 'team'"
          :src="getTeamLogo(sel.id)"
          class="w-3.5 h-3.5 object-contain"
        />
        <img
          v-if="sel.type === 'seller'"
          :src="getSellerImage(sel.id)"
          class="w-3.5 h-3.5 rounded-full object-cover"
        />
        {{ sel.label }}
        <button
          class="ml-0.5 p-0.5 rounded-full hover:bg-cyan-200 dark:hover:bg-cyan-800 transition-colors"
          @click="removeFilter(sel)"
        >
          <X class="w-3 h-3" />
        </button>
      </span>
      <button
        class="text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 px-2"
        @click="clearAllFilters"
      >
        {{ t('transferMarket.clearFilters') }}
      </button>
    </div>

    <!-- Position filter chips (multi-select) -->
    <div class="flex gap-2 mb-2">
      <button
        v-for="pos in positionFilters"
        :key="pos.value"
        class="flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-full transition-all"
        :class="[
          selectedPositions.includes(pos.value)
            ? `${pos.activeBg} text-white shadow-sm`
            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
        ]"
        @click="togglePosition(pos.value)"
      >
        {{ pos.label }}
      </button>
    </div>

    <!-- Preset filter chips (single-select) -->
    <div
      class="flex gap-2 overflow-x-auto scrollbar-none pb-3 -mx-4 px-4 sm:mx-0 sm:px-0"
    >
      <button
        v-for="chip in presetChips"
        :key="chip.key"
        class="flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-full transition-all"
        :class="[
          activePreset === chip.key
            ? 'bg-cyan-500 text-white shadow-sm'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
        ]"
        @click="setPreset(chip.key)"
      >
        <span v-if="chip.icon" class="mr-1">{{ chip.icon }}</span>{{ chip.label }}
      </button>
    </div>

    <!-- Toolbar: sort + count + view toggle -->
    <div class="flex items-center justify-between gap-3 mb-3">
      <!-- Sort dropdown -->
      <div class="flex items-center gap-2">
        <ArrowUpDown class="w-3.5 h-3.5 text-gray-400" />
        <select
          v-model="activeSort"
          class="text-xs font-medium bg-transparent text-gray-600 dark:text-gray-400 border-none focus:outline-none focus:ring-0 cursor-pointer appearance-none pr-4"
          :style="{ backgroundImage: 'none' }"
        >
          <option v-for="opt in sortOptions" :key="opt.key" :value="opt.key">
            {{ opt.label }}
          </option>
        </select>
      </div>

      <!-- Results count + view toggle -->
      <div class="flex items-center gap-3">
        <span class="text-xs text-gray-400 dark:text-gray-500">
          {{ filteredListings.length }} {{ t('transferMarket.listings') }}
        </span>
        <div class="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
          <button
            class="p-1.5 rounded-md transition-colors"
            :class="viewMode === 'list'
              ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'"
            @click="setViewMode('list')"
            :title="t('marketPlayers.listView')"
          >
            <List class="w-4 h-4" />
          </button>
          <button
            class="p-1.5 rounded-md transition-colors"
            :class="viewMode === 'card'
              ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white'
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'"
            @click="setViewMode('card')"
            :title="t('marketPlayers.cardView')"
          >
            <LayoutGrid class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Listings list (row view) -->
    <div v-if="viewMode === 'list'" class="flex flex-col gap-2">
      <TransferListingRow
        v-for="listing in filteredListings"
        :key="listing.player.id"
        :listing="listing"
        @click="openPlayer(listing)"
      />
    </div>

    <!-- Listings grid (card view) -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      <TransferListingCard
        v-for="listing in filteredListings"
        :key="listing.player.id"
        :listing="listing"
        @click="openPlayer(listing)"
      />
    </div>

    <!-- Empty state -->
    <div
      v-if="filteredListings.length === 0"
      class="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-8 text-center mt-4"
    >
      <Store class="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
      <p class="text-gray-500 dark:text-gray-400">{{ t('transferMarket.noListings') }}</p>
    </div>

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
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { onBeforeRouteLeave } from 'vue-router'
import { Search, ArrowUpDown, List, LayoutGrid, X, Store } from 'lucide-vue-next'
import TransferListingRow from '@/components/league/TransferListingRow.vue'
import TransferListingCard from '@/components/league/TransferListingCard.vue'
import PlayerModal from '@/components/player/PlayerModal.vue'
import { mockTransferMarketListings } from '@/mocks/leagueMock'
import { mockTeams } from '@/mocks/marketMock'
import type { TransferMarketListing, TransferMarketSortOption } from '@/types/league'
import type { Manager } from '@/types/dashboard'
import type { MarketViewMode } from '@/types/market'
import { POSITION_COLORS } from '@/types/player'

const { t } = useI18n()

type TransferPresetFilter = 'all' | 'overpriced' | 'bargains'

// Search selection with seller support
interface TransferSearchSelection {
  type: 'player' | 'team' | 'seller'
  id: string
  label: string
}

// ── Navigation guard: close modal on back button instead of leaving ──
onBeforeRouteLeave((_to, _from, next) => {
  if (selectedPlayerId.value) {
    selectedPlayerId.value = null
    next(false)
  } else {
    next()
  }
})

// ── State ──────────────────────────────────────
const searchQuery = ref('')
const searchInputRef = ref<HTMLInputElement | null>(null)
const showSuggestions = ref(false)
const highlightedIndex = ref(-1)
const selectedFilters = ref<TransferSearchSelection[]>([])
const selectedPositions = ref<number[]>([])
const activePreset = ref<TransferPresetFilter>('all')
const activeSort = ref<TransferMarketSortOption>('asking_price')
const viewMode = ref<MarketViewMode>(
  (localStorage.getItem('transferMarketViewMode') as MarketViewMode) || 'list'
)
const selectedPlayerId = ref<string | null>(null)

// Get unique sellers from listings
const allSellers = computed(() => {
  const sellerMap = new Map<string, Manager>()
  for (const listing of mockTransferMarketListings) {
    sellerMap.set(listing.seller.id, listing.seller)
  }
  return Array.from(sellerMap.values())
})

// ── Position filter chips ──────────────────────
const positionFilters = computed(() => [
  { value: 1, label: t('position.gk'), activeBg: POSITION_COLORS[1].bg },
  { value: 2, label: t('position.def'), activeBg: POSITION_COLORS[2].bg },
  { value: 3, label: t('position.mid'), activeBg: POSITION_COLORS[3].bg },
  { value: 4, label: t('position.fwd'), activeBg: POSITION_COLORS[4].bg },
])

// ── Preset filter chips ────────────────────────
const presetChips = computed(() => [
  { key: 'all' as const, label: t('transferMarket.filterAll'), icon: null },
  { key: 'overpriced' as const, label: t('transferMarket.filterOverpriced'), icon: '📈' },
  { key: 'bargains' as const, label: t('transferMarket.filterBargains'), icon: '💰' },
])

// ── Sort options ───────────────────────
const sortOptions = computed(() => [
  { key: 'asking_price' as const, label: t('transferMarket.sortAskingPrice') },
  { key: 'market_value' as const, label: t('transferMarket.sortMarketValue') },
  { key: 'price_diff' as const, label: t('transferMarket.sortPriceDiff') },
  { key: 'hours_listed' as const, label: t('transferMarket.sortTimeListed') },
  { key: 'avg_points' as const, label: t('transferMarket.sortAvgPoints') },
  { key: 'ppm' as const, label: t('transferMarket.sortPPM') },
  { key: 'value_change_7d' as const, label: t('transferMarket.sortValueChange') },
])

// ── Search suggestions ─────────────────────────
const sellerSuggestions = computed(() => {
  if (!searchQuery.value.trim()) return []
  const q = searchQuery.value.toLowerCase().trim()
  const selectedSellerIds = selectedFilters.value.filter(f => f.type === 'seller').map(f => f.id)
  return allSellers.value
    .filter(seller =>
      !selectedSellerIds.includes(seller.id) &&
      seller.name.toLowerCase().includes(q)
    )
    .slice(0, 3)
})

const teamSuggestions = computed(() => {
  if (!searchQuery.value.trim()) return []
  const q = searchQuery.value.toLowerCase().trim()
  const selectedTeamIds = selectedFilters.value.filter(f => f.type === 'team').map(f => f.id)
  // Only show teams that have players listed
  const listedTeamIds = new Set(mockTransferMarketListings.map(l => l.player.team_id))
  return mockTeams
    .filter(team =>
      !selectedTeamIds.includes(team.id) &&
      listedTeamIds.has(team.id) &&
      (team.name.toLowerCase().includes(q) || team.short_name.toLowerCase().includes(q))
    )
    .slice(0, 3)
})

const playerSuggestions = computed(() => {
  if (!searchQuery.value.trim()) return []
  const q = searchQuery.value.toLowerCase().trim()
  const selectedPlayerIds = selectedFilters.value.filter(f => f.type === 'player').map(f => f.id)
  return mockTransferMarketListings
    .filter(listing =>
      !selectedPlayerIds.includes(listing.player.id) &&
      listing.player.name.toLowerCase().includes(q)
    )
    .slice(0, 5)
})

// Reset highlight when suggestions change
watch([sellerSuggestions, teamSuggestions, playerSuggestions], () => {
  highlightedIndex.value = -1
})

// Show suggestions when search query changes
watch(searchQuery, (newVal) => {
  if (newVal.trim()) {
    showSuggestions.value = true
  }
})

// ── Derived: filtered + sorted listings ─────────
const filteredListings = computed(() => {
  let listings = [...mockTransferMarketListings]

  // Filter by selected sellers
  const selectedSellerIds = selectedFilters.value.filter(f => f.type === 'seller').map(f => f.id)
  if (selectedSellerIds.length > 0) {
    listings = listings.filter(l => selectedSellerIds.includes(l.seller.id))
  }

  // Filter by selected teams
  const selectedTeamIds = selectedFilters.value.filter(f => f.type === 'team').map(f => f.id)
  if (selectedTeamIds.length > 0) {
    listings = listings.filter(l => selectedTeamIds.includes(l.player.team_id))
  }

  // Filter by selected players
  const selectedPlayerIds = selectedFilters.value.filter(f => f.type === 'player').map(f => f.id)
  if (selectedPlayerIds.length > 0) {
    listings = listings.filter(l => selectedPlayerIds.includes(l.player.id))
  }

  // Position filter (multi-select)
  if (selectedPositions.value.length > 0) {
    listings = listings.filter(l => selectedPositions.value.includes(l.player.position))
  }

  // Preset filter
  switch (activePreset.value) {
    case 'overpriced':
      listings = listings.filter(l => l.price_diff > 0)
      break
    case 'bargains':
      listings = listings.filter(l => l.price_diff < 0)
      break
  }

  // Sort
  const sortKey = activeSort.value
  listings.sort((a, b) => {
    let aVal: number
    let bVal: number

    switch (sortKey) {
      case 'asking_price':
        aVal = a.asking_price
        bVal = b.asking_price
        break
      case 'market_value':
        aVal = a.player.market_value
        bVal = b.player.market_value
        break
      case 'price_diff':
        // Sort by absolute difference, show biggest discounts first
        aVal = a.price_diff
        bVal = b.price_diff
        return aVal - bVal // ascending (negative = bargain first)
      case 'hours_listed':
        aVal = a.hours_listed
        bVal = b.hours_listed
        return bVal - aVal // longest listed first
      case 'avg_points':
        aVal = a.player.avg_points
        bVal = b.player.avg_points
        break
      case 'ppm':
        aVal = a.player.ppm
        bVal = b.player.ppm
        break
      case 'value_change_7d':
        aVal = a.player.value_change_7d
        bVal = b.player.value_change_7d
        break
      default:
        aVal = 0
        bVal = 0
    }

    return bVal - aVal // default: descending
  })

  return listings
})

// ── Actions ────────────────────────────────────
function togglePosition(pos: number) {
  const idx = selectedPositions.value.indexOf(pos)
  if (idx >= 0) {
    selectedPositions.value.splice(idx, 1)
  } else {
    selectedPositions.value.push(pos)
  }
}

function setPreset(key: TransferPresetFilter) {
  activePreset.value = key
}

function setViewMode(mode: MarketViewMode) {
  viewMode.value = mode
  localStorage.setItem('transferMarketViewMode', mode)
}

function openPlayer(listing: TransferMarketListing) {
  selectedPlayerId.value = listing.player.id
}

// ── Search autocomplete actions ────────────────
function onBlur() {
  setTimeout(() => {
    showSuggestions.value = false
    highlightedIndex.value = -1
  }, 300)
}

function onInputNative(event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value
  searchQuery.value = value
  if (value.trim()) {
    showSuggestions.value = true
  }
}

function navigateSuggestion(dir: number) {
  const total = sellerSuggestions.value.length + teamSuggestions.value.length + playerSuggestions.value.length
  if (total === 0) return
  highlightedIndex.value = (highlightedIndex.value + dir + total) % total
}

function selectHighlighted() {
  if (highlightedIndex.value < 0) return

  const sellerCount = sellerSuggestions.value.length
  const teamCount = teamSuggestions.value.length

  if (highlightedIndex.value < sellerCount) {
    selectSeller(sellerSuggestions.value[highlightedIndex.value])
  } else if (highlightedIndex.value < sellerCount + teamCount) {
    selectTeam(teamSuggestions.value[highlightedIndex.value - sellerCount])
  } else {
    const playerIdx = highlightedIndex.value - sellerCount - teamCount
    selectPlayer(playerSuggestions.value[playerIdx])
  }
}

function selectSeller(seller: Manager) {
  selectedFilters.value.push({
    type: 'seller',
    id: seller.id,
    label: seller.name,
  })
  searchQuery.value = ''
  showSuggestions.value = false
  highlightedIndex.value = -1
}

function selectTeam(team: typeof mockTeams[0]) {
  selectedFilters.value.push({
    type: 'team',
    id: team.id,
    label: team.name,
  })
  searchQuery.value = ''
  showSuggestions.value = false
  highlightedIndex.value = -1
}

function selectPlayer(listing: TransferMarketListing) {
  selectedFilters.value.push({
    type: 'player',
    id: listing.player.id,
    label: listing.player.name,
  })
  searchQuery.value = ''
  showSuggestions.value = false
  highlightedIndex.value = -1
}

function removeFilter(sel: TransferSearchSelection) {
  const idx = selectedFilters.value.findIndex(f => f.type === sel.type && f.id === sel.id)
  if (idx >= 0) {
    selectedFilters.value.splice(idx, 1)
  }
}

function clearAllFilters() {
  selectedFilters.value = []
}

function getTeamLogo(teamId: string): string {
  const team = mockTeams.find(t => t.id === teamId)
  return team?.logo || ''
}

function getSellerImage(sellerId: string): string {
  const seller = allSellers.value.find(s => s.id === sellerId)
  return seller?.profile_image || ''
}
</script>

<style scoped>
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
</style>
