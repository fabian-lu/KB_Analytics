<template>
  <div class="space-y-6">
    <!-- Bundesliga Ranking -->
    <div>
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        {{ t('player.bundesligaRanking') }}
      </h3>
      <div class="grid grid-cols-3 gap-2">
        <div class="rounded-xl p-4 bg-gray-50 dark:bg-gray-800/50 text-center">
          <p class="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">{{ t('player.byTotalPoints') }}</p>
          <RankBadge :rank="player.bundesliga_rank.by_total_points" :total="player.bundesliga_rank.total_players" />
        </div>
        <div class="rounded-xl p-4 bg-gray-50 dark:bg-gray-800/50 text-center">
          <p class="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">{{ t('player.byAvgPoints') }}</p>
          <RankBadge :rank="player.bundesliga_rank.by_avg_points" :total="player.bundesliga_rank.total_players" />
        </div>
        <div class="rounded-xl p-4 bg-gray-50 dark:bg-gray-800/50 text-center">
          <p class="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">{{ t('player.byValue') }}</p>
          <RankBadge :rank="player.bundesliga_rank.by_market_value" :total="player.bundesliga_rank.total_players" />
        </div>
      </div>
    </div>

    <!-- Position Ranking -->
    <div>
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        {{ t('player.positionRanking', { position: positionLabel }) }}
      </h3>
      <div class="grid grid-cols-3 gap-2">
        <div class="rounded-xl p-4 text-center" :class="positionBgClass">
          <p class="text-xs uppercase mb-1" :class="positionLabelClass">{{ t('player.byTotalPoints') }}</p>
          <RankBadge :rank="player.position_rank.by_total_points" :total="player.position_rank.total_players" />
        </div>
        <div class="rounded-xl p-4 text-center" :class="positionBgClass">
          <p class="text-xs uppercase mb-1" :class="positionLabelClass">{{ t('player.byAvgPoints') }}</p>
          <RankBadge :rank="player.position_rank.by_avg_points" :total="player.position_rank.total_players" />
        </div>
        <div class="rounded-xl p-4 text-center" :class="positionBgClass">
          <p class="text-xs uppercase mb-1" :class="positionLabelClass">{{ t('player.byValue') }}</p>
          <RankBadge :rank="player.position_rank.by_market_value" :total="player.position_rank.total_players" />
        </div>
      </div>
    </div>

    <!-- Comparison to Position Average -->
    <div>
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        {{ t('player.vsPositionAvg', { position: positionLabel }) }}
      </h3>
      <div class="space-y-4">
        <!-- Total Points -->
        <div class="rounded-xl p-4 bg-gray-50 dark:bg-gray-800/50">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('player.totalPoints') }}</span>
            <div class="flex items-center gap-2">
              <span class="text-sm font-bold text-gray-900 dark:text-white">
                {{ player.current_season.total_points }}
              </span>
              <span class="text-xs text-gray-500 dark:text-gray-400">vs</span>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ player.position_average.total_points }}
              </span>
            </div>
          </div>
          <ComparisonBar
            :value="player.current_season.total_points"
            :average="player.position_average.total_points"
          />
        </div>

        <!-- Avg Points -->
        <div class="rounded-xl p-4 bg-gray-50 dark:bg-gray-800/50">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('player.avgPoints') }}</span>
            <div class="flex items-center gap-2">
              <span class="text-sm font-bold text-gray-900 dark:text-white">
                {{ player.current_season.avg_points.toFixed(1) }}
              </span>
              <span class="text-xs text-gray-500 dark:text-gray-400">vs</span>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ player.position_average.avg_points.toFixed(1) }}
              </span>
            </div>
          </div>
          <ComparisonBar
            :value="player.current_season.avg_points"
            :average="player.position_average.avg_points"
          />
        </div>

        <!-- Market Value -->
        <div class="rounded-xl p-4 bg-gray-50 dark:bg-gray-800/50">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('player.marketValue') }}</span>
            <div class="flex items-center gap-2">
              <span class="text-sm font-bold text-gray-900 dark:text-white">
                {{ formatMoney(player.value.current) }}
              </span>
              <span class="text-xs text-gray-500 dark:text-gray-400">vs</span>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ formatMoney(player.position_average.market_value) }}
              </span>
            </div>
          </div>
          <ComparisonBar
            :value="player.value.current"
            :average="player.position_average.market_value"
          />
        </div>

        <!-- Efficiency -->
        <div class="rounded-xl p-4 bg-gray-50 dark:bg-gray-800/50">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ t('player.eurosPerPoint') }}</span>
            <div class="flex items-center gap-2">
              <span class="text-sm font-bold text-gray-900 dark:text-white">
                {{ formatMoney(player.efficiency.euros_per_point) }}
              </span>
              <span class="text-xs text-gray-500 dark:text-gray-400">vs</span>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ formatMoney(player.position_average.euros_per_point) }}
              </span>
            </div>
          </div>
          <!-- For efficiency, lower is better -->
          <ComparisonBar
            :value="player.efficiency.euros_per_point"
            :average="player.position_average.euros_per_point"
            :lower-is-better="true"
          />
        </div>
      </div>
    </div>

    <!-- Efficiency Rank -->
    <div>
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        {{ t('player.efficiencyRanking') }}
      </h3>
      <div class="rounded-xl p-4 bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-cyan-600 dark:text-cyan-400 uppercase">{{ t('player.eurosPerPoint') }}</p>
            <p class="text-2xl font-bold text-cyan-700 dark:text-cyan-300">
              {{ formatMoney(player.efficiency.euros_per_point) }}
            </p>
          </div>
          <div class="text-right">
            <RankBadge
              :rank="player.efficiency.bundesliga_rank"
              :total="player.efficiency.total_bundesliga"
              :label="t('player.bundesliga')"
            />
            <div class="mt-2">
              <RankBadge
                :rank="player.efficiency.position_rank"
                :total="player.efficiency.total_position"
                :label="positionLabel"
              />
            </div>
          </div>
        </div>
        <p class="text-sm text-cyan-600 dark:text-cyan-400 mt-3">
          {{ t('player.betterThan', { percent: player.efficiency.better_than_pct.toFixed(0) }) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { useI18n } from 'vue-i18n'
import RankBadge from '../shared/RankBadge.vue'
import { POSITION_LABELS, POSITION_COLORS } from '@/types/player'
import type { PlayerDetail } from '@/types/player'

const props = defineProps<{
  player: PlayerDetail
}>()

const { t } = useI18n()

const positionLabel = computed(() => POSITION_LABELS[props.player.position] || '?')
const positionColors = computed(() => POSITION_COLORS[props.player.position])

const positionBgClass = computed(() => {
  switch (props.player.position) {
    case 1: return 'bg-amber-50 dark:bg-amber-900/20'
    case 2: return 'bg-blue-50 dark:bg-blue-900/20'
    case 3: return 'bg-emerald-50 dark:bg-emerald-900/20'
    case 4: return 'bg-rose-50 dark:bg-rose-900/20'
    default: return 'bg-gray-50 dark:bg-gray-800/50'
  }
})

const positionLabelClass = computed(() => {
  switch (props.player.position) {
    case 1: return 'text-amber-600 dark:text-amber-400'
    case 2: return 'text-blue-600 dark:text-blue-400'
    case 3: return 'text-emerald-600 dark:text-emerald-400'
    case 4: return 'text-rose-600 dark:text-rose-400'
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

// Inline comparison bar component
const ComparisonBar = (props: { value: number; average: number; lowerIsBetter?: boolean }) => {
  const ratio = props.value / props.average
  const isGood = props.lowerIsBetter ? ratio < 1 : ratio > 1
  const percentage = Math.min(100, (props.value / (Math.max(props.value, props.average) * 1.2)) * 100)
  const avgPercentage = Math.min(100, (props.average / (Math.max(props.value, props.average) * 1.2)) * 100)

  return h('div', { class: 'relative h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden' }, [
    // Player value bar
    h('div', {
      class: `absolute h-full rounded-full transition-all ${isGood ? 'bg-green-500' : 'bg-red-500'}`,
      style: { width: `${percentage}%` },
    }),
    // Average marker
    h('div', {
      class: 'absolute top-0 h-full w-0.5 bg-gray-600 dark:bg-gray-300',
      style: { left: `${avgPercentage}%` },
    }),
  ])
}
</script>
