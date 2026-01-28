<template>
  <div class="relative">
    <!-- Horizontal scroll container -->
    <div
      ref="scrollContainer"
      class="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:justify-center scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent touch-pan-x"
    >
      <button
        v-for="profile in managers"
        :key="profile.manager.id"
        class="flex-shrink-0 flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-200 min-w-[100px]"
        :class="isSelected(profile.manager.id)
          ? 'bg-cyan-50 dark:bg-cyan-900/30 border-2 border-cyan-500 shadow-md'
          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-cyan-300 dark:hover:border-cyan-700'"
        @click="$emit('select', profile.manager.id)"
      >
        <!-- Avatar with rank badge -->
        <div class="relative">
          <img
            :src="profile.manager.profile_image"
            :alt="profile.manager.name"
            class="w-12 h-12 rounded-full object-cover"
            :class="isSelected(profile.manager.id) ? 'ring-2 ring-cyan-500' : 'ring-1 ring-gray-200 dark:ring-gray-700'"
          />
          <div
            class="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
            :class="rankBadgeClass(profile.rank)"
          >
            {{ profile.rank }}
          </div>
        </div>

        <!-- Name -->
        <span
          class="text-xs font-medium text-center truncate max-w-[90px]"
          :class="isSelected(profile.manager.id)
            ? 'text-cyan-700 dark:text-cyan-300'
            : 'text-gray-700 dark:text-gray-300'"
        >
          {{ profile.manager.name }}
        </span>

        <!-- Total Points -->
        <span class="text-[10px] text-gray-500 dark:text-gray-400">
          {{ profile.total_points.toLocaleString() }} {{ t('managers.points') }}
        </span>
      </button>
    </div>

    <!-- Scroll indicators -->
    <div
      v-if="canScrollLeft"
      class="absolute left-0 top-0 bottom-2 w-8 bg-gradient-to-r from-gray-50 dark:from-gray-900 to-transparent pointer-events-none"
    />
    <div
      v-if="canScrollRight"
      class="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-gray-50 dark:from-gray-900 to-transparent pointer-events-none"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ManagerProfile } from '@/types/league'

const props = defineProps<{
  managers: ManagerProfile[]
  selectedId: string | null
}>()

defineEmits<{
  select: [id: string]
}>()

const { t } = useI18n()

const scrollContainer = ref<HTMLElement | null>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)

function isSelected(id: string): boolean {
  return props.selectedId === id
}

function rankBadgeClass(rank: number): string {
  if (rank === 1) return 'bg-amber-400 text-amber-900'
  if (rank === 2) return 'bg-gray-300 text-gray-700'
  if (rank === 3) return 'bg-orange-400 text-orange-900'
  return 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
}

function updateScrollIndicators() {
  if (!scrollContainer.value) return
  const el = scrollContainer.value
  canScrollLeft.value = el.scrollLeft > 10
  canScrollRight.value = el.scrollLeft < el.scrollWidth - el.clientWidth - 10
}

onMounted(() => {
  updateScrollIndicators()
  scrollContainer.value?.addEventListener('scroll', updateScrollIndicators)
  window.addEventListener('resize', updateScrollIndicators)
})

onUnmounted(() => {
  scrollContainer.value?.removeEventListener('scroll', updateScrollIndicators)
  window.removeEventListener('resize', updateScrollIndicators)
})
</script>
