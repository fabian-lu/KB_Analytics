<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 space-y-4">

    <!-- Header row -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <h2 class="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
          {{ t('watchlist.title') }}
        </h2>
        <span
          v-if="watchlistPlayers.length > 0"
          class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full"
        >
          {{ t('watchlist.playersWatched', { count: watchlistPlayers.length }) }}
        </span>
      </div>
      <button
        v-if="watchlistIds.length > 0"
        class="text-xs text-red-500 hover:text-red-600 dark:hover:text-red-400 font-medium"
        @click="showClearConfirm = true"
      >
        {{ t('watchlist.clearAll') }}
      </button>
    </div>

    <!-- Search bar to add players -->
    <div class="relative">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
      <input
        ref="searchInputRef"
        v-model="searchQuery"
        type="search"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
        :placeholder="t('watchlist.addPlayer')"
        class="w-full pl-10 pr-4 py-2.5 text-sm md:text-base rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-colors"
        @focus="showDropdown = true"
        @blur="onBlur"
        @input="onInputNative"
        @keyup="onInputNative"
      />

      <!-- Suggestions dropdown -->
      <div
        v-if="showDropdown && filteredSuggestions.length > 0"
        class="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto"
      >
        <button
          v-for="player in filteredSuggestions"
          :key="player.id"
          class="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          @mousedown.prevent="addToWatchlist(player)"
        >
          <span
            class="w-2 h-2 rounded-full flex-shrink-0"
            :class="POSITION_COLORS[player.position].bg"
          />
          <img :src="player.profile_image" :alt="player.name" class="w-7 h-7 rounded-full object-cover bg-gray-200 flex-shrink-0" />
          <div class="flex-1 min-w-0">
            <span class="text-sm text-gray-900 dark:text-white truncate block">{{ player.name }}</span>
            <span class="text-xs text-gray-400">{{ player.team_short_name }}</span>
          </div>
          <Plus class="w-4 h-4 text-cyan-500 flex-shrink-0" />
        </button>
      </div>
    </div>

    <!-- Position filters -->
    <div v-if="watchlistPlayers.length > 0" class="flex items-center gap-2 flex-wrap">
      <button
        v-for="pos in positionFilters"
        :key="pos.key"
        class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
        :class="activePositions.has(pos.value)
          ? `${pos.activeBg} text-white`
          : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'"
        @click="togglePosition(pos.value)"
      >
        {{ pos.label }}
      </button>
    </div>

    <!-- Empty state -->
    <div
      v-if="watchlistIds.length === 0"
      class="py-16 text-center"
    >
      <Star class="w-16 h-16 mx-auto text-gray-200 dark:text-gray-700 mb-4" />
      <p class="text-base font-medium text-gray-500 dark:text-gray-400 mb-2">
        {{ t('watchlist.empty') }}
      </p>
      <p class="text-sm text-gray-400 dark:text-gray-500 mb-6">
        {{ t('watchlist.emptyDesc') }}
      </p>
      <router-link
        to="/market/players"
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 text-white text-sm font-medium hover:bg-cyan-600 transition-colors"
      >
        <Users class="w-4 h-4" />
        {{ t('watchlist.goToPlayers') }}
      </router-link>
    </div>

    <!-- Watchlist table -->
    <div v-else class="space-y-2">
      <div v-for="player in displayedPlayers" :key="player.id">
        <!-- Player row -->
        <div class="relative">
          <PlayerRow :player="player" @click="toggleExpanded(player.id)" @image-click="openPlayerModal(player.id)" />
          <!-- Remove button (top-right) -->
          <button
            class="absolute top-2 right-2 p-1.5 rounded-lg text-gray-300 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors z-10"
            :title="t('watchlist.removePlayer')"
            @click.stop="removeFromWatchlist(player.id)"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Expanded section (similar players + notes) -->
        <div
          v-if="expandedPlayerId === player.id"
          class="bg-gray-50 dark:bg-gray-800/30 rounded-b-xl border border-t-0 border-gray-100 dark:border-gray-800 -mt-1 overflow-hidden"
        >
          <!-- Notes -->
          <div class="px-4 pt-4 pb-3 border-b border-gray-200 dark:border-gray-700">
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">{{ t('watchlist.notes') }}</p>
            <textarea
              :value="getNote(player.id)"
              :placeholder="t('watchlist.notesPlaceholder')"
              class="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 resize-none"
              rows="2"
              @input="onNoteInput(player.id, $event)"
            />
          </div>

          <!-- Similar players -->
          <div class="px-4 pt-3 pb-4">
            <div class="flex items-center justify-between mb-3">
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">{{ t('watchlist.similarPlayers') }}</p>
              <button
                class="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium transition-colors"
                :class="cheaperOnly
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'"
                @click="cheaperOnly = !cheaperOnly"
              >
                <span
                  class="w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center"
                  :class="cheaperOnly ? 'border-emerald-500' : 'border-gray-400'"
                >
                  <span v-if="cheaperOnly" class="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </span>
                {{ t('watchlist.cheaperOnly') }}
              </button>
            </div>

            <div v-if="getSimilarPlayers(player).length > 0" class="space-y-1">
              <button
                v-for="result in getSimilarPlayers(player)"
                :key="result.player.id"
                class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors text-left"
                @click="openPlayerModal(result.player.id)"
              >
                <!-- Player image -->
                <div class="relative flex-shrink-0">
                  <img
                    :src="result.player.profile_image"
                    :alt="result.player.name"
                    class="w-9 h-9 rounded-full object-cover bg-gray-200 dark:bg-gray-700"
                  />
                  <span
                    class="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold text-white"
                    :class="POSITION_COLORS[result.player.position].bg"
                  >
                    {{ posLabel(result.player.position) }}
                  </span>
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {{ result.player.name }}
                  </div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {{ result.player.team_short_name }} &middot; {{ formatMoney(result.player.market_value) }}
                  </div>
                </div>

                <!-- Comparison stats -->
                <div class="text-right flex-shrink-0">
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {{ t('marketPlayers.avg') }}: {{ result.player.avg_points }}
                  </div>
                  <div
                    class="text-xs font-medium"
                    :class="result.priceDiff < 0 ? 'text-emerald-500' : 'text-orange-500'"
                  >
                    {{ result.priceDiff < 0 ? '' : '+' }}{{ formatMoney(result.priceDiff) }}
                  </div>
                </div>

                <!-- Similarity badge -->
                <span class="flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400">
                  {{ result.similarity }}%
                </span>
              </button>
            </div>
            <p v-else class="text-xs text-gray-400 dark:text-gray-500 text-center py-3">
              {{ t('analysis.noSimilarPlayers') }}
            </p>
          </div>
        </div>
      </div>

      <!-- No results after filtering -->
      <div v-if="displayedPlayers.length === 0 && watchlistPlayers.length > 0" class="py-8 text-center">
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('marketPlayers.noResults') }}</p>
      </div>
    </div>

    <!-- Player Modal -->
    <PlayerModal
      v-if="selectedPlayerId"
      :open="!!selectedPlayerId"
      :player-id="selectedPlayerId"
      @close="selectedPlayerId = null"
    />

    <!-- Clear all confirm -->
    <ConfirmModal
      :open="showClearConfirm"
      :title="t('watchlist.clearConfirmTitle')"
      :message="t('watchlist.clearConfirmMessage')"
      @close="showClearConfirm = false"
      @confirm="clearAll(); showClearConfirm = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { onBeforeRouteLeave } from 'vue-router'
