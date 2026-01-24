<template>
  <span class="inline-flex items-center gap-1" :class="colorClass">
    <component :is="icon" class="w-4 h-4" />
    <span class="text-sm font-medium">{{ label }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { TrendingUp, ArrowUpRight, Minus, ArrowDownRight, TrendingDown } from 'lucide-vue-next'
import type { FormTrend } from '@/types/player'

const props = defineProps<{
  trend: FormTrend
}>()

const { t } = useI18n()

const icon = computed(() => {
  switch (props.trend) {
    case 'rising': return TrendingUp
    case 'rising_slight': return ArrowUpRight
    case 'falling': return TrendingDown
    case 'falling_slight': return ArrowDownRight
    default: return Minus
  }
})

const colorClass = computed(() => {
  switch (props.trend) {
    case 'rising':
      return 'text-green-600 dark:text-green-400'
    case 'rising_slight':
      return 'text-green-500 dark:text-green-500'
    case 'falling':
      return 'text-red-600 dark:text-red-400'
    case 'falling_slight':
      return 'text-red-500 dark:text-red-500'
    default:
      return 'text-gray-500 dark:text-gray-400'
  }
})

const label = computed(() => t(`player.form.${props.trend}`))
</script>
