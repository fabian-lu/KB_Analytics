<template>
  <div class="space-y-6">
    <!-- Status & Next Match -->
    <div class="rounded-xl p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center"
            :class="statusBgClass"
          >
            <component :is="statusIcon" class="w-5 h-5" :class="statusIconClass" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {{ t(`player.status.${player.status}`) }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ player.play_likelihood }}% {{ t('player.likelyToPlay') }}
            </p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-sm text-gray-900 dark:text-white">
            {{ t('player.nextMatch') }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ nextMatchText }}
          </p>
        </div>
      </div>
    </div>

    <!-- Recent Form -->
    <div>
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
          {{ t('player.recentForm') }}
        </h3>
        <FormIndicator :trend="player.form_trend" />
      </div>
      <MiniBarChart :points="player.last_5_points" :start-matchday="currentMatchday - 4" />
      <div class="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
        <span>{{ t('player.avgLast5') }}: <span class="font-medium text-gray-900 dark:text-white">{{ player.avg_points_last_5.toFixed(1) }}</span></span>
        <span>{{ t('player.avgLast3') }}: <span class="font-medium text-gray-900 dark:text-white">{{ player.avg_points_last_3.toFixed(1) }}</span></span>
      </div>
    </div>

    <!-- Upcoming Fixtures -->
    <div>
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        {{ t('player.upcomingFixtures') }}
      </h3>
      <div class="rounded-xl bg-gray-50 dark:bg-gray-800/50 divide-y divide-gray-200 dark:divide-gray-700">
        <FixtureRow
          v-for="fixture in player.next_fixtures.slice(0, 5)"
          :key="fixture.matchday"
          :fixture="fixture"
          class="px-3"
        />
      </div>
    </div>

    <!-- Quick Stats -->
    <div>
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        {{ t('player.quickStats') }}
      </h3>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatBox
          :label="t('player.gamesPlayed')"
          :value="`${player.current_season.games_played}/${player.current_season.games_total}`"
        />
        <StatBox
          :label="t('player.starts')"
          :value="player.current_season.starting_appearances"
        />
        <StatBox
          :label="t('player.avgMinutes')"
          :value="`${player.current_season.avg_minutes}'`"
        />
        <StatBox
          :label="t('player.goals')"
          :value="player.current_season.goals"
          :variant="player.current_season.goals > 5 ? 'success' : 'default'"
        />
      </div>
    </div>

    <!-- Efficiency -->
    <div>
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        {{ t('player.efficiency') }}
      </h3>
      <div class="grid grid-cols-2 gap-3">
        <div class="rounded-xl p-4 bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800">
          <p class="text-xs text-cyan-600 dark:text-cyan-400 uppercase mb-1">{{ t('player.eurosPerPoint') }}</p>
          <p class="text-xl font-bold text-cyan-700 dark:text-cyan-300">
            {{ formatMoney(player.efficiency.euros_per_point) }}
          </p>
          <p class="text-xs text-cyan-600 dark:text-cyan-400 mt-1">
            {{ t('player.betterThan', { percent: player.efficiency.better_than_pct.toFixed(0) }) }}
          </p>
        </div>
        <div class="rounded-xl p-4 bg-gray-50 dark:bg-gray-800/50">
          <p class="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">{{ t('player.ranking') }}</p>
          <div class="flex items-center gap-2">
            <RankBadge :rank="player.efficiency.bundesliga_rank" :total="player.efficiency.total_bundesliga" />
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
            <RankBadge :rank="player.efficiency.position_rank" :total="player.efficiency.total_position" :label="positionLabel" />
          </p>
        </div>
      </div>
    </div>

    <!-- Ownership -->
    <div v-if="player.ownership.owner">
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        {{ t('player.ownership') }}
      </h3>
      <div class="rounded-xl p-4 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800">
        <div class="flex items-center gap-3">
          <img
            :src="player.ownership.owner.profile_image"
            :alt="player.ownership.owner.name"
            class="w-10 h-10 rounded-full"
          />
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {{ player.ownership.owner.name }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ t('player.boughtFor', { price: formatMoney(player.ownership.buy_price!) }) }}
            </p>
          </div>
          <div class="text-right">
            <p
              class="text-sm font-bold"
              :class="player.ownership.profit! >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
            >
              {{ player.ownership.profit! >= 0 ? '+' : '' }}{{ formatMoney(player.ownership.profit!) }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ player.ownership.profit_pct! >= 0 ? '+' : '' }}{{ player.ownership.profit_pct!.toFixed(1) }}%
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { CheckCircle, AlertTriangle, XCircle, HelpCircle } from 'lucide-vue-next'
import StatBox from '../shared/StatBox.vue'
import MiniBarChart from '../shared/MiniBarChart.vue'
import FixtureRow from '../shared/FixtureRow.vue'
import RankBadge from '../shared/RankBadge.vue'
import FormIndicator from '../shared/FormIndicator.vue'
import { POSITION_LABELS } from '@/types/player'
import type { PlayerDetail } from '@/types/player'

const props = defineProps<{
  player: PlayerDetail
}>()

const { t } = useI18n()

const positionLabel = computed(() => POSITION_LABELS[props.player.position] || '?')

const currentMatchday = computed(() => {
  return props.player.current_season.games_total
})

const nextFixture = computed(() => props.player.next_fixtures[0])

const nextMatchText = computed(() => {
  if (!nextFixture.value) return '-'
  const location = nextFixture.value.is_home ? 'H' : 'A'
  return `${nextFixture.value.opponent.short_name} (${location})`
})

const statusIcon = computed(() => {
  switch (props.player.status) {
    case 'fit': return CheckCircle
    case 'injured': return XCircle
    case 'suspended': return AlertTriangle
    case 'doubt': return AlertTriangle
    default: return HelpCircle
  }
})

const statusBgClass = computed(() => {
  switch (props.player.status) {
    case 'fit': return 'bg-green-100 dark:bg-green-900/30'
    case 'injured': return 'bg-red-100 dark:bg-red-900/30'
    case 'suspended': return 'bg-orange-100 dark:bg-orange-900/30'
    case 'doubt': return 'bg-yellow-100 dark:bg-yellow-900/30'
    default: return 'bg-gray-100 dark:bg-gray-800'
  }
})

const statusIconClass = computed(() => {
  switch (props.player.status) {
    case 'fit': return 'text-green-600 dark:text-green-400'
    case 'injured': return 'text-red-600 dark:text-red-400'
    case 'suspended': return 'text-orange-600 dark:text-orange-400'
    case 'doubt': return 'text-yellow-600 dark:text-yellow-400'
    default: return 'text-gray-500 dark:text-gray-400'
  }
})

function formatMoney(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M €`
  }
  if (Math.abs(value) >= 1_000) {
    return `${(value / 1_000).toFixed(0)}K €`
  }
  return `${value} €`
}
</script>
