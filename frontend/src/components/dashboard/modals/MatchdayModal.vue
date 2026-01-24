<template>
  <BaseModal :open="open" :title="t('dashboard.currentMatchday')" size="lg" @close="$emit('close')">
    <!-- View Toggle -->
    <div class="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4">
      <button
        @click="view = 'fixtures'"
        class="flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors"
        :class="view === 'fixtures'
          ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
      >
        {{ t('matchday.fixtures') }}
      </button>
      <button
        @click="view = 'table'"
        class="flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors"
        :class="view === 'table'
          ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
      >
        {{ t('matchday.table') }}
      </button>
    </div>

    <!-- Fixtures View -->
    <div v-if="view === 'fixtures'">
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
          {{ t('matchday.matchdayNum', { num: selectedMatchday }) }}
        </span>
        <button
          @click="nextMatchday"
          :disabled="selectedMatchday >= matchdayData.total_matchdays"
          class="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      <!-- Fixtures List grouped by day -->
      <div v-scrollbar-autohide class="max-h-[55vh] overflow-y-auto scrollbar-autohide">
        <template v-for="(group, index) in fixturesByDay" :key="group.date">
          <!-- Day Divider -->
          <div
            class="sticky top-0 px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
            :class="{ 'mt-2': index > 0 }"
          >
            {{ group.dayLabel }}
          </div>

          <!-- Fixtures for this day -->
          <div class="divide-y divide-gray-100 dark:divide-gray-800">
            <div
              v-for="fixture in group.fixtures"
              :key="fixture.id"
              class="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <!-- Time -->
              <span class="w-10 text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                {{ formatTime(fixture.datetime) }}
              </span>

              <!-- Home Team -->
              <div class="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
                <span class="text-xs font-medium text-gray-900 dark:text-white truncate">
                  {{ fixture.home_team.short_name }}
                </span>
                <div class="relative flex-shrink-0">
                  <img :src="fixture.home_team.logo" :alt="fixture.home_team.name" class="w-5 h-5 object-contain" />
                  <div class="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white dark:border-gray-900" :title="t('matchday.homeTeam')" />
                </div>
              </div>

              <!-- Score -->
              <div class="flex-shrink-0 px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 min-w-[44px] text-center">
                <span v-if="fixture.home_score !== null" class="text-xs font-bold text-gray-900 dark:text-white">
                  {{ fixture.home_score }}:{{ fixture.away_score }}
                </span>
                <span v-else class="text-xs text-gray-400 dark:text-gray-500">
                  -:-
                </span>
              </div>

              <!-- Away Team -->
              <div class="flex items-center gap-1.5 flex-1 min-w-0">
                <img :src="fixture.away_team.logo" :alt="fixture.away_team.name" class="w-5 h-5 object-contain flex-shrink-0" />
                <span class="text-xs font-medium text-gray-900 dark:text-white truncate">
                  {{ fixture.away_team.short_name }}
                </span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Table View -->
    <div v-else v-scrollbar-autohide class="max-h-[60vh] overflow-y-auto scrollbar-autohide">
      <!-- Table Header -->
      <div class="grid grid-cols-[auto_auto_1fr_auto_auto_auto_auto] gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-[9px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900">
        <span class="w-5 sm:w-6 text-center">#</span>
        <span class="w-6 sm:w-8"></span>
        <span>{{ t('matchday.team') }}</span>
        <span class="w-6 sm:w-8 text-center">{{ t('matchday.played') }}</span>
        <span class="w-8 sm:w-10 text-center">{{ t('matchday.gd') }}</span>
        <span class="w-8 sm:w-10 text-center">{{ t('matchday.pts') }}</span>
        <span class="w-10 sm:w-14 text-center">{{ t('matchday.kbPts') }}</span>
      </div>

      <!-- Table Rows -->
      <div class="divide-y divide-gray-100 dark:divide-gray-800">
        <div
          v-for="entry in matchdayData.table"
          :key="entry.team.id"
          class="grid grid-cols-[auto_auto_1fr_auto_auto_auto_auto] gap-1 sm:gap-2 px-2 sm:px-3 py-2 items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          :class="{
            'bg-green-50 dark:bg-green-900/20': entry.rank <= 4,
            'bg-yellow-50 dark:bg-yellow-900/20': entry.rank === 5 || entry.rank === 6,
            'bg-red-50 dark:bg-red-900/20': entry.rank >= 16,
          }"
        >
          <!-- Rank -->
          <span class="w-5 sm:w-6 text-center text-xs sm:text-sm font-bold" :class="{
            'text-green-600 dark:text-green-400': entry.rank <= 4,
            'text-yellow-600 dark:text-yellow-400': entry.rank === 5 || entry.rank === 6,
            'text-red-600 dark:text-red-400': entry.rank >= 16,
            'text-gray-700 dark:text-gray-300': entry.rank > 6 && entry.rank < 16,
          }">
            {{ entry.rank }}
          </span>

          <!-- Logo -->
          <img :src="entry.team.logo" :alt="entry.team.name" class="w-6 h-6 sm:w-8 sm:h-8 object-contain" />

          <!-- Team Name -->
          <span class="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
            {{ entry.team.short_name }}
          </span>

          <!-- Played -->
          <span class="w-6 sm:w-8 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            {{ entry.played }}
          </span>

          <!-- Goal Difference -->
          <span class="w-8 sm:w-10 text-center text-xs sm:text-sm" :class="entry.goal_difference > 0 ? 'text-green-600 dark:text-green-400' : entry.goal_difference < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'">
            {{ entry.goal_difference > 0 ? '+' : '' }}{{ entry.goal_difference }}
          </span>

          <!-- Points -->
          <span class="w-8 sm:w-10 text-center text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
            {{ entry.points }}
          </span>

          <!-- Kickbase Points -->
          <span class="w-10 sm:w-14 text-center text-xs sm:text-sm text-cyan-600 dark:text-cyan-400">
            {{ entry.kickbase_points.toLocaleString() }}
          </span>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import BaseModal from '@/components/ui/BaseModal.vue'
