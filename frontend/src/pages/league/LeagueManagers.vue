<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 space-y-5">
    <!-- Manager Selector Bar -->
    <ManagerSelector
      :managers="managers"
      :selected-id="selectedId"
      @select="selectedId = $event"
    />

    <!-- Loading state -->
    <div v-if="!selectedProfile" class="text-center py-12">
      <p class="text-gray-500 dark:text-gray-400">{{ t('managers.selectManager') }}</p>
    </div>

    <!-- Main content when manager is selected -->
    <template v-else>
      <!-- Profile Header with Transfer Profit -->
      <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 md:p-6">
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <!-- Large Avatar -->
          <div class="relative flex-shrink-0">
            <img
              :src="selectedProfile.manager.profile_image"
              :alt="selectedProfile.manager.name"
              class="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover ring-4 ring-cyan-100 dark:ring-cyan-900"
            />
            <div
              class="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg"
              :class="rankBadgeClass"
            >
              {{ selectedProfile.rank }}
            </div>
          </div>

          <!-- Name and rank text -->
          <div class="text-center sm:text-left flex-1">
            <h2 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              {{ selectedProfile.manager.name }}
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {{ t('managers.rankNum', { num: selectedProfile.rank }) }}
            </p>
          </div>
        </div>

        <!-- Stats row -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-gray-100 dark:border-gray-800">
          <div class="text-center">
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('managers.teamValue') }}</p>
            <p class="text-lg md:text-xl font-bold text-gray-900 dark:text-white mt-0.5">
              {{ formatMoney(selectedProfile.team_value) }}
            </p>
          </div>
          <div class="text-center">
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('managers.budget') }}</p>
            <p class="text-lg md:text-xl font-bold text-gray-900 dark:text-white mt-0.5">
              {{ formatMoney(selectedProfile.budget) }}
            </p>
          </div>
          <div class="text-center">
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('managers.totalPoints') }}</p>
            <p class="text-lg md:text-xl font-bold text-cyan-600 dark:text-cyan-400 mt-0.5">
              {{ selectedProfile.total_points.toLocaleString() }}
            </p>
          </div>
          <div class="text-center">
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ t('managers.transferProfit') }}</p>
            <p
              class="text-lg md:text-xl font-bold mt-0.5"
              :class="selectedProfile.transfer_profit >= 0
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-red-600 dark:text-red-400'"
            >
              {{ formatProfit(selectedProfile.transfer_profit) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Two-column layout -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <!-- LEFT COLUMN: Squad -->
        <div class="space-y-5">
          <!-- Squad section title -->
          <div class="flex items-center gap-2">
            <Users class="w-5 h-5 text-cyan-500" />
            <h3 class="text-sm md:text-base font-semibold text-gray-900 dark:text-white">
              {{ t('managers.squad') }}
            </h3>
          </div>

          <!-- Lineup Pitch - bigger on desktop, centered -->
          <div class="lg:h-[600px] xl:h-[680px] 2xl:h-[750px] flex justify-center">
            <LineupPitch
              :starting-g-k="startingGK"
              :starting-d-f="startingDF"
              :starting-m-f="startingMF"
              :starting-f-w="startingFW"
              :readonly="true"
              class="h-full w-auto max-w-full"
              @player-click="openPlayerModal"
            />
          </div>

          <!-- Lineup Stats - centered -->
          <div class="flex justify-center">
            <LineupStats
              :players="selectedProfile.lineup.starting"
              :formation="selectedProfile.lineup.formation"
              class="w-full max-w-2xl"
            />
          </div>

          <!-- Bench Section -->
          <div v-if="selectedProfile.lineup.bench.length > 0" class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Armchair class="w-4 h-4 text-gray-400" />
              {{ t('managers.bench') }} ({{ selectedProfile.lineup.bench.length }})
            </h4>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="player in selectedProfile.lineup.bench"
                :key="player.id"
                class="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                @click="openPlayerModal(player)"
              >
                <img
                  :src="player.profile_image"
                  :alt="player.name"
                  class="w-7 h-7 rounded-full object-cover"
                />
                <div class="min-w-0 text-left">
                  <p class="text-xs font-medium text-gray-900 dark:text-white truncate max-w-[100px]">
                    {{ player.name }}
                  </p>
                  <p class="text-[10px] text-gray-500 dark:text-gray-400">
                    {{ player.total_points }} {{ t('managers.points') }}
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: Stats & Details -->
        <div class="space-y-5">
          <!-- Stats Grid -->
          <ManagerStatsGrid :stats="selectedProfile.stats" />

          <!-- Points per Matchday Chart -->
          <ManagerPointsChart :history="selectedProfile.matchday_history" />

          <!-- Investment Capacity -->
          <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              {{ t('managers.investment.title') }}
            </h3>
            <div class="grid grid-cols-2 gap-3">
              <div class="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p class="text-sm font-bold text-gray-900 dark:text-white">
                  {{ formatMoney(selectedProfile.investment.budget) }}
                </p>
                <p class="text-[10px] text-gray-500 dark:text-gray-400">
                  {{ t('managers.investment.availableBudget') }}
                </p>
              </div>
              <div class="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p class="text-sm font-bold text-gray-900 dark:text-white">
                  {{ formatMoney(selectedProfile.investment.sellable_value) }}
                </p>
                <p class="text-[10px] text-gray-500 dark:text-gray-400">
                  {{ t('managers.investment.sellableValue') }}
                </p>
              </div>
              <div class="text-center p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                <p class="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {{ formatMoney(selectedProfile.investment.total_spending_power) }}
                </p>
                <p class="text-[10px] text-gray-500 dark:text-gray-400">
                  {{ t('managers.investment.totalSpendingPower') }}
                </p>
              </div>
              <div class="text-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p class="text-sm font-bold text-gray-900 dark:text-white">
                  {{ formatMoney(selectedProfile.investment.max_single_buy) }}
                </p>
                <p class="text-[10px] text-gray-500 dark:text-gray-400">
                  {{ t('managers.investment.maxSingleBuy') }}
                </p>
              </div>
            </div>
          </div>

          <!-- Activity Badge -->
          <ManagerActivityBadge :activity="selectedProfile.activity" />

          <!-- Squad Stats -->
          <ManagerSquadStats
            :starting="selectedProfile.lineup.starting"
            :bench="selectedProfile.lineup.bench"
          />
        </div>
      </div>

      <!-- Value Changes Table (full width) -->
      <ManagerValueChanges :changes="selectedProfile.value_changes" />

      <!-- Two-column: Achievements + Bench Comparison -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <!-- Achievements -->
        <ManagerAchievements :achievements="selectedProfile.achievements" />

        <!-- Bench Strength Comparison -->
        <ManagerBenchComparison
          :all-profiles="managers"
          :selected-id="selectedId!"
        />
      </div>
    </template>

    <!-- Player Modal -->
    <PlayerModal
      :open="playerModalOpen"
      :player-id="selectedPlayerId"
      @close="playerModalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Users, Armchair } from 'lucide-vue-next'
import type { PlayerSummary } from '@/types/dashboard'
import type { ManagerProfile } from '@/types/league'
import { mockManagerProfiles } from '@/mocks/leagueMock'

// Components
import ManagerSelector from '@/components/league/ManagerSelector.vue'
import ManagerStatsGrid from '@/components/league/ManagerStatsGrid.vue'
import ManagerValueChanges from '@/components/league/ManagerValueChanges.vue'
import ManagerAchievements from '@/components/league/ManagerAchievements.vue'
import ManagerBenchComparison from '@/components/league/ManagerBenchComparison.vue'
import ManagerActivityBadge from '@/components/league/ManagerActivityBadge.vue'
import ManagerPointsChart from '@/components/league/ManagerPointsChart.vue'
import ManagerSquadStats from '@/components/league/ManagerSquadStats.vue'
import LineupPitch from '@/components/lineup/LineupPitch.vue'
import LineupStats from '@/components/lineup/LineupStats.vue'
import PlayerModal from '@/components/player/PlayerModal.vue'

const { t } = useI18n()

// ── Player Modal ────────────────────────────────
const playerModalOpen = ref(false)
const selectedPlayerId = ref<string | null>(null)

function openPlayerModal(player: PlayerSummary) {
  selectedPlayerId.value = player.id
  playerModalOpen.value = true
}

// ── Data ────────────────────────────────────────
const managers = ref<ManagerProfile[]>(mockManagerProfiles)
const selectedId = ref<string | null>(null)

// ── Selected profile ────────────────────────────
const selectedProfile = computed<ManagerProfile | null>(() => {
  if (!selectedId.value) return null
  return managers.value.find(m => m.manager.id === selectedId.value) ?? null
})

// ── Rank badge class ────────────────────────────
const rankBadgeClass = computed(() => {
  if (!selectedProfile.value) return ''
  const rank = selectedProfile.value.rank
  if (rank === 1) return 'bg-amber-400 text-amber-900'
  if (rank === 2) return 'bg-gray-300 text-gray-700'
  if (rank === 3) return 'bg-orange-400 text-orange-900'
  return 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
})

// ── Position splits for LineupPitch ─────────────
function splitByPosition(players: PlayerSummary[]): Record<number, PlayerSummary[]> {
  const result: Record<number, PlayerSummary[]> = { 1: [], 2: [], 3: [], 4: [] }
  for (const p of players) {
    result[p.position]?.push(p)
  }
  return result
}

const positionSplit = computed(() => {
  if (!selectedProfile.value) return { 1: [], 2: [], 3: [], 4: [] }
  return splitByPosition(selectedProfile.value.lineup.starting)
})

const startingGK = computed(() => positionSplit.value[1])
const startingDF = computed(() => positionSplit.value[2])
const startingMF = computed(() => positionSplit.value[3])
const startingFW = computed(() => positionSplit.value[4])

// ── Helpers ─────────────────────────────────────
function formatMoney(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`
  }
  return `${(value / 1000).toFixed(0)}K`
}

function formatProfit(value: number): string {
  const sign = value >= 0 ? '+' : ''
  if (Math.abs(value) >= 1_000_000) {
    return `${sign}${(value / 1_000_000).toFixed(1)}M`
  }
  return `${sign}${(value / 1000).toFixed(0)}K`
}

// ── Auto-select first manager on load ───────────
onMounted(() => {
  if (managers.value.length > 0) {
    selectedId.value = managers.value[0].manager.id
  }
})
</script>
