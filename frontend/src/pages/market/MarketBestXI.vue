<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 space-y-5">

    <!-- Mode toggle + matchday selector -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <!-- Tab toggle -->
      <div class="flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
        <button
          class="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
          :class="mode === 'matchday'
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
          @click="mode = 'matchday'"
        >
          {{ t('bestXI.byMatchday') }}
        </button>
        <button
          class="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
          :class="mode === 'season'
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
          @click="mode = 'season'"
        >
          {{ t('bestXI.seasonDreamTeam') }}
        </button>
      </div>

      <!-- Matchday selector (only in matchday mode) -->
      <div v-if="mode === 'matchday'" class="relative flex items-center">
        <button
          class="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          :disabled="selectedMatchday <= 1"
          @click="selectedMatchday--"
        >
          <ChevronLeft class="w-4 h-4" />
        </button>

        <button
          class="px-3 py-2 text-sm font-medium text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-1"
          @click="showMatchdayDropdown = !showMatchdayDropdown"
        >
          {{ t('bestXI.matchdayNum', { num: selectedMatchday }) }}
          <ChevronDown class="w-3.5 h-3.5 text-gray-400" />
        </button>

        <button
          class="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          :disabled="selectedMatchday >= 18"
          @click="selectedMatchday++"
        >
          <ChevronRight class="w-4 h-4" />
        </button>

        <!-- Matchday dropdown -->
        <div
          v-if="showMatchdayDropdown"
          class="absolute top-full mt-1 right-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto min-w-[160px]"
        >
          <button
            v-for="md in 18"
            :key="md"
            class="w-full text-left px-4 py-2 text-sm transition-colors"
            :class="md === selectedMatchday
              ? 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 font-medium'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'"
            @click="selectedMatchday = md; showMatchdayDropdown = false"
          >
            {{ t('bestXI.matchdayNum', { num: md }) }}
          </button>
        </div>
      </div>
    </div>

    <!-- Description -->
    <p class="text-xs md:text-sm text-gray-500 dark:text-gray-400">
      {{ mode === 'season' ? t('bestXI.seasonBest') : t('bestXI.matchdayBest') }}
    </p>

    <!-- Stats -->
    <LineupStats :players="currentData.players" :formation="currentData.formation" />

    <!-- You have X of these players -->
    <div
      v-if="overlapCount > 0"
      class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 text-sm text-cyan-700 dark:text-cyan-300"
    >
      <Star class="w-4 h-4" />
      {{ t('bestXI.youHave', { count: overlapCount }) }}
    </div>

    <!-- Main content: Pitch + Compare toggle -->
    <div class="flex flex-col lg:flex-row gap-6 lg:justify-center">

      <!-- Best XI Pitch -->
      <div>
        <div class="flex items-center gap-2 mb-3">
          <Trophy class="w-5 h-5 text-amber-500" />
          <h3 class="text-sm md:text-base font-semibold text-gray-900 dark:text-white">
            {{ t('bestXI.bestXI') }}
            <span class="text-gray-400 font-normal">
              &mdash; {{ currentData.totalPoints }} {{ t('bestXI.totalPoints').toLowerCase() }}
            </span>
          </h3>
        </div>
        <div class="lg:h-[calc(100vh-320px)] lg:flex-shrink-0">
          <LineupPitch
            :starting-g-k="bestGK"
            :starting-d-f="bestDF"
            :starting-m-f="bestMF"
            :starting-f-w="bestFW"
            :readonly="true"
            :highlight-player-ids="bestAtPositionIds"
            class="h-full w-auto"
          />
        </div>
      </div>

      <!-- Compare section -->
      <div v-if="showCompare">
        <div class="flex items-center gap-2 mb-3">
          <Users class="w-5 h-5 text-cyan-500" />
          <h3 class="text-sm md:text-base font-semibold text-gray-900 dark:text-white">
            {{ t('bestXI.yourXI') }}
          </h3>
        </div>
        <div class="lg:h-[calc(100vh-320px)] lg:flex-shrink-0">
          <LineupPitch
            :starting-g-k="userGK"
            :starting-d-f="userDF"
            :starting-m-f="userMF"
            :starting-f-w="userFW"
            :readonly="true"
            :highlight-player-ids="overlapIds"
            class="h-full w-auto"
          />
        </div>
      </div>
    </div>

    <!-- Compare toggle button -->
    <button
      class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
      :class="showCompare
        ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800'
        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-cyan-300 dark:hover:border-cyan-700'"
      @click="showCompare = !showCompare"
    >
      <ArrowLeftRight class="w-4 h-4" />
      {{ t('bestXI.compareToYours') }}
    </button>

    <!-- Comparison stats table -->
    <div v-if="showCompare" class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500 dark:text-gray-400 uppercase">
            <th class="px-4 py-3 text-left font-semibold">{{ t('bestXI.difference') }}</th>
            <th class="px-4 py-3 text-center font-semibold">{{ t('bestXI.bestXI') }}</th>
            <th class="px-4 py-3 text-center font-semibold">{{ t('bestXI.yourXI') }}</th>
            <th class="px-4 py-3 text-center font-semibold">+/-</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          <tr v-for="row in comparisonRows" :key="row.label">
            <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{{ row.label }}</td>
            <td class="px-4 py-3 text-sm text-center font-semibold text-gray-900 dark:text-white">{{ row.best }}</td>
            <td class="px-4 py-3 text-sm text-center font-semibold text-gray-900 dark:text-white">{{ row.yours }}</td>
            <td class="px-4 py-3 text-sm text-center font-semibold" :class="row.diffClass">{{ row.diff }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Best at each position breakdown -->
    <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 class="text-sm md:text-base font-semibold text-gray-900 dark:text-white">
          {{ t('bestXI.bestAtPosition') }}
        </h3>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 dark:divide-gray-800">
        <div v-for="pos in positionBreakdown" :key="pos.label" class="p-4 text-center">
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">{{ pos.label }}</p>
          <img :src="pos.player.profile_image" :alt="pos.player.name" class="w-12 h-12 rounded-full mx-auto object-cover bg-gray-200 dark:bg-gray-700 ring-2 ring-amber-400" />
          <p class="text-sm font-semibold text-gray-900 dark:text-white mt-2 truncate">{{ pos.player.name }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">{{ pos.player.team_name }}</p>
          <p class="text-lg font-bold text-amber-500 mt-1">{{ pos.points }}</p>
          <p class="text-[10px] text-gray-400">{{ mode === 'season' ? t('marketPlayers.avg') : '' }} pts</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChevronDown, ChevronLeft, ChevronRight, Trophy, Star, Users, ArrowLeftRight } from 'lucide-vue-next'
import type { PlayerSummary } from '@/types/dashboard'
import { mockBestXIByMatchday, mockSeasonDreamTeam, mockUserLineup } from '@/mocks/marketMock'
import LineupPitch from '@/components/lineup/LineupPitch.vue'
import LineupStats from '@/components/lineup/LineupStats.vue'

const { t } = useI18n()

// ── State ────────────────────────────────────────
const mode = ref<'matchday' | 'season'>('matchday')
const selectedMatchday = ref(18)
const showCompare = ref(false)
const showMatchdayDropdown = ref(false)

// ── Current data ─────────────────────────────────
const currentData = computed(() => {
  if (mode.value === 'season') return mockSeasonDreamTeam
  return mockBestXIByMatchday[selectedMatchday.value - 1] ?? mockBestXIByMatchday[0]
})

// ── Position splits ──────────────────────────────
function splitByPosition(players: PlayerSummary[]) {
  const result: Record<number, PlayerSummary[]> = { 1: [], 2: [], 3: [], 4: [] }
  for (const p of players) {
    result[p.position]?.push(p)
  }
  return result
}

const bestSplit = computed(() => splitByPosition(currentData.value.players))
const bestGK = computed(() => bestSplit.value[1])
const bestDF = computed(() => bestSplit.value[2])
const bestMF = computed(() => bestSplit.value[3])
const bestFW = computed(() => bestSplit.value[4])

const userSplit = computed(() => splitByPosition(mockUserLineup))
const userGK = computed(() => userSplit.value[1])
const userDF = computed(() => userSplit.value[2])
const userMF = computed(() => userSplit.value[3])
const userFW = computed(() => userSplit.value[4])

// ── Best at each position (highlight) ────────────
const bestAtPositionIds = computed(() => {
  const ids: string[] = []
  for (const pos of [1, 2, 3, 4]) {
    const posPlayers = bestSplit.value[pos]
    if (posPlayers.length === 0) continue
    // Find player with highest total_points at this position
    const best = posPlayers.reduce((a, b) => a.total_points > b.total_points ? a : b)
    ids.push(best.id)
  }
  return ids
})

// ── Overlap between best XI and user XI ──────────
const userIds = computed(() => new Set(mockUserLineup.map(p => p.id)))
const overlapIds = computed(() =>
  currentData.value.players
    .filter(p => userIds.value.has(p.id))
    .map(p => p.id)
)
const overlapCount = computed(() => overlapIds.value.length)

// ── Position breakdown ───────────────────────────
const positionBreakdown = computed(() => {
  const labels: Record<number, string> = { 1: 'GK', 2: 'DEF', 3: 'MID', 4: 'FWD' }
  return [1, 2, 3, 4].map(pos => {
    const posPlayers = bestSplit.value[pos]
    const best = posPlayers.reduce((a, b) => a.total_points > b.total_points ? a : b, posPlayers[0])
    return {
      label: labels[pos],
      player: best,
      points: best?.total_points?.toFixed?.(1) ?? '0',
    }
  }).filter(p => p.player)
})

// ── Comparison stats ─────────────────────────────
function sumStat(players: PlayerSummary[], key: keyof PlayerSummary): number {
  return players.reduce((s, p) => s + (Number(p[key]) || 0), 0)
}
function avgStat(players: PlayerSummary[], key: keyof PlayerSummary): number {
  if (players.length === 0) return 0
  return sumStat(players, key) / players.length
}

const comparisonRows = computed(() => {
  const best = currentData.value.players
  const yours = mockUserLineup

  const rows = [
    {
      label: t('lineup.totalPoints'),
      bestVal: sumStat(best, 'total_points'),
      yoursVal: sumStat(yours, 'total_points'),
      format: (v: number) => v.toLocaleString(),
    },
    {
      label: t('lineup.avgPoints'),
      bestVal: avgStat(best, 'avg_points'),
      yoursVal: avgStat(yours, 'avg_points'),
      format: (v: number) => v.toFixed(1),
    },
    {
      label: t('lineup.value'),
      bestVal: sumStat(best, 'market_value'),
      yoursVal: sumStat(yours, 'market_value'),
      format: (v: number) => v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M \u20AC` : `${v.toLocaleString()} \u20AC`,
    },
    {
      label: t('lineup.efficiency'),
      bestVal: sumStat(best, 'market_value') > 0 ? sumStat(best, 'total_points') / (sumStat(best, 'market_value') / 1_000_000) : 0,
      yoursVal: sumStat(yours, 'market_value') > 0 ? sumStat(yours, 'total_points') / (sumStat(yours, 'market_value') / 1_000_000) : 0,
      format: (v: number) => v.toFixed(1),
    },
  ]

  return rows.map(r => {
    const diff = r.bestVal - r.yoursVal
    return {
      label: r.label,
      best: r.format(r.bestVal),
      yours: r.format(r.yoursVal),
      diff: (diff >= 0 ? '+' : '') + r.format(diff),
      diffClass: diff > 0 ? 'text-red-500' : diff < 0 ? 'text-emerald-500' : 'text-gray-400',
    }
  })
})
</script>
