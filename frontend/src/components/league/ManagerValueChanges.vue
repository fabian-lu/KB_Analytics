<template>
  <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div class="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
        {{ t('managers.valueChanges.title') }}
      </h3>

      <!-- Sort selector -->
      <select
        v-model="sortKey"
        class="text-xs bg-gray-100 dark:bg-gray-800 border-0 rounded-lg px-2 py-1 text-gray-600 dark:text-gray-300 cursor-pointer"
      >
        <option value="1d">{{ t('managers.valueChanges.change1d') }}</option>
        <option value="7d">{{ t('managers.valueChanges.change7d') }}</option>
        <option value="30d">{{ t('managers.valueChanges.change30d') }}</option>
      </select>
    </div>

    <div v-if="sortedChanges.length === 0" class="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
      {{ t('managers.valueChanges.noChanges') }}
    </div>

    <div v-else class="max-h-80 overflow-y-auto">
      <table class="w-full">
        <thead class="sticky top-0 bg-gray-50 dark:bg-gray-800/80 backdrop-blur">
          <tr class="text-[10px] uppercase text-gray-500 dark:text-gray-400">
            <th class="px-4 py-2 text-left font-semibold">{{ t('managers.valueChanges.player') }}</th>
            <th class="px-4 py-2 text-right font-semibold">{{ t('managers.valueChanges.change1d') }}</th>
            <th class="px-4 py-2 text-right font-semibold">{{ t('managers.valueChanges.change7d') }}</th>
            <th class="px-4 py-2 text-right font-semibold hidden sm:table-cell">{{ t('managers.valueChanges.change30d') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          <tr
            v-for="change in sortedChanges"
            :key="change.player.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <td class="px-4 py-2.5">
              <div class="flex items-center gap-2">
                <img
                  :src="change.player.profile_image"
                  :alt="change.player.name"
                  class="w-7 h-7 rounded-full object-cover"
                />
                <div class="min-w-0">
                  <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {{ change.player.name }}
                  </p>
                  <p class="text-[10px] text-gray-500 dark:text-gray-400">
                    {{ formatMoney(change.player.market_value) }}
                  </p>
                </div>
              </div>
            </td>
            <td class="px-4 py-2.5 text-right">
              <span :class="changeClass(change.change_1d)" class="text-sm font-medium">
                {{ formatChange(change.change_1d) }}
              </span>
              <span :class="changeClass(change.change_1d_pct)" class="text-[10px] block">
                {{ formatPct(change.change_1d_pct) }}
              </span>
            </td>
            <td class="px-4 py-2.5 text-right">
              <span :class="changeClass(change.change_7d)" class="text-sm font-medium">
                {{ formatChange(change.change_7d) }}
              </span>
              <span :class="changeClass(change.change_7d_pct)" class="text-[10px] block">
                {{ formatPct(change.change_7d_pct) }}
              </span>
            </td>
            <td class="px-4 py-2.5 text-right hidden sm:table-cell">
              <span :class="changeClass(change.change_30d)" class="text-sm font-medium">
                {{ formatChange(change.change_30d) }}
              </span>
              <span :class="changeClass(change.change_30d_pct)" class="text-[10px] block">
                {{ formatPct(change.change_30d_pct) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { PlayerValueChange } from '@/types/league'

const props = defineProps<{
  changes: PlayerValueChange[]
}>()

const { t } = useI18n()

const sortKey = ref<'1d' | '7d' | '30d'>('7d')

const sortedChanges = computed(() => {
  const key = sortKey.value === '1d' ? 'change_1d'
    : sortKey.value === '7d' ? 'change_7d'
    : 'change_30d'

  return [...props.changes].sort((a, b) => Math.abs(b[key]) - Math.abs(a[key]))
})

function changeClass(value: number): string {
  if (value > 0) return 'text-emerald-600 dark:text-emerald-400'
  if (value < 0) return 'text-red-600 dark:text-red-400'
  return 'text-gray-400'
}

function formatChange(value: number): string {
  const sign = value >= 0 ? '+' : ''
  if (Math.abs(value) >= 1_000_000) {
    return `${sign}${(value / 1_000_000).toFixed(2)}M`
  }
  if (Math.abs(value) >= 1_000) {
    return `${sign}${(value / 1_000).toFixed(0)}K`
  }
  return `${sign}${value}`
}

function formatPct(value: number): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

function formatMoney(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`
  }
  return `${(value / 1000).toFixed(0)}K`
}
</script>
