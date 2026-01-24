<template>
  <div class="space-y-4">
    <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
      {{ t('dashboard.lineup') }}
    </h2>

    <!-- Stats boxes -->
    <LineupStats :players="allStarting" :formation="derivedFormation" />

    <!-- Formation warning -->
    <div
      v-if="showFormationWarning"
      class="px-3 py-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 text-sm"
    >
      {{ formationWarningMessage }}
    </div>

    <!-- Pitch and Bench -->
    <div class="flex flex-col lg:flex-row lg:gap-4 lg:justify-center">
      <!-- Pitch -->
      <div class="lg:h-[calc(100vh-200px)] lg:flex-shrink-0">
        <LineupPitch
          v-model:starting-g-k="startingGK"
          v-model:starting-d-f="startingDF"
          v-model:starting-m-f="startingMF"
          v-model:starting-f-w="startingFW"
          class="h-full w-auto"
        />
      </div>

      <!-- Bench -->
      <LineupBench
        v-model:bench-g-k="benchGK"
        v-model:bench-d-f="benchDF"
        v-model:bench-m-f="benchMF"
        v-model:bench-f-w="benchFW"
        class="mt-4 lg:mt-0 lg:h-[calc(100vh-200px)]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, provide } from 'vue'
import { useI18n } from 'vue-i18n'
import type { DashboardLineup, PlayerSummary } from '@/types/dashboard'
import LineupPitch from './LineupPitch.vue'
import LineupBench from './LineupBench.vue'
import LineupStats from './LineupStats.vue'

const props = defineProps<{
  lineup: DashboardLineup
}>()

const { t } = useI18n()

// Allowed formations (DF-MF-FW)
const ALLOWED_FORMATIONS = [
  '3-4-3', '3-5-2', '3-6-1',
  '4-2-4', '4-3-3', '4-4-2', '4-5-1',
  '5-2-3', '5-3-2', '5-4-1',
]

// Max players per position (derived from all formations)
const MAX_PER_POSITION: Record<number, number> = {
  1: 1,  // GK: always 1
  2: 5,  // DF: max from 5-x-x
  3: 6,  // MF: max from 3-6-1
  4: 4,  // FW: max from 4-2-4
}

// Split players by position
function splitByPosition(players: PlayerSummary[]) {
  const result: Record<number, PlayerSummary[]> = { 1: [], 2: [], 3: [], 4: [] }
  for (const p of players) {
    if (result[p.position]) {
      result[p.position].push(p)
    }
  }
  return result
}

// Initialize state from props
const startingByPos = splitByPosition(props.lineup.starting)
const benchByPos = splitByPosition(props.lineup.bench)

const startingGK = ref<PlayerSummary[]>([...startingByPos[1]])
const startingDF = ref<PlayerSummary[]>([...startingByPos[2]])
const startingMF = ref<PlayerSummary[]>([...startingByPos[3]])
const startingFW = ref<PlayerSummary[]>([...startingByPos[4]])

const benchGK = ref<PlayerSummary[]>([...benchByPos[1]])
const benchDF = ref<PlayerSummary[]>([...benchByPos[2]])
const benchMF = ref<PlayerSummary[]>([...benchByPos[3]])
const benchFW = ref<PlayerSummary[]>([...benchByPos[4]])

// Combined starting XI for stats
const allStarting = computed(() => [
  ...startingGK.value,
  ...startingDF.value,
  ...startingMF.value,
  ...startingFW.value,
])

// Derive formation from player counts (DF-MF-FW)
const derivedFormation = computed(() => {
  const df = startingDF.value.length
  const mf = startingMF.value.length
  const fw = startingFW.value.length
  if (df === 0 && mf === 0 && fw === 0) return ''
  return `${df}-${mf}-${fw}`
})

// Check if current formation is valid
const isValidFormation = computed(() => {
  if (startingGK.value.length !== 1) return false
  return ALLOWED_FORMATIONS.includes(derivedFormation.value)
})

