<template>
  <div
    class="p-4 rounded-xl bg-gray-100 dark:bg-gray-800
           overflow-x-auto lg:overflow-x-hidden lg:overflow-y-auto
           transition-all duration-200"
    :class="benchClass"
  >
    <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
      {{ t('lineup.bench') }} ({{ totalBench }})
    </p>

    <!-- Position groups -->
    <div class="flex gap-4 lg:flex-col lg:gap-3">
      <!-- GK -->
      <div class="flex-shrink-0">
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">GK</p>
        <VueDraggable
          v-model="localGK"
          group="lineup"
          :animation="150"
          :delay="100"
          :delay-on-touch-only="true"
          :touch-start-threshold="5"
          class="flex gap-2 lg:flex-col min-h-[50px] p-1 rounded-lg bg-gray-200/50 dark:bg-gray-700/50"
          ghost-class="opacity-40"
        >
          <BenchPlayer v-for="player in localGK" :key="player.id" :player="player" />
        </VueDraggable>
      </div>

      <!-- DF -->
      <div class="flex-shrink-0">
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">DF</p>
        <VueDraggable
          v-model="localDF"
          group="lineup"
          :animation="150"
          :delay="100"
          :delay-on-touch-only="true"
          :touch-start-threshold="5"
          class="flex gap-2 lg:flex-col min-h-[50px] p-1 rounded-lg bg-gray-200/50 dark:bg-gray-700/50"
          ghost-class="opacity-40"
        >
          <BenchPlayer v-for="player in localDF" :key="player.id" :player="player" />
        </VueDraggable>
      </div>

      <!-- MF -->
      <div class="flex-shrink-0">
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">MF</p>
        <VueDraggable
          v-model="localMF"
          group="lineup"
          :animation="150"
          :delay="100"
          :delay-on-touch-only="true"
          :touch-start-threshold="5"
          class="flex gap-2 lg:flex-col min-h-[50px] p-1 rounded-lg bg-gray-200/50 dark:bg-gray-700/50"
          ghost-class="opacity-40"
        >
          <BenchPlayer v-for="player in localMF" :key="player.id" :player="player" />
        </VueDraggable>
      </div>

      <!-- FW -->
      <div class="flex-shrink-0">
        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">FW</p>
        <VueDraggable
          v-model="localFW"
          group="lineup"
          :animation="150"
          :delay="100"
          :delay-on-touch-only="true"
          :touch-start-threshold="5"
          class="flex gap-2 lg:flex-col min-h-[50px] p-1 rounded-lg bg-gray-200/50 dark:bg-gray-700/50"
          ghost-class="opacity-40"
        >
          <BenchPlayer v-for="player in localFW" :key="player.id" :player="player" />
        </VueDraggable>
      </div>
    </div>

    <!-- Drop feedback -->
    <div
      v-if="showDropFeedback"
      class="mt-3 px-3 py-2 rounded-lg bg-green-500/20 text-green-700 dark:text-green-300 text-sm text-center"
    >
      Moved to bench
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { VueDraggable } from 'vue-draggable-plus'
import type { PlayerSummary } from '@/types/dashboard'
import BenchPlayer from './BenchPlayer.vue'

const props = defineProps<{
  benchGK: PlayerSummary[]
  benchDF: PlayerSummary[]
  benchMF: PlayerSummary[]
  benchFW: PlayerSummary[]
}>()

const emit = defineEmits<{
  'update:benchGK': [players: PlayerSummary[]]
  'update:benchDF': [players: PlayerSummary[]]
  'update:benchMF': [players: PlayerSummary[]]
  'update:benchFW': [players: PlayerSummary[]]
}>()

const { t } = useI18n()

// Local state that syncs with props
const localGK = ref<PlayerSummary[]>([...props.benchGK])
const localDF = ref<PlayerSummary[]>([...props.benchDF])
const localMF = ref<PlayerSummary[]>([...props.benchMF])
const localFW = ref<PlayerSummary[]>([...props.benchFW])

// Sync props -> local
watch(() => props.benchGK, (val) => { localGK.value = [...val] }, { deep: true })
watch(() => props.benchDF, (val) => { localDF.value = [...val] }, { deep: true })
watch(() => props.benchMF, (val) => { localMF.value = [...val] }, { deep: true })
watch(() => props.benchFW, (val) => { localFW.value = [...val] }, { deep: true })

// Sync local -> parent (emit updates)
watch(localGK, (val) => { emit('update:benchGK', [...val]) }, { deep: true })
watch(localDF, (val) => { emit('update:benchDF', [...val]) }, { deep: true })
watch(localMF, (val) => { emit('update:benchMF', [...val]) }, { deep: true })
watch(localFW, (val) => { emit('update:benchFW', [...val]) }, { deep: true })

const showDropFeedback = ref(false)

const totalBench = computed(() => {
  return localGK.value.length + localDF.value.length + localMF.value.length + localFW.value.length
})

const benchClass = computed(() => {
  if (showDropFeedback.value) return 'ring-4 ring-green-400'
  return ''
})
</script>
