<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 flex flex-col min-h-[calc(100vh-180px)]">

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
        :placeholder="t('compare.searchPlaceholder')"
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
        v-if="showSuggestions && playerSuggestions.length > 0"
        class="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto"
      >
        <div class="px-3 py-1.5 text-[10px] font-semibold uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50">
          {{ t('marketPlayers.searchPlayers') }}
        </div>
        <button
          v-for="(player, idx) in playerSuggestions"
          :key="`player-${player.id}`"
          class="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          :class="{ 'bg-cyan-50 dark:bg-cyan-900/20': highlightedIndex === idx }"
          @mousedown.prevent="addPlayer(player)"
        >
          <img :src="player.profile_image" :alt="player.name" class="w-6 h-6 rounded-full object-cover bg-gray-200 dark:bg-gray-700" />
          <span class="text-sm text-gray-900 dark:text-white">{{ player.name }}</span>
          <span
            class="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded text-white"
            :class="POSITION_COLORS[player.position].bg"
          >
            {{ positionLabel(player.position) }}
          </span>
          <span class="text-xs text-gray-400">{{ player.team_short_name }}</span>
        </button>
      </div>
    </div>

    <!-- Selected player chips -->
    <div v-if="selectedPlayers.length > 0" class="flex flex-wrap gap-1.5 mb-4">
      <span
        v-for="player in selectedPlayers"
        :key="player.id"
        class="inline-flex items-center gap-1.5 pl-2 pr-1 py-1 text-xs font-medium rounded-full bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300"
      >
        <span
          class="w-2 h-2 rounded-full flex-shrink-0"
          :class="POSITION_COLORS[player.position].bg"
        />
        {{ player.name }}
        <span class="text-[10px] text-cyan-500 dark:text-cyan-400">{{ player.team_short_name }}</span>
        <button
          class="ml-0.5 p-0.5 rounded-full hover:bg-cyan-200 dark:hover:bg-cyan-800 transition-colors"
          @click="removePlayer(player.id)"
        >
          <X class="w-3 h-3" />
        </button>
      </span>
      <button
        v-if="selectedPlayers.length >= 2"
        class="text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 px-2"
        @click="clearAll"
      >
        {{ t('compare.clearAll') }}
      </button>
    </div>

    <!-- Empty state - fills remaining space on mobile for proper swiping -->
    <div
      v-if="selectedPlayers.length === 0"
      class="flex-1 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-gray-800/50 p-8 text-center"
    >
      <div>
        <GitCompare class="w-10 h-10 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
        <p class="text-gray-900 dark:text-white font-medium mb-1">{{ t('compare.addPlayers') }}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('compare.addPlayersDesc') }}</p>
      </div>
    </div>

    <!-- Radar chart (1+ players) -->
    <CompareRadarChart
      v-if="selectedPlayers.length >= 1"
      :players="selectedPlayers"
      :all-players="allPlayers"
      class="mb-4"
    />

    <!-- Stats comparison table (1+ players) -->
    <div
      v-if="selectedPlayers.length >= 1"
      class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div class="overflow-x-auto scrollbar-none">
        <table class="w-full text-xs md:text-sm">
          <!-- Player header row -->
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="sticky left-0 z-10 bg-white dark:bg-gray-900 px-3 py-3 text-left text-xs md:text-sm font-semibold text-gray-500 dark:text-gray-400 min-w-[140px] md:min-w-[160px]">
                &nbsp;
              </th>
              <th
                v-for="player in selectedPlayers"
                :key="`header-${player.id}`"
                class="px-3 py-3 text-center min-w-[120px] md:min-w-[140px]"
              >
                <div class="flex flex-col items-center gap-1">
                  <img :src="player.profile_image" :alt="player.name" class="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover bg-gray-200 dark:bg-gray-700" />
                  <span class="text-xs md:text-sm font-semibold text-gray-900 dark:text-white leading-tight">{{ player.name }}</span>
                  <div class="flex items-center gap-1">
                    <span
                      class="text-[9px] md:text-[10px] font-bold uppercase px-1.5 py-px rounded text-white"
                      :class="POSITION_COLORS[player.position].bg"
                    >
                      {{ positionLabel(player.position) }}
                    </span>
                    <img :src="player.team_logo" :alt="player.team_short_name" class="w-3.5 h-3.5 md:w-4 md:h-4 object-contain" />
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <!-- Section: Performance -->
            <tr>
              <td class="sticky left-0 z-10 bg-gray-50 dark:bg-gray-800/50 px-3 py-2">
                <span class="text-[10px] md:text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                  {{ t('compare.performance') }}
                </span>
              </td>
              <td
                v-for="player in selectedPlayers"
                :key="`perf-section-${player.id}`"
                class="bg-gray-50 dark:bg-gray-800/50 px-3 py-2"
              />
            </tr>
            <template v-for="row in performanceRows" :key="row.key">
              <tr class="border-t border-gray-100 dark:border-gray-800">
                <td class="sticky left-0 z-10 bg-white dark:bg-gray-900 px-3 py-2.5 md:py-3 text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">
                  {{ row.label }}
                </td>
                <td
                  v-for="player in selectedPlayers"
                  :key="`${row.key}-${player.id}`"
                  class="px-3 py-2.5 md:py-3 text-center text-xs md:text-sm font-semibold"
                  :class="isBestValue(row, player) ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/30' : 'text-gray-900 dark:text-white'"
                >
                  {{ row.format(row.getValue(player)) }}
                  <span
                    v-if="positionRank(row, player) !== null"
                    class="ml-1 text-[9px] md:text-[10px] font-bold px-1 py-px rounded"
                    :class="POSITION_COLORS[player.position].bg + ' text-white'"
                  >
                    #{{ positionRank(row, player) }}
                  </span>
                </td>
              </tr>
            </template>

            <!-- Section: Efficiency -->
            <tr>
              <td class="sticky left-0 z-10 bg-gray-50 dark:bg-gray-800/50 px-3 py-2">
                <span class="text-[10px] md:text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                  {{ t('compare.efficiency') }}
                </span>
              </td>
              <td
                v-for="player in selectedPlayers"
                :key="`eff-section-${player.id}`"
                class="bg-gray-50 dark:bg-gray-800/50 px-3 py-2"
              />
            </tr>
            <template v-for="row in efficiencyRows" :key="row.key">
              <tr class="border-t border-gray-100 dark:border-gray-800">
                <td class="sticky left-0 z-10 bg-white dark:bg-gray-900 px-3 py-2.5 md:py-3 text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">
                  {{ row.label }}
                </td>
                <td
                  v-for="player in selectedPlayers"
                  :key="`${row.key}-${player.id}`"
                  class="px-3 py-2.5 md:py-3 text-center text-xs md:text-sm font-semibold"
                  :class="isBestValue(row, player) ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/30' : 'text-gray-900 dark:text-white'"
                >
                  {{ row.format(row.getValue(player)) }}
                  <span
                    v-if="positionRank(row, player) !== null"
                    class="ml-1 text-[9px] md:text-[10px] font-bold px-1 py-px rounded"
                    :class="POSITION_COLORS[player.position].bg + ' text-white'"
                  >
                    #{{ positionRank(row, player) }}
                  </span>
                </td>
              </tr>
            </template>

            <!-- Section: Offense -->
            <tr>
              <td class="sticky left-0 z-10 bg-gray-50 dark:bg-gray-800/50 px-3 py-2">
                <span class="text-[10px] md:text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                  {{ t('compare.offense') }}
                </span>
              </td>
              <td
                v-for="player in selectedPlayers"
                :key="`off-section-${player.id}`"
                class="bg-gray-50 dark:bg-gray-800/50 px-3 py-2"
              />
            </tr>
            <template v-for="row in offenseRows" :key="row.key">
              <tr class="border-t border-gray-100 dark:border-gray-800">
                <td class="sticky left-0 z-10 bg-white dark:bg-gray-900 px-3 py-2.5 md:py-3 text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">
                  {{ row.label }}
                </td>
                <td
                  v-for="player in selectedPlayers"
                  :key="`${row.key}-${player.id}`"
                  class="px-3 py-2.5 md:py-3 text-center text-xs md:text-sm font-semibold"
                  :class="isBestValue(row, player) ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/30' : 'text-gray-900 dark:text-white'"
                >
                  {{ row.format(row.getValue(player)) }}
                  <span
                    v-if="positionRank(row, player) !== null"
                    class="ml-1 text-[9px] md:text-[10px] font-bold px-1 py-px rounded"
                    :class="POSITION_COLORS[player.position].bg + ' text-white'"
                  >
                    #{{ positionRank(row, player) }}
                  </span>
                </td>
              </tr>
            </template>

            <!-- Section: Splits -->
            <tr>
              <td class="sticky left-0 z-10 bg-gray-50 dark:bg-gray-800/50 px-3 py-2">
                <span class="text-[10px] md:text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                  {{ t('compare.splits') }}
                </span>
              </td>
              <td
                v-for="player in selectedPlayers"
                :key="`splits-section-${player.id}`"
                class="bg-gray-50 dark:bg-gray-800/50 px-3 py-2"
              />
            </tr>
            <template v-for="row in splitsRows" :key="row.key">
              <tr class="border-t border-gray-100 dark:border-gray-800">
                <td class="sticky left-0 z-10 bg-white dark:bg-gray-900 px-3 py-2.5 md:py-3 text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">
                  {{ row.label }}
                </td>
                <td
                  v-for="player in selectedPlayers"
                  :key="`${row.key}-${player.id}`"
                  class="px-3 py-2.5 md:py-3 text-center text-xs md:text-sm font-semibold"
                  :class="isBestValue(row, player) ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/30' : 'text-gray-900 dark:text-white'"
                >
                  {{ row.format(row.getValue(player)) }}
                  <span
                    v-if="positionRank(row, player) !== null"
                    class="ml-1 text-[9px] md:text-[10px] font-bold px-1 py-px rounded"
                    :class="POSITION_COLORS[player.position].bg + ' text-white'"
                  >
                    #{{ positionRank(row, player) }}
                  </span>
                </td>
              </tr>
            </template>

            <!-- Section: Value -->
            <tr>
              <td class="sticky left-0 z-10 bg-gray-50 dark:bg-gray-800/50 px-3 py-2">
                <span class="text-[10px] md:text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                  {{ t('compare.valueTrends') }}
                </span>
              </td>
              <td
                v-for="player in selectedPlayers"
                :key="`value-section-${player.id}`"
                class="bg-gray-50 dark:bg-gray-800/50 px-3 py-2"
              />
            </tr>
            <template v-for="row in valueRows" :key="row.key">
              <tr class="border-t border-gray-100 dark:border-gray-800">
                <td class="sticky left-0 z-10 bg-white dark:bg-gray-900 px-3 py-2.5 md:py-3 text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">
                  {{ row.label }}
                </td>
                <td
                  v-for="player in selectedPlayers"
                  :key="`${row.key}-${player.id}`"
                  class="px-3 py-2.5 md:py-3 text-center text-xs md:text-sm font-semibold"
                  :class="isBestValue(row, player) ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/30' : 'text-gray-900 dark:text-white'"
                >
                  {{ row.format(row.getValue(player)) }}
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Search, X, GitCompare } from 'lucide-vue-next'
import CompareRadarChart from '@/components/market/CompareRadarChart.vue'
import { mockMarketPlayers } from '@/mocks/marketMock'
import type { MarketPlayer } from '@/types/market'
import { POSITION_COLORS, POSITION_LABELS } from '@/types/player'

