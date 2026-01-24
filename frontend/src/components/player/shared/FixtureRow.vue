<template>
  <div class="flex items-center gap-3 py-2">
    <!-- Home/Away indicator -->
    <span
      class="w-6 text-center text-xs font-medium"
      :class="fixture.is_home ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'"
    >
      {{ fixture.is_home ? 'H' : 'A' }}
    </span>

    <!-- Opponent -->
    <div class="flex items-center gap-2 flex-1 min-w-0">
      <img
        :src="fixture.opponent.logo"
        :alt="fixture.opponent.name"
        class="w-5 h-5 flex-shrink-0"
      />
      <span class="text-sm text-gray-900 dark:text-white truncate">
        {{ fixture.opponent.short_name }}
      </span>
    </div>

    <!-- Difficulty -->
    <div class="flex gap-0.5">
      <span
        v-for="i in 5"
        :key="i"
        class="w-2 h-2 rounded-full"
        :class="i <= fixture.difficulty ? difficultyColor : 'bg-gray-200 dark:bg-gray-700'"
      />
    </div>

    <!-- Date -->
    <span class="text-xs text-gray-500 dark:text-gray-400 w-16 text-right">
      {{ formattedDate }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { UpcomingFixture } from '@/types/player'

const props = defineProps<{
  fixture: UpcomingFixture
}>()

const difficultyColor = computed(() => {
  if (props.fixture.difficulty >= 4) return 'bg-red-500'
  if (props.fixture.difficulty >= 3) return 'bg-orange-500'
  return 'bg-green-500'
})

const formattedDate = computed(() => {
  const date = new Date(props.fixture.datetime)
  const day = date.toLocaleDateString('de-DE', { weekday: 'short' })
  const dayNum = date.getDate()
  const month = date.toLocaleDateString('de-DE', { month: 'short' })
  return `${day} ${dayNum} ${month}`
})
</script>
