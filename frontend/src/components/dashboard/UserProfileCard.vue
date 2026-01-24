<template>
  <!-- Mobile: Centered vertical layout -->
  <div class="md:hidden flex flex-col items-center p-6 rounded-xl bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-800">
    <!-- Large centered avatar -->
    <img
      :src="user.profile_image"
      :alt="user.name"
      class="w-28 h-28 rounded-full object-cover border-4 border-accent shadow-lg"
    />

    <!-- Name -->
    <h1 class="mt-4 text-xl font-bold text-gray-900 dark:text-white">
      {{ user.name }}
    </h1>

    <!-- League -->
    <p class="text-sm text-gray-500 dark:text-gray-400">
      {{ user.league_name }}
    </p>

    <!-- Countdown -->
    <div class="mt-3 text-center">
      <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        {{ t('dashboard.nextDeadline') }}
      </p>
      <div class="mt-1 text-lg font-mono font-bold text-accent dark:text-accent-light">
        <span>{{ days }}</span>
        <span class="mx-0.5" :class="colonClass">:</span>
        <span>{{ hours }}</span>
        <span class="mx-0.5" :class="colonClass">:</span>
        <span>{{ minutes }}</span>
        <span class="mx-0.5" :class="colonClass">:</span>
        <span>{{ seconds }}</span>
      </div>
      <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
        Matchday {{ nextDeadline.matchday }} starts
      </p>
    </div>
  </div>

  <!-- Desktop: Horizontal layout -->
  <div class="hidden md:flex items-center gap-6 p-6 rounded-xl bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-800">
    <!-- Larger avatar for desktop -->
    <img
      :src="user.profile_image"
      :alt="user.name"
      class="w-24 h-24 lg:w-28 lg:h-28 rounded-full object-cover border-4 border-accent shadow-lg"
    />

    <!-- User info -->
    <div class="flex-1 min-w-0">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white truncate">
        {{ user.name }}
      </h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
        {{ user.league_name }}
      </p>
    </div>

    <!-- Countdown -->
    <div class="text-right">
      <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        {{ t('dashboard.nextDeadline') }}
      </p>
      <div class="mt-1 text-2xl font-mono font-bold text-accent dark:text-accent-light">
        <span>{{ days }}</span>
        <span class="mx-1" :class="colonClass">:</span>
        <span>{{ hours }}</span>
        <span class="mx-1" :class="colonClass">:</span>
        <span>{{ minutes }}</span>
        <span class="mx-1" :class="colonClass">:</span>
        <span>{{ seconds }}</span>
      </div>
      <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
        Matchday {{ nextDeadline.matchday }} starts
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type { UserProfile, NextDeadline } from '@/types/dashboard'

const props = defineProps<{
  user: UserProfile
  nextDeadline: NextDeadline
}>()

const { t } = useI18n()

const now = ref(Date.now())
const colonVisible = ref(true)
let countdownTimer: number | null = null
let flickerTimer: number | null = null

onMounted(() => {
  // Update countdown every second
  countdownTimer = window.setInterval(() => {
    now.value = Date.now()
  }, 1000)

  // Flicker colons every 500ms
  flickerTimer = window.setInterval(() => {
    colonVisible.value = !colonVisible.value
  }, 500)
})

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer)
  if (flickerTimer) clearInterval(flickerTimer)
})

const colonClass = computed(() =>
  colonVisible.value ? 'opacity-100' : 'opacity-30'
)

const timeRemaining = computed(() => {
  const deadline = new Date(props.nextDeadline.deadline).getTime()
  const diff = Math.max(0, deadline - now.value)

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  }
})

const days = computed(() => String(timeRemaining.value.days).padStart(2, '0'))
const hours = computed(() => String(timeRemaining.value.hours).padStart(2, '0'))
const minutes = computed(() => String(timeRemaining.value.minutes).padStart(2, '0'))
const seconds = computed(() => String(timeRemaining.value.seconds).padStart(2, '0'))
</script>
