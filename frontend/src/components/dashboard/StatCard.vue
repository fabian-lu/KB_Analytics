<template>
  <div
    class="relative overflow-hidden p-4 rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
    :class="[bgClass, clickable ? 'cursor-pointer' : '']"
    @click="handleClick"
  >
    <!-- Background icon (decorative) -->
    <div
      v-if="icon"
      class="absolute right-1 bottom-1 text-3xl md:text-5xl opacity-10 select-none pointer-events-none"
      :class="iconBgClass"
    >
      {{ icon }}
    </div>

    <!-- Content -->
    <div class="relative z-10">
      <!-- Top row: icon + label -->
      <div class="flex items-center gap-2 mb-2">
        <span v-if="icon" class="text-lg" :class="iconClass">{{ icon }}</span>
        <p class="text-sm font-medium" :class="labelClass">
          {{ label }}
        </p>
      </div>

      <!-- Value -->
      <p class="text-2xl font-bold" :class="valueClass">
        {{ formattedValue }}
      </p>

      <!-- Subtext (optional) -->
      <p v-if="subtext" class="text-xs mt-1" :class="subtextClass">
        {{ subtext }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type StatVariant = 'default' | 'primary' | 'success' | 'warning' | 'info' | 'rank' | 'rose' | 'indigo' | 'slate' | 'cyan' | 'violet'

interface Props {
  label: string
  value: string | number
  icon?: string
  subtext?: string
  variant?: StatVariant
  prefix?: string
  suffix?: string
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  icon: undefined,
  subtext: undefined,
  prefix: undefined,
  suffix: undefined,
  clickable: false,
})

const emit = defineEmits<{
  click: []
}>()

function handleClick() {
  if (props.clickable) {
    emit('click')
  }
}

const formattedValue = computed(() => {
  let val = String(props.value)
  if (props.prefix) val = props.prefix + val
  if (props.suffix) val = val + props.suffix
  return val
})

