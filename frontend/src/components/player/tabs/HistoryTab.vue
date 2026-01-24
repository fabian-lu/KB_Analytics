<template>
  <div class="space-y-6">
    <!-- Current Owner -->
    <div v-if="player.ownership.owner">
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        {{ t('player.currentOwner') }}
      </h3>
      <div class="rounded-xl p-4 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800">
        <div class="flex items-center gap-3">
          <img
            :src="player.ownership.owner.profile_image"
            :alt="player.ownership.owner.name"
            class="w-12 h-12 rounded-full"
          />
          <div class="flex-1">
            <p class="font-medium text-gray-900 dark:text-white">
              {{ player.ownership.owner.name }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ t('player.ownedSince', { date: formatDate(player.ownership.buy_date!) }) }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ t('player.buyPrice') }}</p>
            <p class="font-bold text-gray-900 dark:text-white">{{ formatMoney(player.ownership.buy_price!) }}</p>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="rounded-xl p-4 bg-gray-50 dark:bg-gray-800/50 text-center">
      <p class="text-gray-500 dark:text-gray-400">{{ t('player.notOwned') }}</p>
    </div>

    <!-- Transfer History -->
    <div>
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        {{ t('player.transferHistory') }}
      </h3>

      <div v-if="player.transfer_history.length > 0" class="relative">
        <!-- Timeline line -->
        <div class="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

        <!-- Transfer events -->
        <div class="space-y-4">
          <div
            v-for="(transfer, index) in player.transfer_history"
            :key="index"
            class="relative flex items-start gap-4 pl-12"
          >
            <!-- Timeline dot -->
            <div
              class="absolute left-3 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900"
              :class="transfer.type === 'bought' ? 'bg-green-500' : 'bg-red-500'"
            />

            <!-- Transfer card -->
            <div class="flex-1 rounded-xl p-3 bg-gray-50 dark:bg-gray-800/50">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <img
                    :src="transfer.manager.profile_image"
                    :alt="transfer.manager.name"
                    class="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ transfer.manager.name }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {{ transfer.type === 'bought' ? t('player.bought') : t('player.sold') }}
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <p
                    class="text-sm font-bold"
                    :class="transfer.type === 'bought' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
                  >
                    {{ formatMoney(transfer.price) }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatDate(transfer.date) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="rounded-xl p-4 bg-gray-50 dark:bg-gray-800/50 text-center">
        <p class="text-gray-500 dark:text-gray-400">{{ t('player.noTransfers') }}</p>
      </div>
    </div>

    <!-- Transfer Stats -->
    <div v-if="player.transfer_history.length > 0">
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        {{ t('player.transferStats') }}
      </h3>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatBox :label="t('player.totalTransfers')" :value="player.transfer_history.length" />
        <StatBox
          :label="t('player.timesBought')"
          :value="buyCount"
          variant="success"
        />
        <StatBox
          :label="t('player.timesSold')"
          :value="sellCount"
          variant="danger"
        />
        <StatBox
          :label="t('player.avgPrice')"
          :value="avgPrice"
          format="money"
        />
      </div>
    </div>

    <!-- Season Comparison (if multiple seasons) -->
    <div v-if="player.performance_history.length > 1">
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        {{ t('player.seasonComparison') }}
      </h3>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="text-left py-2 pr-4 text-gray-500 dark:text-gray-400 font-medium">{{ t('player.season') }}</th>
              <th class="text-right py-2 px-2 text-gray-500 dark:text-gray-400 font-medium">{{ t('player.games') }}</th>
              <th class="text-right py-2 px-2 text-gray-500 dark:text-gray-400 font-medium">{{ t('player.totalPoints') }}</th>
              <th class="text-right py-2 px-2 text-gray-500 dark:text-gray-400 font-medium">{{ t('player.avgPoints') }}</th>
              <th class="text-right py-2 px-2 text-gray-500 dark:text-gray-400 font-medium">{{ t('player.goals') }}</th>
              <th class="text-right py-2 pl-2 text-gray-500 dark:text-gray-400 font-medium">{{ t('player.assists') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="season in seasonStats"
              :key="season.season"
              class="border-b border-gray-100 dark:border-gray-800"
            >
              <td class="py-2 pr-4 font-medium text-gray-900 dark:text-white">{{ season.season }}</td>
              <td class="py-2 px-2 text-right text-gray-600 dark:text-gray-400">{{ season.gamesPlayed }}</td>
              <td class="py-2 px-2 text-right text-gray-900 dark:text-white font-medium">{{ season.totalPoints }}</td>
              <td class="py-2 px-2 text-right text-gray-600 dark:text-gray-400">{{ season.avgPoints.toFixed(1) }}</td>
              <td class="py-2 px-2 text-right text-gray-600 dark:text-gray-400">{{ season.goals }}</td>
              <td class="py-2 pl-2 text-right text-gray-600 dark:text-gray-400">{{ season.assists }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import StatBox from '../shared/StatBox.vue'
import type { PlayerDetail } from '@/types/player'

const props = defineProps<{
  player: PlayerDetail
}>()

const { t } = useI18n()

const buyCount = computed(() =>
  props.player.transfer_history.filter(t => t.type === 'bought').length
)

const sellCount = computed(() =>
  props.player.transfer_history.filter(t => t.type === 'sold').length
)

const avgPrice = computed(() => {
  if (props.player.transfer_history.length === 0) return 0
  const total = props.player.transfer_history.reduce((sum, t) => sum + t.price, 0)
  return Math.round(total / props.player.transfer_history.length)
})

const seasonStats = computed(() => {
  return props.player.performance_history.map(s => {
    const matchdays = s.matchdays
    const gamesPlayed = matchdays.filter(m => m.minutes_played > 0).length
    const totalPoints = matchdays.reduce((sum, m) => sum + m.points, 0)

    return {
      season: s.season,
      gamesPlayed,
      totalPoints,
      avgPoints: gamesPlayed > 0 ? totalPoints / gamesPlayed : 0,
      goals: matchdays.reduce((sum, m) => sum + m.goals, 0),
      assists: matchdays.reduce((sum, m) => sum + m.assists, 0),
    }
  })
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

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
</script>