import type { MatchdayData } from '@/types/dashboard'

const props = defineProps<{
  open: boolean
  matchdayData: MatchdayData
}>()

defineEmits<{
  close: []
}>()

const { t, locale } = useI18n()

// View toggle state
type ViewType = 'fixtures' | 'table'
const view = ref<ViewType>('fixtures')

// Matchday selector state
const selectedMatchday = ref(props.matchdayData.current_matchday)

// Get fixtures for selected matchday (array is 0-indexed, matchdays are 1-indexed)
const currentFixtures = computed(() => {
  const index = selectedMatchday.value - 1
  return props.matchdayData.matchday_fixtures[index] || []
})

// Group fixtures by day
interface FixtureGroup {
  date: string
  dayLabel: string
  fixtures: typeof currentFixtures.value
}

const fixturesByDay = computed((): FixtureGroup[] => {
  const groups = new Map<string, typeof currentFixtures.value>()

  for (const fixture of currentFixtures.value) {
    const date = new Date(fixture.datetime)
    const dateKey = date.toISOString().split('T')[0] // YYYY-MM-DD

    if (!groups.has(dateKey)) {
      groups.set(dateKey, [])
    }
    groups.get(dateKey)!.push(fixture)
  }

  // Sort by date and format labels
  return Array.from(groups.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([dateKey, fixtures]) => {
      const date = new Date(dateKey + 'T12:00:00') // Noon to avoid timezone issues
      const dayLabel = date.toLocaleDateString(locale.value === 'de' ? 'de-DE' : 'en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
      })
      return { date: dateKey, dayLabel, fixtures }
    })
})

function prevMatchday() {
  if (selectedMatchday.value > 1) {
    selectedMatchday.value--
  }
}

function nextMatchday() {
  if (selectedMatchday.value < props.matchdayData.total_matchdays) {
    selectedMatchday.value++
  }
}

function formatTime(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleTimeString(locale.value === 'de' ? 'de-DE' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>