const { t } = useI18n()

// ── State ──────────────────────────────────────
const searchQuery = ref('')
const searchInputRef = ref<HTMLInputElement | null>(null)
const showSuggestions = ref(false)
const highlightedIndex = ref(-1)
const selectedPlayers = ref<MarketPlayer[]>(loadSelectedPlayers())

const allPlayers = mockMarketPlayers

// ── LocalStorage persistence ───────────────────
const STORAGE_KEY = 'marketComparePlayerIds'

function loadSelectedPlayers(): MarketPlayer[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const ids: string[] = JSON.parse(stored)
    return ids
      .map(id => mockMarketPlayers.find(p => p.id === id))
      .filter((p): p is MarketPlayer => p !== undefined)
  } catch {
    return []
  }
}

function saveSelectedPlayers() {
  const ids = selectedPlayers.value.map(p => p.id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
}

watch(selectedPlayers, () => {
  saveSelectedPlayers()
}, { deep: true })

// ── Search suggestions ─────────────────────────
const playerSuggestions = computed(() => {
  if (!searchQuery.value.trim()) return []
  const q = searchQuery.value.toLowerCase().trim()
  const selectedIds = new Set(selectedPlayers.value.map(p => p.id))
  return allPlayers
    .filter(player =>
      !selectedIds.has(player.id) &&
      player.name.toLowerCase().includes(q)
    )
    .slice(0, 8)
})

// Reset highlight when suggestions change
watch(playerSuggestions, () => {
  highlightedIndex.value = -1
})

// Show suggestions when search query changes
watch(searchQuery, (newVal) => {
  if (newVal.trim()) {
    showSuggestions.value = true
  }
})

// ── Position helpers ───────────────────────────
function positionLabel(pos: number): string {
  return POSITION_LABELS[pos] || ''
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
  searchQuery.value = target.value
  if (target.value.trim()) {
    showSuggestions.value = true
  }
}

function navigateSuggestion(dir: number) {
  const total = playerSuggestions.value.length
  if (total === 0) return
  highlightedIndex.value = (highlightedIndex.value + dir + total) % total
}

function selectHighlighted() {
  if (highlightedIndex.value < 0 || highlightedIndex.value >= playerSuggestions.value.length) return
  addPlayer(playerSuggestions.value[highlightedIndex.value])
}

function addPlayer(player: MarketPlayer) {
  if (selectedPlayers.value.some(p => p.id === player.id)) return
  selectedPlayers.value.push(player)
  searchQuery.value = ''
  showSuggestions.value = false
  highlightedIndex.value = -1
}

function removePlayer(id: string) {
  selectedPlayers.value = selectedPlayers.value.filter(p => p.id !== id)
}

function clearAll() {
  selectedPlayers.value = []
  localStorage.removeItem(STORAGE_KEY)
}

// ── Stat row definitions ───────────────────────

interface StatRow {
  key: string
  label: string
  getValue: (p: MarketPlayer) => number
  format: (v: number) => string
  lowerIsBetter?: boolean
  noRank?: boolean
}

const fmtDec1 = (v: number) => v.toFixed(1)
const fmtDec3 = (v: number) => v.toFixed(3)
const fmtInt = (v: number) => String(Math.round(v))
const fmtPct = (v: number) => `${Math.round(v)}%`
const fmtMoney = (v: number) => {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`
  return String(v)
}
const fmtMoneyChange = (v: number) => {
  const prefix = v >= 0 ? '+' : ''
  return prefix + fmtMoney(v)
}

const performanceRows = computed<StatRow[]>(() => [
  { key: 'total_points', label: t('compare.totalPoints'), getValue: p => p.total_points, format: fmtInt },
  { key: 'avg_points', label: t('compare.avgPoints'), getValue: p => p.avg_points, format: fmtDec1 },
  { key: 'form', label: t('compare.form'), getValue: p => p.form, format: fmtDec1 },
  { key: 'season_avg', label: t('compare.seasonAvg'), getValue: p => p.season_avg, format: fmtDec1 },
])

const efficiencyRows = computed<StatRow[]>(() => [
  { key: 'ppm', label: t('compare.ppm'), getValue: p => p.ppm, format: fmtDec1 },
  { key: 'points_per_minute', label: t('compare.pointsPerMinute'), getValue: p => p.points_per_minute, format: fmtDec3 },
  { key: 'raw_points_avg', label: t('compare.rawPoints'), getValue: p => p.raw_points_avg, format: fmtDec1 },
  { key: 'stability', label: t('compare.stability'), getValue: p => p.stability, format: fmtDec1, lowerIsBetter: true },
])

const offenseRows = computed<StatRow[]>(() => [
  { key: 'goals', label: t('compare.goals'), getValue: p => p.goals, format: fmtInt },
  { key: 'assists', label: t('compare.assists'), getValue: p => p.assists, format: fmtInt },
  { key: 'appearances', label: t('compare.appearances'), getValue: p => p.appearances, format: fmtInt },
])

const splitsRows = computed<StatRow[]>(() => [
  { key: 'home_avg', label: t('compare.homeAvg'), getValue: p => p.home_avg, format: fmtDec1 },
  { key: 'away_avg', label: t('compare.awayAvg'), getValue: p => p.away_avg, format: fmtDec1 },
  { key: 'avg_points_win', label: t('compare.winAvg'), getValue: p => p.avg_points_win, format: fmtDec1 },
  { key: 'avg_points_draw', label: t('compare.drawAvg'), getValue: p => p.avg_points_draw, format: fmtDec1 },
  { key: 'avg_points_loss', label: t('compare.lossAvg'), getValue: p => p.avg_points_loss, format: fmtDec1 },
  { key: 'result_sensitivity', label: t('compare.resultSensitivity'), getValue: p => p.result_sensitivity, format: fmtPct },
])

const valueRows = computed<StatRow[]>(() => [
  { key: 'market_value', label: t('compare.marketValue'), getValue: p => p.market_value, format: fmtMoney, noRank: true },
  { key: 'value_change_7d', label: t('compare.valueChange7d'), getValue: p => p.value_change_7d, format: fmtMoneyChange, noRank: true },
  { key: 'value_change_30d', label: t('compare.valueChange30d'), getValue: p => p.value_change_30d, format: fmtMoneyChange, noRank: true },
])

// ── Position ranking logic ─────────────────────

function positionRank(row: StatRow, player: MarketPlayer): number | null {
  if (row.noRank) return null

  const samePos = allPlayers.filter(p => p.position === player.position)
  const sorted = [...samePos].sort((a, b) => {
    const aVal = row.getValue(a)
    const bVal = row.getValue(b)
    return row.lowerIsBetter ? aVal - bVal : bVal - aVal
  })
  const idx = sorted.findIndex(p => p.id === player.id)
  return idx >= 0 ? idx + 1 : null
}

// ── Best value highlighting ────────────────────

function isBestValue(row: StatRow, player: MarketPlayer): boolean {
  if (selectedPlayers.value.length < 2) return false

  const playerVal = row.getValue(player)
  const allVals = selectedPlayers.value.map(p => row.getValue(p))

  if (row.lowerIsBetter) {
    const minVal = Math.min(...allVals)
    return playerVal === minVal
  }

  const maxVal = Math.max(...allVals)
  return playerVal === maxVal
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
