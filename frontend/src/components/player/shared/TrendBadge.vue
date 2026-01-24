<template>
  <span
    class="inline-flex items-center gap-0.5 font-medium"
    :class="[colorClass, sizeClasses]"
  >
    <component :is="icon" :class="iconSize" />
    <span v-if="showValue">{{ formattedValue }}</span>
    <span v-if="showPercentage && percentage !== undefined" class="opacity-70">({{ percentageFormatted }})</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { TrendingUp, TrendingDown, Minus } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  value: number
  percentage?: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  showPercentage?: boolean
}>(), {
  size: 'md',
  showValue: true,
  showPercentage: false,
})

const isPositive = computed(() => props.value > 0)
const isNegative = computed(() => props.value < 0)

const icon = computed(() => {
  if (isPositive.value) return TrendingUp
  if (isNegative.value) return TrendingDown
  return Minus
})

const colorClass = computed(() => {
  if (isPositive.value) return 'text-green-600 dark:text-green-400'
  if (isNegative.value) return 'text-red-600 dark:text-red-400'
  return 'text-gray-500 dark:text-gray-400'
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm': return 'text-[10px]'
    case 'lg': return 'text-sm'
    default: return 'text-xs'
  }
})

const iconSize = computed(() => {
  switch (props.size) {
    case 'sm': return 'w-3 h-3'
    case 'lg': return 'w-4 h-4'
    default: return 'w-3.5 h-3.5'
  }
})

const formattedValue = computed(() => {
  const absValue = Math.abs(props.value)
  const sign = props.value >= 0 ? '+' : '-'

  if (absValue >= 1_000_000) {
    return `${sign}${(absValue / 1_000_000).toFixed(1)}M`
  }
  if (absValue >= 1_000) {
    return `${sign}${(absValue / 1_000).toFixed(0)}K`
  }
  return `${sign}${absValue}`
})

const percentageFormatted = computed(() => {
  if (props.percentage === undefined) return ''
  const sign = props.percentage >= 0 ? '+' : ''
  return `${sign}${props.percentage.toFixed(1)}%`
})
</script>
