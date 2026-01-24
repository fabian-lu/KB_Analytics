<template>
  <span
    class="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium"
    :class="bgClass"
  >
    <span class="font-bold">#{{ rank }}</span>
    <span v-if="total" class="opacity-70">/ {{ total }}</span>
    <span v-if="label" class="opacity-70">{{ label }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  rank: number
  total?: number
  label?: string
  variant?: 'default' | 'gold' | 'silver' | 'bronze'
}>(), {
  variant: 'default',
})

const bgClass = computed(() => {
  // Auto-determine variant based on rank if not explicitly set
  if (props.variant !== 'default') {
    switch (props.variant) {
      case 'gold':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
      case 'silver':
        return 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
      case 'bronze':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
    }
  }

  // Auto-color based on rank
  if (props.rank === 1) {
    return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
  }
  if (props.rank === 2) {
    return 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
  }
  if (props.rank === 3) {
    return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
  }
  if (props.rank <= 10) {
    return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
  }
  return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
})
</script>
