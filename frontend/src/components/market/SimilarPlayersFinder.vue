<template>
  <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
    <!-- Header -->
    <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-lg">🔍</span>
          <h3 class="text-sm md:text-base font-semibold text-gray-900 dark:text-white">
            {{ t('analysis.similarPlayers') }}
          </h3>
        </div>
        <!-- Cheaper only toggle -->
        <button
          class="flex items-center gap-2 px-2 py-1 rounded-lg text-xs font-medium transition-colors"
          :class="cheaperOnly
            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'"
          @click="cheaperOnly = !cheaperOnly"
        >
          <span class="w-4 h-4 rounded-full border-2 flex items-center justify-center"
            :class="cheaperOnly ? 'border-emerald-500' : 'border-gray-400'"
          >
            <span v-if="cheaperOnly" class="w-2 h-2 rounded-full bg-emerald-500" />
          </span>
          {{ t('analysis.cheaperOnly') }}
        </button>
      </div>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {{ cheaperOnly ? t('analysis.similarPlayersDescCheaper') : t('analysis.similarPlayersDescAll') }}
      </p>
    </div>

    <!-- Player search -->
    <div class="p-4 border-b border-gray-100 dark:border-gray-800">
      <div class="relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          ref="searchInputRef"
          v-model="searchQuery"
          type="search"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          :placeholder="t('analysis.selectPlayer')"
          class="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500"
          @focus="showDropdown = true"
          @blur="onBlur"
          @input="onInputNative"
          @keyup="onInputNative"
        />

        <!-- Dropdown -->
        <div
          v-if="showDropdown && (searchQuery ? filteredPlayers.length > 0 : expensivePlayers.length > 0)"
          class="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto"
        >
          <div v-if="!searchQuery" class="px-3 py-1.5 text-[10px] font-medium uppercase text-gray-400 bg-gray-50 dark:bg-gray-700/50">
            {{ t('analysis.topExpensive') }}
          </div>
          <button
            v-for="player in (searchQuery ? filteredPlayers : expensivePlayers)"
            :key="player.id"
            class="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700"
            @mousedown.prevent="selectPlayer(player)"
          >
            <span
              class="w-2 h-2 rounded-full"
              :class="POSITION_COLORS[player.position].bg"
            />
            <span class="text-gray-900 dark:text-white flex-1 truncate">{{ player.name }}</span>
            <span class="text-gray-400 text-xs">{{ formatMoney(player.market_value) }}</span>
          </button>
        </div>
      </div>

      <!-- Selected player -->
      <div v-if="selectedPlayer" class="mt-3 flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <img
          :src="selectedPlayer.profile_image"
          :alt="selectedPlayer.name"
          class="w-12 h-12 rounded-full object-cover bg-gray-200 dark:bg-gray-700"
        />
        <div class="flex-1 min-w-0">
          <div class="font-medium text-gray-900 dark:text-white truncate">{{ selectedPlayer.name }}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            {{ selectedPlayer.team_name }} · {{ formatMoney(selectedPlayer.market_value) }}
          </div>
          <div class="text-xs text-gray-400 mt-0.5">
            {{ t('analysis.avgPoints') }}: {{ selectedPlayer.avg_points }} · {{ t('analysis.form') }}: {{ selectedPlayer.form }}
          </div>
        </div>
        <button
          class="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
          @click="selectedPlayer = null"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Similar players results -->
    <div v-if="selectedPlayer">
      <div v-if="similarPlayers.length > 0" class="divide-y divide-gray-100 dark:divide-gray-800">
        <button
          v-for="result in similarPlayers"
          :key="result.player.id"
          class="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
          @click="$emit('playerClick', result.player)"
        >
          <!-- Player image -->
          <div class="relative flex-shrink-0">
            <img
              :src="result.player.profile_image"
              :alt="result.player.name"
              class="w-10 h-10 rounded-full object-cover bg-gray-200 dark:bg-gray-700"
            />
            <span
              class="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
              :class="POSITION_COLORS[result.player.position].bg"
            >
              {{ positionLabel(result.player.position) }}
            </span>
          </div>

          <!-- Player info -->
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium text-gray-900 dark:text-white truncate">
              {{ result.player.name }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              {{ result.player.team_short_name }} · {{ formatMoney(result.player.market_value) }}
            </div>
          </div>

          <!-- Comparison -->
          <div class="text-right flex-shrink-0">
            <div class="text-xs text-gray-500 dark:text-gray-400">
              {{ t('analysis.avgPoints') }}: {{ result.player.avg_points }}
            </div>
            <div
              class="text-xs font-medium"
              :class="result.priceDiff < 0 ? 'text-emerald-500' : 'text-orange-500'"
            >
              {{ result.priceDiff < 0 ? '' : '+' }}{{ formatMoney(result.priceDiff) }}
            </div>
          </div>

          <!-- Similarity badge -->
          <div
            class="flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400"
          >
            {{ result.similarity }}%
          </div>
        </button>
      </div>
      <div v-else class="px-4 py-8 text-center text-sm text-gray-400 dark:text-gray-500">
        {{ t('analysis.noSimilarPlayers') }}
      </div>
    </div>

    <!-- Initial state -->
    <div v-else class="px-4 py-8 text-center text-sm text-gray-400 dark:text-gray-500">
      {{ t('analysis.selectPlayerPrompt') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Search, X } from 'lucide-vue-next'
import type { MarketPlayer } from '@/types/market'
import type { SimilarPlayerResult } from '@/types/analysis'
import { POSITION_COLORS } from '@/types/player'

const props = defineProps<{
  allPlayers: MarketPlayer[]
}>()

defineEmits<{
  playerClick: [player: MarketPlayer]
}>()

const { t } = useI18n()

// ── State ────────────────────────────────────────
const searchQuery = ref('')
const showDropdown = ref(false)
const selectedPlayer = ref<MarketPlayer | null>(null)
const cheaperOnly = ref(true)

// ── Computed ─────────────────────────────────────
const expensivePlayers = computed(() =>
  [...props.allPlayers]
    .sort((a, b) => b.market_value - a.market_value)
    .slice(0, 8)
)

const filteredPlayers = computed(() => {
  if (!searchQuery.value.trim()) return []
  const q = searchQuery.value.toLowerCase()
  return props.allPlayers
    .filter(p => p.name.toLowerCase().includes(q) || p.team_short_name.toLowerCase().includes(q))
    .slice(0, 8)
})

// Watch for mobile keyboard input
watch(searchQuery, (newVal) => {
  if (newVal.trim()) {
    showDropdown.value = true
  }
})

const similarPlayers = computed<SimilarPlayerResult[]>(() => {
  if (!selectedPlayer.value) return []
  return findSimilarPlayers(selectedPlayer.value, props.allPlayers, 5, cheaperOnly.value)
})

// ── Similar player algorithm ─────────────────────
function findSimilarPlayers(
  target: MarketPlayer,
  allPlayers: MarketPlayer[],
  maxResults: number,
  onlyCheaper: boolean
): SimilarPlayerResult[] {
  // Filter to same position, exclude target
  let candidates = allPlayers.filter(p =>
    p.id !== target.id &&
    p.position === target.position
  )

  // If cheaper only, filter to cheaper players
  if (onlyCheaper) {
    candidates = candidates.filter(p => p.market_value < target.market_value)
  }

  // Score each candidate by similarity (weighted factors)
  const scored = candidates.map(player => {
    const pointsDiff = Math.abs(player.avg_points - target.avg_points)
    const formDiff = Math.abs(player.form - target.form)
    const ppmDiff = Math.abs(player.ppm - target.ppm)

    // Normalize and weight (lower is more similar)
    const pointsScore = pointsDiff / (target.avg_points || 1)
    const formScore = formDiff / (target.form || 1)
    const ppmScore = ppmDiff / (target.ppm || 1)

    // Combined similarity (inverted so higher = more similar)
    const rawScore = pointsScore * 0.4 + formScore * 0.3 + ppmScore * 0.3
    const similarity = Math.max(0, Math.round((1 - rawScore) * 100))

    return {
      player,
      similarity,
      priceDiff: player.market_value - target.market_value,
      pointsDiff: player.avg_points - target.avg_points,
    }
  })

  // Sort by similarity (highest first) and return top results
  return scored
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, maxResults)
}

// ── Actions ──────────────────────────────────────
function selectPlayer(player: MarketPlayer) {
  selectedPlayer.value = player
  searchQuery.value = ''
  showDropdown.value = false
}

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

const positionLabel = (pos: number) => {
  const labels: Record<number, string> = { 1: 'G', 2: 'D', 3: 'M', 4: 'F' }
  return labels[pos] || '?'
}

function formatMoney(value: number): string {
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M €`
  if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(0)}K €`
  return `${value} €`
}
</script>
