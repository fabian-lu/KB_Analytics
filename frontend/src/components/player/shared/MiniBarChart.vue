<template>
  <div class="flex items-end gap-1 h-12">
    <div
      v-for="(point, index) in points"
      :key="index"
      class="flex-1 rounded-t transition-all"
      :class="getBarColor(point)"
      :style="{ height: `${getBarHeight(point)}%` }"
      :title="`MD${startMatchday + index}: ${point} pts`"
    />
  </div>
  <div v-if="showLabels" class="flex gap-1 mt-1">
    <span
      v-for="(point, index) in points"
      :key="index"
      class="flex-1 text-center text-[9px] text-gray-500 dark:text-gray-400"
    >
      {{ point }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  points: number[]
  startMatchday?: number
  showLabels?: boolean
  maxValue?: number
}>(), {
  startMatchday: 1,
  showLabels: true,
})

const maxPoint = computed(() => props.maxValue || Math.max(...props.points, 1))

function getBarHeight(point: number): number {
  return Math.max(5, (point / maxPoint.value) * 100)
}

function getBarColor(point: number): string {
  if (point >= 80) return 'bg-green-500'
  if (point >= 50) return 'bg-green-400'
  if (point >= 30) return 'bg-amber-400'
  if (point >= 15) return 'bg-orange-400'
  return 'bg-red-400'
}
</script>
