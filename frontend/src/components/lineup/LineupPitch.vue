<template>
  <div
    class="relative w-full lg:w-auto lg:h-full aspect-[3/4] rounded-2xl overflow-hidden shadow-xl transition-all duration-200"
    :class="pitchClass"
  >
    <!-- SVG Pitch Background -->
    <svg
      viewBox="0 0 75 100"
      preserveAspectRatio="none"
      class="absolute inset-0 w-full h-full"
    >
      <defs>
        <linearGradient id="grass" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#0f9d58" />
          <stop offset="100%" stop-color="#0a7e45" />
        </linearGradient>
      </defs>

      <!-- Grass base -->
      <rect x="0" y="0" width="75" height="100" fill="url(#grass)" />

      <!-- Mowing stripes -->
      <rect
        v-for="i in 9"
        :key="'stripe-' + i"
        x="0"
        :y="(i - 1) * 11.2"
        width="75"
        height="5.6"
        fill="#ffffff"
        opacity="0.12"
      />

      <!-- Field markings -->
      <g stroke="#ffffff" stroke-width="0.5" opacity="0.85" fill="none">
        <rect x="2" y="3" width="71" height="94" rx="1" />
        <line x1="2" y1="50" x2="73" y2="50" />
        <circle cx="37.5" cy="50" r="9" />
        <circle cx="37.5" cy="50" r="0.8" fill="#fff" />
        <rect x="12.5" y="3" width="50" height="16" />
        <rect x="22.5" y="3" width="30" height="6" />
        <circle cx="37.5" cy="13" r="0.8" fill="#fff" />
        <path d="M25.5 19 A9 9 0 0 0 49.5 19" />
        <rect x="12.5" y="81" width="50" height="16" />
        <rect x="22.5" y="91" width="30" height="6" />
        <circle cx="37.5" cy="87" r="0.8" fill="#fff" />
        <path d="M25.5 81 A9 9 0 0 1 49.5 81" />
      </g>
    </svg>

    <!-- FW Row -->
    <div class="absolute left-0 right-0 flex justify-center gap-1 lg:gap-2 px-2" style="top: 18%; transform: translateY(-50%)">
      <template v-if="readonly">
        <div class="flex justify-center gap-1 lg:gap-2 min-h-[50px] min-w-[60px]">
          <PlayerChip
            v-for="player in localFW"
            :key="player.id"
            :player="player"
            :readonly="true"
            :highlight="highlightIds.has(player.id)"
          />
        </div>
      </template>
      <template v-else>
        <VueDraggable
          v-model="localFW"
          group="lineup"
          :animation="150"
          :delay="100"
          :delay-on-touch-only="true"
          :touch-start-threshold="5"
          class="flex justify-center gap-1 lg:gap-2 min-h-[50px] min-w-[60px]"
          ghost-class="opacity-40"
          drag-class="scale-110"
          :move="onMove"
        >
          <PlayerChip v-for="player in localFW" :key="player.id" :player="player" />
        </VueDraggable>
      </template>
      <div v-if="localFW.length === 0" class="text-white/40 text-xs self-center">FW</div>
    </div>

    <!-- MF Row -->
    <div class="absolute left-0 right-0 flex justify-center gap-1 lg:gap-2 px-2" style="top: 42%; transform: translateY(-50%)">
      <template v-if="readonly">
        <div class="flex justify-center gap-1 lg:gap-2 min-h-[50px] min-w-[60px]">
          <PlayerChip
            v-for="player in localMF"
            :key="player.id"
            :player="player"
            :readonly="true"
            :highlight="highlightIds.has(player.id)"
          />
        </div>
      </template>
      <template v-else>
        <VueDraggable
          v-model="localMF"
          group="lineup"
          :animation="150"
          :delay="100"
          :delay-on-touch-only="true"
          :touch-start-threshold="5"
          class="flex justify-center gap-1 lg:gap-2 min-h-[50px] min-w-[60px]"
          ghost-class="opacity-40"
          drag-class="scale-110"
          :move="onMove"
        >
          <PlayerChip v-for="player in localMF" :key="player.id" :player="player" />
        </VueDraggable>
      </template>
      <div v-if="localMF.length === 0" class="text-white/40 text-xs self-center">MF</div>
    </div>

    <!-- DF Row -->
    <div class="absolute left-0 right-0 flex justify-center gap-1 lg:gap-2 px-2" style="top: 66%; transform: translateY(-50%)">
      <template v-if="readonly">
        <div class="flex justify-center gap-1 lg:gap-2 min-h-[50px] min-w-[60px]">
          <PlayerChip
            v-for="player in localDF"
            :key="player.id"
            :player="player"
            :readonly="true"
            :highlight="highlightIds.has(player.id)"
          />
        </div>
      </template>
      <template v-else>
        <VueDraggable
          v-model="localDF"
          group="lineup"
          :animation="150"
          :delay="100"
          :delay-on-touch-only="true"
          :touch-start-threshold="5"
          class="flex justify-center gap-1 lg:gap-2 min-h-[50px] min-w-[60px]"
          ghost-class="opacity-40"
          drag-class="scale-110"
          :move="onMove"
        >
          <PlayerChip v-for="player in localDF" :key="player.id" :player="player" />
        </VueDraggable>
      </template>
      <div v-if="localDF.length === 0" class="text-white/40 text-xs self-center">DF</div>
    </div>

    <!-- GK Row -->
    <div class="absolute left-0 right-0 flex justify-center" style="top: 88%; transform: translateY(-50%)">
      <template v-if="readonly">
        <div class="flex justify-center gap-1 lg:gap-2 min-h-[50px] min-w-[60px]">
          <PlayerChip
            v-for="player in localGK"
            :key="player.id"
            :player="player"
            :readonly="true"
            :highlight="highlightIds.has(player.id)"
          />
        </div>
      </template>
      <template v-else>
        <VueDraggable
          v-model="localGK"
          group="lineup"
          :animation="150"
          :delay="100"
          :delay-on-touch-only="true"
          :touch-start-threshold="5"
          class="flex justify-center gap-1 lg:gap-2 min-h-[50px] min-w-[60px]"
          ghost-class="opacity-40"
          drag-class="scale-110"
          :move="onMove"
        >
          <PlayerChip v-for="player in localGK" :key="player.id" :player="player" />
        </VueDraggable>
      </template>
      <div v-if="localGK.length === 0" class="text-white/40 text-xs self-center">GK</div>
    </div>

    <!-- Drop feedback overlay (only in interactive mode) -->
    <div
      v-if="!readonly && validationMessage"
      class="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
      <div
        class="px-4 py-2 rounded-lg text-white font-medium text-sm backdrop-blur-sm"
        :class="isValidDrop ? 'bg-green-500/90' : 'bg-red-500/90'"
      >
        {{ validationMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, inject } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import type { PlayerSummary } from '@/types/dashboard'
import PlayerChip from './PlayerChip.vue'

const props = withDefaults(defineProps<{
  startingGK: PlayerSummary[]
  startingDF: PlayerSummary[]
  startingMF: PlayerSummary[]
  startingFW: PlayerSummary[]
  readonly?: boolean
  highlightPlayerIds?: string[]
}>(), {
  readonly: false,
  highlightPlayerIds: () => [],
})

const emit = defineEmits<{
  'update:startingGK': [players: PlayerSummary[]]
  'update:startingDF': [players: PlayerSummary[]]
  'update:startingMF': [players: PlayerSummary[]]
  'update:startingFW': [players: PlayerSummary[]]
}>()

const highlightIds = computed(() => new Set(props.highlightPlayerIds))

// Inject validation from parent (only used in interactive mode)
const dragValidation = inject<((player: PlayerSummary) => { allowed: boolean; reason: string }) | undefined>('dragValidation', undefined)

// Local state that syncs with props
const localGK = ref<PlayerSummary[]>([...props.startingGK])
const localDF = ref<PlayerSummary[]>([...props.startingDF])
const localMF = ref<PlayerSummary[]>([...props.startingMF])
const localFW = ref<PlayerSummary[]>([...props.startingFW])

// Sync props -> local
watch(() => props.startingGK, (val) => { localGK.value = [...val] }, { deep: true })
watch(() => props.startingDF, (val) => { localDF.value = [...val] }, { deep: true })
watch(() => props.startingMF, (val) => { localMF.value = [...val] }, { deep: true })
watch(() => props.startingFW, (val) => { localFW.value = [...val] }, { deep: true })

// Sync local -> parent (emit updates) - only in interactive mode
watch(localGK, (val) => { if (!props.readonly) emit('update:startingGK', val as PlayerSummary[]) }, { deep: true })
watch(localDF, (val) => { if (!props.readonly) emit('update:startingDF', val as PlayerSummary[]) }, { deep: true })
watch(localMF, (val) => { if (!props.readonly) emit('update:startingMF', val as PlayerSummary[]) }, { deep: true })
watch(localFW, (val) => { if (!props.readonly) emit('update:startingFW', val as PlayerSummary[]) }, { deep: true })

// Visual feedback state (only used in interactive mode)
const isValidDrop = ref(true)
const validationMessage = ref('')

// Pitch styling (ring when dragging)
const pitchClass = computed(() => {
  if (props.readonly || !validationMessage.value) return ''
  return isValidDrop.value ? 'ring-4 ring-green-400' : 'ring-4 ring-red-400'
})

// Validate move - called during drag (only in interactive mode)
function onMove(evt: any): boolean {
  const player = evt.draggedContext?.element as PlayerSummary
  if (!player) return false

  // If dragging OUT of pitch (to bench), always allow
  const toEl = evt.to as HTMLElement
  const isTargetBench = toEl?.closest('.bg-gray-100, .dark\\:bg-gray-800')
  if (isTargetBench) {
    validationMessage.value = ''
    return true
  }

  // If player is already on pitch (reordering), allow
  const allPitch = [...localGK.value, ...localDF.value, ...localMF.value, ...localFW.value]
  const isFromPitch = allPitch.some(p => p.id === player.id)
  if (isFromPitch) {
    validationMessage.value = ''
    return true
  }

  // Validate adding new player to pitch
  if (dragValidation) {
    const result = dragValidation(player)
    isValidDrop.value = result.allowed
    validationMessage.value = result.reason

    // Clear message after delay
    setTimeout(() => { validationMessage.value = '' }, 1500)

    return result.allowed
  }

  return true
}
</script>
