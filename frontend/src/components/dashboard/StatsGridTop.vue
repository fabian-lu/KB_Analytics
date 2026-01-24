<template>
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
    <StatCard
      :label="t('dashboard.leagueRank')"
      :value="`#${stats.rank}`"
      :subtext="`of ${stats.total_managers}`"
      icon="🏆"
      variant="indigo"
      clickable
      @click="activeModal = 'rank'"
    />
    <StatCard
      :label="t('dashboard.squadValue')"
      :value="formatMoney(stats.team_value)"
      icon="💎"
      variant="slate"
      clickable
      @click="activeModal = 'value'"
    />
    <StatCard
      :label="t('dashboard.availableCash')"
      :value="formatMoney(stats.budget)"
      icon="💵"
      variant="cyan"
      clickable
      @click="activeModal = 'cash'"
    />
    <StatCard
      :label="t('dashboard.currentMatchday')"
      :value="stats.current_matchday"
      icon="📅"
      variant="violet"
      clickable
      @click="activeModal = 'matchday'"
    />
  </div>

  <!-- Modals -->
  <RankDetailModal
    :open="activeModal === 'rank'"
    :league-ranking="leagueRanking"
    :current-user-id="currentUserId"
    :current-matchday="stats.current_matchday"
    @close="activeModal = null"
  />
  <SquadValueModal
    :open="activeModal === 'value'"
    :lineup="lineup"
    :budget="stats.budget"
    :value-history="squadValueHistory"
    :league-comparison="leagueValueComparison"
    :current-user-id="currentUserId"
    @close="activeModal = null"
  />
  <CashModal
    :open="activeModal === 'cash'"
    :cash-data="cashData"
    :current-user-id="currentUserId"
    :next-matchday="nextMatchday"
    @close="activeModal = null"
  />
  <MatchdayModal
    :open="activeModal === 'matchday'"
    :matchday-data="matchdayData"
    @close="activeModal = null"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import StatCard from './StatCard.vue'
import RankDetailModal from './modals/RankDetailModal.vue'
import SquadValueModal from './modals/SquadValueModal.vue'
import CashModal from './modals/CashModal.vue'
import MatchdayModal from './modals/MatchdayModal.vue'
import type {
  DashboardStats,
  LeagueRanking,
  DashboardLineup,
  SquadValueSnapshot,
  LeagueValueComparison,
  CashData,
  MatchdayData,
} from '@/types/dashboard'

defineProps<{
  stats: DashboardStats
  leagueRanking: LeagueRanking
  currentUserId: string
  lineup: DashboardLineup
  squadValueHistory: SquadValueSnapshot[]
  leagueValueComparison: LeagueValueComparison
  cashData: CashData
  nextMatchday: number
  matchdayData: MatchdayData
}>()

const { t } = useI18n()

type ModalType = 'rank' | 'value' | 'cash' | 'matchday' | null
const activeModal = ref<ModalType>(null)

function formatMoney(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M €`
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(0)}K €`
  }
  return `${value} €`
}
</script>
