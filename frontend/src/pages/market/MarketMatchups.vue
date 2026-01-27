<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 space-y-6">

    <!-- Two-column layout for chart and clean sheet odds (FIRST) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Vulnerability Chart -->
      <VulnerabilityChart :teams="mockTeamMatchups" />

      <!-- Clean Sheet Odds -->
      <section>
        <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden h-full">
          <div class="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
              {{ t('matchups.cleanSheetOdds') }}
            </h3>
            <p class="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
              {{ t('matchups.cleanSheetOddsDesc') }}
            </p>
          </div>

          <div class="p-4 space-y-1.5 max-h-[420px] overflow-y-auto">
            <div
              v-for="team in cleanSheetRanked"
              :key="team.team_id"
              class="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
            >
              <img :src="team.team_logo" :alt="team.team_name" class="w-7 h-7 md:w-8 md:h-8 object-contain flex-shrink-0" />
              <div class="flex-1 min-w-0">
                <p class="text-sm md:text-base font-medium text-gray-900 dark:text-white truncate">
                  {{ team.team_short }}
                </p>
                <p class="text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate">
                  {{ t('matchups.vsOpponent', { opponent: team.fixtures[0]?.opponent_short ?? '-' }) }}
                </p>
              </div>
              <!-- Progress bar -->
              <div class="w-24 md:w-32 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all"
                  :style="{
                    width: `${team.clean_sheet_pct}%`,
                    backgroundColor: cleanSheetColor(team.clean_sheet_pct),
                  }"
                />
              </div>
              <span
                class="text-sm md:text-base font-bold w-12 text-right"
                :style="{ color: cleanSheetColor(team.clean_sheet_pct) }"
              >
                {{ team.clean_sheet_pct }}%
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Fixture Difficulty Section (SECOND) -->
    <section>
      <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <h2 class="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                {{ t('matchups.fixtureDifficulty') }}
              </h2>
              <p class="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {{ t('matchups.fixtureDifficultyDesc') }}
              </p>
            </div>
            <!-- Legend (desktop) -->
            <div class="hidden md:flex items-center gap-3 text-xs">
              <span class="flex items-center gap-1.5">
                <span class="w-4 h-4 rounded" :style="{ backgroundColor: difficultyColor(1) }" />
                {{ t('matchups.veryEasy') }}
              </span>
              <span class="flex items-center gap-1.5">
                <span class="w-4 h-4 rounded" :style="{ backgroundColor: difficultyColor(2) }" />
                {{ t('matchups.easy') }}
              </span>
              <span class="flex items-center gap-1.5">
                <span class="w-4 h-4 rounded" :style="{ backgroundColor: difficultyColor(3) }" />
                {{ t('matchups.medium') }}
              </span>
              <span class="flex items-center gap-1.5">
                <span class="w-4 h-4 rounded" :style="{ backgroundColor: difficultyColor(4) }" />
                {{ t('matchups.hard') }}
              </span>
              <span class="flex items-center gap-1.5">
                <span class="w-4 h-4 rounded" :style="{ backgroundColor: difficultyColor(5) }" />
                {{ t('matchups.veryHard') }}
              </span>
            </div>
          </div>
          <!-- Legend (mobile) -->
          <div class="flex md:hidden flex-wrap gap-2 mt-3 text-[10px]">
            <span class="flex items-center gap-1">
              <span class="w-3 h-3 rounded-sm" :style="{ backgroundColor: difficultyColor(1) }" />
              {{ t('matchups.veryEasy') }}
            </span>
            <span class="flex items-center gap-1">
              <span class="w-3 h-3 rounded-sm" :style="{ backgroundColor: difficultyColor(2) }" />
              {{ t('matchups.easy') }}
            </span>
            <span class="flex items-center gap-1">
              <span class="w-3 h-3 rounded-sm" :style="{ backgroundColor: difficultyColor(3) }" />
              {{ t('matchups.medium') }}
            </span>
            <span class="flex items-center gap-1">
              <span class="w-3 h-3 rounded-sm" :style="{ backgroundColor: difficultyColor(4) }" />
              {{ t('matchups.hard') }}
            </span>
            <span class="flex items-center gap-1">
              <span class="w-3 h-3 rounded-sm" :style="{ backgroundColor: difficultyColor(5) }" />
              {{ t('matchups.veryHard') }}
            </span>
          </div>
        </div>

        <!-- Mobile Table with expandable rows -->
        <div class="md:hidden">
          <div
            v-for="team in sortedTeams"
            :key="team.team_id"
            class="border-t border-gray-100 dark:border-gray-800"
          >
            <!-- Row (clickable) -->
            <button
              class="w-full flex items-center px-3 py-3 text-left active:bg-gray-50 dark:active:bg-gray-800/30"
              @click="toggleExpanded(team.team_id)"
            >
              <div class="flex items-center gap-2 flex-1 min-w-0">
                <img :src="team.team_logo" :alt="team.team_name" class="w-6 h-6 object-contain flex-shrink-0" />
                <span class="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {{ team.team_short }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <div class="flex flex-col items-center gap-0.5">
                  <img :src="team.fixtures[0].opponent_logo" :alt="team.fixtures[0].opponent_name" class="w-5 h-5 object-contain" />
                  <span
                    class="text-[9px] font-semibold px-1.5 py-0.5 rounded"
                    :style="{ backgroundColor: difficultyColor(team.fixtures[0].difficulty), color: '#fff' }"
                  >
                    {{ team.fixtures[0].is_home ? t('matchups.home') : t('matchups.away') }}
                  </span>
                </div>
                <span
                  class="inline-flex items-center justify-center w-9 h-7 rounded text-xs font-bold"
                  :style="{ backgroundColor: difficultyColor(avgDifficulty(team, 3)), color: '#fff' }"
                >
                  {{ avgDifficulty(team, 3).toFixed(1) }}
                </span>
                <span
                  class="inline-flex items-center justify-center w-9 h-7 rounded text-xs font-bold"
                  :style="{ backgroundColor: difficultyColor(avgDifficulty(team, 5)), color: '#fff' }"
                >
                  {{ avgDifficulty(team, 5).toFixed(1) }}
                </span>
                <ChevronDown
                  class="w-4 h-4 text-gray-400 transition-transform ml-1"
                  :class="{ 'rotate-180': expandedTeamId === team.team_id }"
                />
              </div>
            </button>

            <!-- Expanded detail view -->
            <div
              v-if="expandedTeamId === team.team_id"
              class="px-3 pb-3 bg-gray-50 dark:bg-gray-800/30"
            >
              <div class="flex items-center justify-between gap-2 pt-2">
                <div
                  v-for="(fixture, idx) in team.fixtures"
                  :key="idx"
                  class="flex-1 flex flex-col items-center gap-1 p-2 rounded-lg bg-white dark:bg-gray-900"
                >
                  <span class="text-[9px] text-gray-500 dark:text-gray-400 font-medium">MD {{ fixture.matchday }}</span>
                  <img :src="fixture.opponent_logo" :alt="fixture.opponent_name" class="w-6 h-6 object-contain" />
                  <span
                    class="text-[9px] font-semibold px-1.5 py-0.5 rounded"
                    :style="{ backgroundColor: difficultyColor(fixture.difficulty), color: '#fff' }"
                  >
                    {{ fixture.is_home ? t('matchups.home') : t('matchups.away') }}
                  </span>
                </div>
              </div>
              <div class="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div class="text-center">
                  <span class="text-[10px] text-gray-500 dark:text-gray-400 block">{{ t('matchups.next3') }}</span>
                  <span
                    class="inline-flex items-center justify-center w-10 h-7 rounded text-xs font-bold mt-1"
                    :style="{ backgroundColor: difficultyColor(avgDifficulty(team, 3)), color: '#fff' }"
                  >
                    {{ avgDifficulty(team, 3).toFixed(1) }}
                  </span>
                </div>
                <div class="text-center">
                  <span class="text-[10px] text-gray-500 dark:text-gray-400 block">{{ t('matchups.next5') }}</span>
                  <span
                    class="inline-flex items-center justify-center w-10 h-7 rounded text-xs font-bold mt-1"
                    :style="{ backgroundColor: difficultyColor(avgDifficulty(team, 5)), color: '#fff' }"
                  >
                    {{ avgDifficulty(team, 5).toFixed(1) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop Table (full with all matchdays) -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500 dark:text-gray-400 uppercase">
                <th class="px-4 py-3 text-left font-semibold min-w-[180px]">{{ t('matchups.team') }}</th>
                <th class="px-3 py-3 text-center font-semibold">MD 19</th>
                <th class="px-3 py-3 text-center font-semibold">MD 20</th>
                <th class="px-3 py-3 text-center font-semibold">MD 21</th>
                <th class="px-3 py-3 text-center font-semibold">MD 22</th>
                <th class="px-3 py-3 text-center font-semibold">MD 23</th>
                <th class="px-3 py-3 text-center font-semibold bg-gray-100 dark:bg-gray-800">{{ t('matchups.next3') }}</th>
                <th class="px-3 py-3 text-center font-semibold bg-gray-100 dark:bg-gray-800">{{ t('matchups.next5') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="team in sortedTeams"
                :key="team.team_id"
                class="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors"
              >
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <img :src="team.team_logo" :alt="team.team_name" class="w-8 h-8 object-contain flex-shrink-0" />
                    <span class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ team.team_name }}
                    </span>
                  </div>
                </td>
                <td v-for="(fixture, idx) in team.fixtures" :key="idx" class="px-3 py-3 text-center">
                  <div class="flex flex-col items-center gap-1">
                    <img :src="fixture.opponent_logo" :alt="fixture.opponent_name" class="w-7 h-7 object-contain" :title="fixture.opponent_name" />
                    <span
                      class="text-[10px] font-semibold px-2 py-0.5 rounded"
                      :style="{ backgroundColor: difficultyColor(fixture.difficulty), color: '#fff' }"
                    >
                      {{ fixture.is_home ? t('matchups.home') : t('matchups.away') }}
                    </span>
                  </div>
                </td>
                <td class="px-3 py-3 text-center bg-gray-50/50 dark:bg-gray-800/30">
                  <span
                    class="inline-flex items-center justify-center w-11 h-8 rounded-md text-sm font-bold shadow-sm"
                    :style="{ backgroundColor: difficultyColor(avgDifficulty(team, 3)), color: '#fff' }"
                  >
                    {{ avgDifficulty(team, 3).toFixed(1) }}
                  </span>
                </td>
                <td class="px-3 py-3 text-center bg-gray-50/50 dark:bg-gray-800/30">
                  <span
                    class="inline-flex items-center justify-center w-11 h-8 rounded-md text-sm font-bold shadow-sm"
                    :style="{ backgroundColor: difficultyColor(avgDifficulty(team, 5)), color: '#fff' }"
                  >
                    {{ avgDifficulty(team, 5).toFixed(1) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChevronDown } from 'lucide-vue-next'
import { mockTeamMatchups, type TeamMatchupData } from '@/mocks/marketMock'
import VulnerabilityChart from '@/components/market/VulnerabilityChart.vue'

const { t } = useI18n()

const expandedTeamId = ref<string | null>(null)

// Sort teams by average difficulty (easiest first)
const sortedTeams = computed(() => {
  return [...mockTeamMatchups].sort((a, b) => {
    const avgA = avgDifficulty(a, 5)
    const avgB = avgDifficulty(b, 5)
    return avgA - avgB
  })
})

// Sort by clean sheet probability (highest first)
const cleanSheetRanked = computed(() => {
  return [...mockTeamMatchups].sort((a, b) => b.clean_sheet_pct - a.clean_sheet_pct)
})

function toggleExpanded(teamId: string) {
  expandedTeamId.value = expandedTeamId.value === teamId ? null : teamId
}

function avgDifficulty(team: TeamMatchupData, count: number): number {
  const fixtures = team.fixtures.slice(0, count)
  if (fixtures.length === 0) return 3
  const sum = fixtures.reduce((acc, f) => acc + f.difficulty, 0)
  return sum / fixtures.length
}

function difficultyColor(difficulty: number): string {
  if (difficulty <= 1.5) return '#22c55e' // green-500
  if (difficulty <= 2.5) return '#84cc16' // lime-500
  if (difficulty <= 3.5) return '#eab308' // yellow-500
  if (difficulty <= 4.5) return '#f97316' // orange-500
  return '#ef4444' // red-500
}

function cleanSheetColor(pct: number): string {
  if (pct >= 35) return '#22c55e' // green
  if (pct >= 20) return '#84cc16' // lime
  if (pct >= 12) return '#eab308' // yellow
  return '#ef4444' // red
}
</script>