import { Search, Plus, Star, X, Users } from 'lucide-vue-next'
import type { MarketPlayer } from '@/types/market'
import type { SimilarPlayerResult } from '@/types/analysis'
import { POSITION_COLORS } from '@/types/player'
import { mockMarketPlayers } from '@/mocks/marketMock'
import PlayerRow from '@/components/market/PlayerRow.vue'
import PlayerModal from '@/components/player/PlayerModal.vue'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'

const { t } = useI18n()

// ── Navigation guard: close modal on back button instead of leaving ──
onBeforeRouteLeave((_to, _from, next) => {
  if (selectedPlayerId.value) {
    selectedPlayerId.value = null
    next(false)
  } else {
    next()
  }
})

// ── LocalStorage keys ────────────────────────────
const LS_IDS = 'kickbase_watchlist_ids'
const LS_NOTES = 'kickbase_watchlist_notes'

function loadIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(LS_IDS) || '[]')
  } catch { return [] }
}
function saveIds(ids: string[]) {
  localStorage.setItem(LS_IDS, JSON.stringify(ids))
}
function loadNotes(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(LS_NOTES) || '{}')
  } catch { return {} }
}
function saveNotes(notes: Record<string, string>) {
  localStorage.setItem(LS_NOTES, JSON.stringify(notes))
}

// ── State ────────────────────────────────────────
const watchlistIds = ref<string[]>(loadIds())
const notes = ref<Record<string, string>>(loadNotes())
const searchQuery = ref('')
const showDropdown = ref(false)
const expandedPlayerId = ref<string | null>(null)
const cheaperOnly = ref(true)
const activePositions = ref(new Set<number>())
const selectedPlayerId = ref<string | null>(null)
const showClearConfirm = ref(false)

// ── Persist on change ────────────────────────────
watch(watchlistIds, (ids) => saveIds(ids), { deep: true })
watch(notes, (n) => saveNotes(n), { deep: true })

// ── Lookup ───────────────────────────────────────
const playerById = computed(() => {
  const map = new Map<string, MarketPlayer>()
  for (const p of mockMarketPlayers) map.set(p.id, p)
  return map
})

const watchlistPlayers = computed(() =>
  watchlistIds.value
    .map(id => playerById.value.get(id))
    .filter((p): p is MarketPlayer => !!p)
)