// Warning messages
const showFormationWarning = computed(() => {
  if (allStarting.value.length === 0) return false
  if (startingGK.value.length === 0) return true
  if (startingGK.value.length > 1) return true
  if (allStarting.value.length === 11 && !isValidFormation.value) return true
  return false
})

const formationWarningMessage = computed(() => {
  if (startingGK.value.length === 0) return t('lineup.noGoalkeeper', 'No goalkeeper selected')
  if (startingGK.value.length > 1) return t('lineup.tooManyGK', 'Only 1 goalkeeper allowed')
  return `Invalid formation (${derivedFormation.value}). Allowed: ${ALLOWED_FORMATIONS.join(', ')}`
})

// Validation function for pitch - can player be added?
function dragValidation(player: PlayerSummary): { allowed: boolean; reason: string } {
  // Already on pitch?
  const isAlreadyOnPitch = allStarting.value.some(p => p.id === player.id)
  if (isAlreadyOnPitch) {
    return { allowed: false, reason: 'Already on pitch' }
  }

  const totalOnPitch = allStarting.value.length
  const positionArrays: Record<number, PlayerSummary[]> = {
    1: startingGK.value,
    2: startingDF.value,
    3: startingMF.value,
    4: startingFW.value,
  }
  const positionCount = positionArrays[player.position]?.length || 0
  const maxForPosition = MAX_PER_POSITION[player.position] || 0

  // Max 11 players
  if (totalOnPitch >= 11) {
    return { allowed: false, reason: 'Maximum 11 players' }
  }

  // Position limit reached
  if (positionCount >= maxForPosition) {
    const posLabel = { 1: 'GK', 2: 'DF', 3: 'MF', 4: 'FW' }[player.position]
    return { allowed: false, reason: `Max ${maxForPosition} ${posLabel}` }
  }

  return { allowed: true, reason: 'Drop to add' }
}

// Provide validation function to children
provide('dragValidation', dragValidation)

// Auto-correct misplaced players (e.g., DF dropped on MF row)
function autoCorrectPosition(arrays: { array: typeof startingGK, position: number }[]) {
  for (const { array, position } of arrays) {
    const misplaced = array.value.filter(p => p.position !== position)
    if (misplaced.length > 0) {
      // Remove misplaced from this array
      array.value = array.value.filter(p => p.position === position)

      // Add to correct arrays
      for (const player of misplaced) {
        const targetArrays: Record<number, typeof startingGK> = {
          1: startingGK, 2: startingDF, 3: startingMF, 4: startingFW
        }
        const target = targetArrays[player.position]
        if (target && !target.value.find(p => p.id === player.id)) {
          target.value = [...target.value, player]
        }
      }
    }
  }
}

// Watch for changes and auto-correct pitch positions
watch([startingGK, startingDF, startingMF, startingFW], () => {
  autoCorrectPosition([
    { array: startingGK, position: 1 },
    { array: startingDF, position: 2 },
    { array: startingMF, position: 3 },
    { array: startingFW, position: 4 },
  ])
}, { deep: true })

// Watch for changes and auto-correct bench positions
watch([benchGK, benchDF, benchMF, benchFW], () => {
  autoCorrectPosition([
    { array: benchGK, position: 1 },
    { array: benchDF, position: 2 },
    { array: benchMF, position: 3 },
    { array: benchFW, position: 4 },
  ])
}, { deep: true })

// Reset state when props change (e.g., league switch)
watch(() => props.lineup, (newLineup) => {
  const starting = splitByPosition(newLineup.starting)
  const bench = splitByPosition(newLineup.bench)

  startingGK.value = [...starting[1]]
  startingDF.value = [...starting[2]]
  startingMF.value = [...starting[3]]
  startingFW.value = [...starting[4]]

  benchGK.value = [...bench[1]]
  benchDF.value = [...bench[2]]
  benchMF.value = [...bench[3]]
  benchFW.value = [...bench[4]]
}, { deep: true })
</script>
