<template>
  <div class="grid gap-6 lg:grid-cols-2">
    <!-- Best Value -->
    <div class="p-4 rounded-xl bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-800">
      <h3 class="text-sm font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide mb-3">
        {{ t('dashboard.bestValue') }}
      </h3>
      <div class="space-y-2">
        <PlayerValueCard
          v-for="player in bestPlayers"
          :key="player.id"
          :player="player"
          type="best"
        />
      </div>
    </div>

    <!-- Worst Value -->
    <div class="p-4 rounded-xl bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-800">
      <h3 class="text-sm font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide mb-3">
        {{ t('dashboard.worstValue') }}
      </h3>
      <div class="space-y-2">
        <PlayerValueCard
          v-for="player in worstPlayers"
          :key="player.id"
          :player="player"
          type="worst"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import PlayerValueCard from './PlayerValueCard.vue'
import type { PlayerSummary } from '@/types/dashboard'

defineProps<{
  bestPlayers: PlayerSummary[]
  worstPlayers: PlayerSummary[]
}>()

const { t } = useI18n()
</script>
