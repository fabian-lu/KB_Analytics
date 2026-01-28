<template>
  <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
    <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
      {{ t('managers.stats.title') }}
    </h3>

    <div class="flex flex-wrap gap-2">
      <StatBox
        :label="t('managers.stats.avgPerMatchday')"
        :tooltip="t('managers.stats.avgPerMatchdayDesc')"
      >
        {{ stats.avg_points_per_matchday.toFixed(1) }}
      </StatBox>

      <StatBox
        :label="t('managers.stats.bestMatchday')"
        :tooltip="t('managers.stats.bestMatchdayDesc')"
        value-class="text-emerald-600 dark:text-emerald-400"
      >
        {{ stats.best_matchday.points }}
        <span class="text-[10px] text-gray-400 font-normal ml-1">
          ({{ t('managers.matchday') }}{{ stats.best_matchday.matchday }})
        </span>
      </StatBox>

      <StatBox
        :label="t('managers.stats.worstMatchday')"
        :tooltip="t('managers.stats.worstMatchdayDesc')"
        value-class="text-red-600 dark:text-red-400"
      >
        {{ stats.worst_matchday.points }}
        <span class="text-[10px] text-gray-400 font-normal ml-1">
          ({{ t('managers.matchday') }}{{ stats.worst_matchday.matchday }})
        </span>
      </StatBox>

      <StatBox
        :label="t('managers.stats.consistency')"
        :tooltip="t('managers.stats.consistencyDesc')"
      >
        &plusmn; {{ stats.consistency.toFixed(1) }}
      </StatBox>

      <StatBox
        :label="t('managers.stats.matchdayWins')"
        :tooltip="t('managers.stats.matchdayWinsDesc')"
        value-class="text-amber-600 dark:text-amber-400"
      >
        {{ stats.matchday_wins }}
      </StatBox>

      <StatBox
        :label="t('managers.stats.top3Finishes')"
        :tooltip="t('managers.stats.top3FinishesDesc')"
      >
        {{ stats.top3_finishes }}
      </StatBox>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { ManagerStats } from '@/types/league'
import StatBox from '@/components/lineup/StatBox.vue'

defineProps<{
  stats: ManagerStats
}>()

const { t } = useI18n()
</script>