const displayedPlayers = computed(() => {
  if (activePositions.value.size === 0) return watchlistPlayers.value
  return watchlistPlayers.value.filter(p => activePositions.value.has(p.position))
})

// ── Search suggestions ───────────────────────────
const watchlistIdSet = computed(() => new Set(watchlistIds.value))

const filteredSuggestions = computed(() => {
  if (!searchQuery.value.trim()) return []
  const q = searchQuery.value.toLowerCase()
  return mockMarketPlayers
    .filter(p =>
      !watchlistIdSet.value.has(p.id) &&
      (p.name.toLowerCase().includes(q) || p.team_short_name.toLowerCase().includes(q))
    )
    .slice(0, 8)
})

// ── Actions ──────────────────────────────────────
function addToWatchlist(player: MarketPlayer) {
  if (!watchlistIds.value.includes(player.id)) {
    watchlistIds.value = [...watchlistIds.value, player.id]
  }
  searchQuery.value = ''
  showDropdown.value = false
}

function removeFromWatchlist(playerId: string) {
  watchlistIds.value = watchlistIds.value.filter(id => id !== playerId)
  if (expandedPlayerId.value === playerId) {
    expandedPlayerId.value = null
  }
  // Clean up note
  const newNotes = { ...notes.value }
  delete newNotes[playerId]
  notes.value = newNotes
}

function clearAll() {
  watchlistIds.value = []
  notes.value = {}
  expandedPlayerId.value = null
}

function toggleExpanded(playerId: string) {
  expandedPlayerId.value = expandedPlayerId.value === playerId ? null : playerId
}

function getNote(playerId: string): string {
  return notes.value[playerId] || ''
}

function onNoteInput(playerId: string, event: Event) {
  const target = event.target as HTMLTextAreaElement
  notes.value = { ...notes.value, [playerId]: target.value }
}

function openPlayerModal(playerId: string) {
  selectedPlayerId.value = playerId
}

// ── Position filter ──────────────────────────────
const positionFilters = [
  { key: 'all', value: 0, label: t('marketPlayers.chipAll'), activeBg: 'bg-gray-700' },
  { key: 'gk', value: 1, label: t('position.gk'), activeBg: 'bg-amber-500' },
  { key: 'def', value: 2, label: t('position.def'), activeBg: 'bg-blue-500' },
  { key: 'mid', value: 3, label: t('position.mid'), activeBg: 'bg-emerald-500' },
  { key: 'fwd', value: 4, label: t('position.fwd'), activeBg: 'bg-rose-500' },
]

function togglePosition(pos: number) {
  if (pos === 0) {
    activePositions.value = new Set()
    return
  }
  const newSet = new Set(activePositions.value)
  if (newSet.has(pos)) {
    newSet.delete(pos)
  } else {
    newSet.add(pos)
  }
  activePositions.value = newSet
}

// ── Search handlers ──────────────────────────────
function onInputNative(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.value !== searchQuery.value) {
    searchQuery.value = target.value
  }
  showDropdown.value = true
}

function onBlur() {
  setTimeout(() => {
    showDropdown.value = false
  }, 200)
}

// ── Similar players logic ────────────────────────
function findSimilarPlayers(
  target: MarketPlayer,
  maxResults: number,
  onlyCheaper: boolean,
): SimilarPlayerResult[] {
  let candidates = mockMarketPlayers.filter(p =>
    p.id !== target.id && p.position === target.position
  )
  if (onlyCheaper) {
    candidates = candidates.filter(p => p.market_value < target.market_value)
  }

  const scored = candidates.map(player => {
    const pointsDiff = Math.abs(player.avg_points - target.avg_points)
    const formDiff = Math.abs(player.form - target.form)
    const ppmDiff = Math.abs(player.ppm - target.ppm)

    const pointsScore = pointsDiff / (target.avg_points || 1)
    const formScore = formDiff / (target.form || 1)
    const ppmScore = ppmDiff / (target.ppm || 1)

    const rawScore = pointsScore * 0.4 + formScore * 0.3 + ppmScore * 0.3
    const similarity = Math.max(0, Math.round((1 - rawScore) * 100))

    return {
      player,
      similarity,
      priceDiff: player.market_value - target.market_value,
      pointsDiff: player.avg_points - target.avg_points,
    }
  })

  return scored.sort((a, b) => b.similarity - a.similarity).slice(0, maxResults)
}

function getSimilarPlayers(player: MarketPlayer): SimilarPlayerResult[] {
  return findSimilarPlayers(player, 4, cheaperOnly.value)
}

// ── Helpers ──────────────────────────────────────
const posLabel = (pos: number) => {
  const labels: Record<number, string> = { 1: 'G', 2: 'D', 3: 'M', 4: 'F' }
  return labels[pos] || '?'
}

function formatMoney(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M \u20AC`
  if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(0)}K \u20AC`
  return `${value} \u20AC`
}
</script>
