<template>
  <BaseModal :open="open" :title="t('dashboard.leagueRank')" size="lg" @close="$emit('close')">
    <!-- View Toggle -->
    <div class="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4">
      <button
        @click="view = 'season'"
        class="flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors"
        :class="view === 'season'
          ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
      >
        {{ t('ranking.season') }}
      </button>
      <button
        @click="view = 'matchday'"
        class="flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors"
        :class="view === 'matchday'
          ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
      >
        {{ t('ranking.matchday') }}
      </button>
    </div>

    <!-- Season View -->
    <div v-if="view === 'season'" v-scrollbar-autohide class="max-h-[60vh] overflow-y-auto scrollbar-autohide">
      <!-- Table Header -->
      <div class="grid grid-cols-[auto_1fr_auto_auto] gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900">
        <span class="w-6 sm:w-8 text-center">#</span>
        <span>{{ t('ranking.manager') }}</span>
        <span class="w-10 sm:w-16 text-right">{{ t('ranking.avg') }}</span>
        <span class="w-12 sm:w-20 text-right">{{ t('ranking.total') }}</span>
      </div>

      <!-- Table Rows -->
      <div class="divide-y divide-gray-100 dark:divide-gray-800">
        <div
          v-for="entry in leagueRanking.season"
          :key="entry.manager.id"
          class="grid grid-cols-[auto_1fr_auto_auto] gap-1 sm:gap-2 px-2 sm:px-3 py-2 sm:py-3 items-center transition-colors"
          :class="entry.manager.id === currentUserId
            ? 'bg-accent/10 dark:bg-accent/20'
            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'"
        >
          <!-- Rank -->
          <span class="w-6 sm:w-8 text-center font-bold text-sm sm:text-base" :class="entry.rank === 1 ? 'text-amber-500' : 'text-gray-700 dark:text-gray-300'">
            <span v-if="entry.rank === 1" class="inline-flex items-center">
              <Crown class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
            </span>
            <span v-else>{{ entry.rank }}</span>
          </span>

          <!-- Manager -->
          <div class="flex items-center gap-2 sm:gap-3 min-w-0">
            <img
              :src="entry.manager.profile_image"
              :alt="entry.manager.name"
              class="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0"
            />
            <span
              class="text-xs sm:text-base font-medium truncate"
              :class="entry.manager.id === currentUserId
                ? 'text-accent dark:text-accent-light'
                : 'text-gray-900 dark:text-white'"
            >
              {{ entry.manager.name }}
            </span>
          </div>

          <!-- Avg Points -->
          <span class="w-10 sm:w-16 text-right text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {{ entry.avg_points_per_matchday }}
          </span>

          <!-- Total Points -->
          <span class="w-12 sm:w-20 text-right text-xs sm:text-base font-semibold text-gray-900 dark:text-white">
            {{ entry.total_points.toLocaleString() }}
          </span>
        </div>
      </div>
    </div>

    <!-- Matchday View -->
    <div v-else>
      <!-- Matchday Selector -->
      <div class="flex items-center justify-center gap-2 sm:gap-4 mb-4">
        <button
          @click="prevMatchday"
          :disabled="selectedMatchday <= 1"
          class="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <span class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white min-w-[120px] sm:min-w-[140px] text-center">
          {{ t('ranking.matchdayNum', { num: selectedMatchday }) }}
        </span>
        <button
          @click="nextMatchday"
          :disabled="selectedMatchday >= currentMatchday"
          class="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      <!-- Scrollable table -->
      <div v-scrollbar-autohide class="max-h-[60vh] overflow-y-auto scrollbar-autohide">
        <!-- Table Header -->
        <div class="grid grid-cols-[auto_1fr_auto] gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900">
          <span class="w-6 sm:w-8 text-center">#</span>
          <span>{{ t('ranking.manager') }}</span>
          <span class="w-14 sm:w-20 text-right">{{ t('ranking.points') }}</span>
        </div>

        <!-- Table Rows -->
        <div class="divide-y divide-gray-100 dark:divide-gray-800">
          <div
            v-for="entry in currentMatchdayRanking"
            :key="entry.manager.id"
            class="grid grid-cols-[auto_1fr_auto] gap-1 sm:gap-2 px-2 sm:px-3 py-2 sm:py-3 items-center transition-colors"
            :class="entry.manager.id === currentUserId
              ? 'bg-accent/10 dark:bg-accent/20'
              : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'"
          >
            <!-- Rank -->
            <span class="w-6 sm:w-8 text-center font-bold text-sm sm:text-base" :class="entry.rank === 1 ? 'text-amber-500' : 'text-gray-700 dark:text-gray-300'">
              <span v-if="entry.rank === 1" class="inline-flex items-center">
                <Crown class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
              </span>
              <span v-else>{{ entry.rank }}</span>
            </span>

            <!-- Manager -->
            <div class="flex items-center gap-2 sm:gap-3 min-w-0">
              <img
                :src="entry.manager.profile_image"
                :alt="entry.manager.name"
                class="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0"
              />
              <span
                class="text-xs sm:text-base font-medium truncate"
                :class="entry.manager.id === currentUserId
                  ? 'text-accent dark:text-accent-light'
                  : 'text-gray-900 dark:text-white'"
              >
                {{ entry.manager.name }}
              </span>
            </div>

            <!-- Points -->
            <span class="w-14 sm:w-20 text-right text-xs sm:text-base font-semibold text-gray-900 dark:text-white">
              {{ entry.points.toLocaleString() }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Crown, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import BaseModal from '@/components/ui/BaseModal.vue'
import type { LeagueRanking } from '@/types/dashboard'

const props = defineProps<{
  open: boolean
  leagueRanking: LeagueRanking
  currentUserId: string
  currentMatchday: number
}>()

defineEmits<{
  close: []
}>()

const { t } = useI18n()

// View toggle state
type ViewType = 'season' | 'matchday'
const view = ref<ViewType>('season')

// Matchday selector state
const selectedMatchday = ref(props.currentMatchday)

// Get ranking for selected matchday (array is 0-indexed, matchdays are 1-indexed)
const currentMatchdayRanking = computed(() => {
  const index = selectedMatchday.value - 1
  return props.leagueRanking.matchdays[index] || []
})

function prevMatchday() {
  if (selectedMatchday.value > 1) {
    selectedMatchday.value--
  }
}

function nextMatchday() {
  if (selectedMatchday.value < props.currentMatchday) {
    selectedMatchday.value++
  }
}
</script>
