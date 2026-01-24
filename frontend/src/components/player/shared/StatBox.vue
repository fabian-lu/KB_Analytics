<template>
  <div
    class="rounded-xl p-3 text-center"
    :class="bgClass"
  >
    <p class="text-[10px] uppercase tracking-wide mb-1" :class="labelClass">
      {{ label }}
    </p>
    <p class="text-lg sm:text-xl font-bold" :class="valueClass">
      {{ formattedValue }}
    </p>
    <p v-if="subValue" class="text-xs mt-0.5" :class="subValueClass">
      {{ subValue }}
    </p>
    <slot name="footer" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'muted'

const props = withDefaults(defineProps<{
  label: string
  value: string | number
  subValue?: string
  variant?: Variant
  format?: 'number' | 'money' | 'percent' | 'none'
}>(), {
  variant: 'default',
  format: 'none',
})

const bgClass = computed(() => {
  switch (props.variant) {
    case 'success':
      return 'bg-green-50 dark:bg-green-900/20'
    case 'warning':
      return 'bg-amber-50 dark:bg-amber-900/20'
    case 'danger':
      return 'bg-red-50 dark:bg-red-900/20'
    case 'info':
      return 'bg-cyan-50 dark:bg-cyan-900/20'
    case 'muted':
      return 'bg-gray-50 dark:bg-gray-800/50'
    default:
      return 'bg-gray-100 dark:bg-gray-800'
  }
})

const labelClass = computed(() => {
  switch (props.variant) {
    case 'success':
      return 'text-green-600 dark:text-green-400'
    case 'warning':
      return 'text-amber-600 dark:text-amber-400'
    case 'danger':
      return 'text-red-600 dark:text-red-400'
    case 'info':
      return 'text-cyan-600 dark:text-cyan-400'
    default:
      return 'text-gray-500 dark:text-gray-400'
  }
})

const valueClass = computed(() => {
  switch (props.variant) {
    case 'success':
      return 'text-green-700 dark:text-green-300'
    case 'warning':
      return 'text-amber-700 dark:text-amber-300'
    case 'danger':
      return 'text-red-700 dark:text-red-300'
    case 'info':
      return 'text-cyan-700 dark:text-cyan-300'
    default:
      return 'text-gray-900 dark:text-white'
  }
})

const subValueClass = computed(() => {
  switch (props.variant) {
    case 'success':
      return 'text-green-600 dark:text-green-400'
    case 'warning':
      return 'text-amber-600 dark:text-amber-400'
    case 'danger':
      return 'text-red-600 dark:text-red-400'
    case 'info':
      return 'text-cyan-600 dark:text-cyan-400'
    default:
      return 'text-gray-500 dark:text-gray-400'
  }
})

const formattedValue = computed(() => {
  const val = props.value

  if (props.format === 'none' || typeof val === 'string') {
    return val
  }

  if (props.format === 'money') {
    if (val >= 1_000_000) {
      return `${(val / 1_000_000).toFixed(1)}M €`
    }
    if (val >= 1_000) {
      return `${(val / 1_000).toFixed(0)}K €`
    }
    return `${val} €`
  }

  if (props.format === 'percent') {
    return `${val}%`
  }

  if (props.format === 'number') {
    return new Intl.NumberFormat('de-DE').format(val)
  }

  return val
})
</script>
