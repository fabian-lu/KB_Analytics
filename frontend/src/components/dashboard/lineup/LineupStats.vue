<template>
  <div class="flex flex-wrap gap-2 justify-center">
    <StatBox :label="t('lineup.formation')" :tooltip="t('lineup.formationDesc')">
      {{ formation || '—' }}
    </StatBox>

    <StatBox :label="t('lineup.totalPoints')" :tooltip="t('lineup.totalPointsDesc')">
      {{ totalPoints.toLocaleString() }}
    </StatBox>

    <StatBox :label="t('lineup.avgPoints')" :tooltip="t('lineup.avgPointsDesc')">
      {{ avgPoints.toFixed(1) }}
    </StatBox>

    <StatBox :label="t('lineup.value')" :tooltip="t('lineup.valueDesc')">
      {{ formatMoney(totalValue) }}
    </StatBox>

    <StatBox :label="t('lineup.efficiency')" :tooltip="t('lineup.efficiencyDesc')">
      {{ efficiency.toFixed(1) }}
    </StatBox>

    <StatBox :label="t('lineup.consistency')" :tooltip="t('lineup.consistencyDesc')">
      ± {{ stdDeviation.toFixed(1) }}
    </StatBox>

    <StatBox :label="t('lineup.recentForm')" :tooltip="t('lineup.recentFormDesc')" :value-class="formColor">
      {{ avgLast3.toFixed(1) }}
    </StatBox>

    <StatBox :label="t('lineup.teams')" :tooltip="t('lineup.teamsDesc')">
      {{ teamCount }}
    </StatBox>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import StatBox from './StatBox.vue'
import type { PlayerSummary } from '@/types/dashboard'

const props = defineProps<{
  players: PlayerSummary[]
  formation: string
}>()

const { t } = useI18n()

// Total points
const totalPoints = computed(() => {
  return props.players.reduce((sum, p) => sum + p.total_points, 0)
})

// Average points per player
const avgPoints = computed(() => {
  if (props.players.length === 0) return 0
  return totalPoints.value / props.players.length
})

// Total market value
const totalValue = computed(() => {
  return props.players.reduce((sum, p) => sum + p.market_value, 0)
})

// Points per €M (efficiency)
const efficiency = computed(() => {
  if (totalValue.value === 0) return 0
  return totalPoints.value / (totalValue.value / 1_000_000)
})

// Combined standard deviation (sqrt of sum of variances)
const stdDeviation = computed(() => {
  const sumVariances = props.players.reduce((sum, p) => {
    const std = p.std_points ?? 0
    return sum + std * std
  }, 0)
  return Math.sqrt(sumVariances)
})

// Average of recent form (last 3 matchdays)
const avgLast3 = computed(() => {
  const playersWithForm = props.players.filter(p => p.avg_last_3 != null)
  if (playersWithForm.length === 0) return 0
  const sum = playersWithForm.reduce((s, p) => s + (p.avg_last_3 ?? 0), 0)
  return sum / playersWithForm.length
})

// Color for recent form (green if above avg, red if below)
const formColor = computed(() => {
  if (avgLast3.value >= avgPoints.value) {
    return 'text-green-600 dark:text-green-400'
  }
  return 'text-red-600 dark:text-red-400'
})

// Number of unique teams
const teamCount = computed(() => {
  const teams = new Set(props.players.map(p => p.team_id))
  return teams.size
})

function formatMoney(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M €`
  }
  return `${value.toLocaleString()} €`
}
</script>