// Variant-based styling with gradients and better visuals
const variantStyles = {
  default: {
    bg: 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700',
    label: 'text-gray-600 dark:text-gray-400',
    value: 'text-gray-900 dark:text-white',
    icon: 'text-gray-500 dark:text-gray-400',
    iconBg: 'text-gray-400 dark:text-gray-600',
    subtext: 'text-gray-500 dark:text-gray-500',
  },
  rank: {
    bg: 'bg-gradient-to-br from-amber-100 to-yellow-200 dark:from-amber-900/40 dark:to-yellow-900/30 border border-amber-200 dark:border-amber-800',
    label: 'text-amber-700 dark:text-amber-400',
    value: 'text-amber-900 dark:text-amber-300',
    icon: 'text-amber-600 dark:text-amber-400',
    iconBg: 'text-amber-300 dark:text-amber-700',
    subtext: 'text-amber-600 dark:text-amber-500',
  },
  primary: {
    bg: 'bg-gradient-to-br from-violet-100 to-purple-200 dark:from-violet-900/40 dark:to-purple-900/30 border border-violet-200 dark:border-violet-800',
    label: 'text-violet-700 dark:text-violet-400',
    value: 'text-violet-900 dark:text-violet-300',
    icon: 'text-violet-600 dark:text-violet-400',
    iconBg: 'text-violet-300 dark:text-violet-700',
    subtext: 'text-violet-600 dark:text-violet-500',
  },
  success: {
    bg: 'bg-gradient-to-br from-emerald-100 to-green-200 dark:from-emerald-900/40 dark:to-green-900/30 border border-emerald-200 dark:border-emerald-800',
    label: 'text-emerald-700 dark:text-emerald-400',
    value: 'text-emerald-900 dark:text-emerald-300',
    icon: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'text-emerald-300 dark:text-emerald-700',
    subtext: 'text-emerald-600 dark:text-emerald-500',
  },
  warning: {
    bg: 'bg-gradient-to-br from-orange-100 to-amber-200 dark:from-orange-900/40 dark:to-amber-900/30 border border-orange-200 dark:border-orange-800',
    label: 'text-orange-700 dark:text-orange-400',
    value: 'text-orange-900 dark:text-orange-300',
    icon: 'text-orange-600 dark:text-orange-400',
    iconBg: 'text-orange-300 dark:text-orange-700',
    subtext: 'text-orange-600 dark:text-orange-500',
  },
  info: {
    bg: 'bg-gradient-to-br from-sky-100 to-blue-200 dark:from-sky-900/40 dark:to-blue-900/30 border border-sky-200 dark:border-sky-800',
    label: 'text-sky-700 dark:text-sky-400',
    value: 'text-sky-900 dark:text-sky-300',
    icon: 'text-sky-600 dark:text-sky-400',
    iconBg: 'text-sky-300 dark:text-sky-700',
    subtext: 'text-sky-600 dark:text-sky-500',
  },
  rose: {
    bg: 'bg-gradient-to-br from-rose-100 to-pink-200 dark:from-rose-900/40 dark:to-pink-900/30 border border-rose-200 dark:border-rose-800',
    label: 'text-rose-700 dark:text-rose-400',
    value: 'text-rose-900 dark:text-rose-300',
    icon: 'text-rose-600 dark:text-rose-400',
    iconBg: 'text-rose-300 dark:text-rose-700',
    subtext: 'text-rose-600 dark:text-rose-500',
  },
  indigo: {
    bg: 'bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/40 dark:to-indigo-900/30 border border-indigo-200 dark:border-indigo-800',
    label: 'text-indigo-700 dark:text-indigo-400',
    value: 'text-indigo-900 dark:text-indigo-300',
    icon: 'text-indigo-600 dark:text-indigo-400',
    iconBg: 'text-indigo-300 dark:text-indigo-700',
    subtext: 'text-indigo-600 dark:text-indigo-500',
  },
  slate: {
    bg: 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800/60 dark:to-slate-800/40 border border-slate-200 dark:border-slate-700',
    label: 'text-slate-600 dark:text-slate-400',
    value: 'text-slate-900 dark:text-slate-200',
    icon: 'text-slate-500 dark:text-slate-400',
    iconBg: 'text-slate-300 dark:text-slate-600',
    subtext: 'text-slate-500 dark:text-slate-500',
  },
  cyan: {
    bg: 'bg-gradient-to-br from-cyan-100 to-cyan-200 dark:from-cyan-900/40 dark:to-cyan-900/30 border border-cyan-200 dark:border-cyan-800',
    label: 'text-cyan-700 dark:text-cyan-400',
    value: 'text-cyan-900 dark:text-cyan-300',
    icon: 'text-cyan-600 dark:text-cyan-400',
    iconBg: 'text-cyan-300 dark:text-cyan-700',
    subtext: 'text-cyan-600 dark:text-cyan-500',
  },
  violet: {
    bg: 'bg-gradient-to-br from-violet-100 to-violet-200 dark:from-violet-900/40 dark:to-violet-900/30 border border-violet-200 dark:border-violet-800',
    label: 'text-violet-700 dark:text-violet-400',
    value: 'text-violet-900 dark:text-violet-300',
    icon: 'text-violet-600 dark:text-violet-400',
    iconBg: 'text-violet-300 dark:text-violet-700',
    subtext: 'text-violet-600 dark:text-violet-500',
  },
}

const bgClass = computed(() => variantStyles[props.variant].bg)
const labelClass = computed(() => variantStyles[props.variant].label)
const valueClass = computed(() => variantStyles[props.variant].value)
const iconClass = computed(() => variantStyles[props.variant].icon)
const iconBgClass = computed(() => variantStyles[props.variant].iconBg)
const subtextClass = computed(() => variantStyles[props.variant].subtext)
</script>
