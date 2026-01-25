<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 overflow-visible">
    <!-- Partial background - covers bottom part only, below the curve -->
    <div class="absolute inset-x-0 bottom-0 h-10 bg-gray-50 dark:bg-gray-900"></div>

    <!-- Curved background SVG -->
    <svg
      class="absolute inset-x-0 top-0 h-14 w-full"
      viewBox="0 0 400 56"
      preserveAspectRatio="none"
    >
      <path
        :d="navPath"
        class="fill-gray-50 dark:fill-gray-900 stroke-gray-200 dark:stroke-gray-800"
        stroke-width="1"
      />
    </svg>

    <!-- Nav items -->
    <div class="relative grid grid-cols-4 h-14 w-full">
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="relative flex flex-col items-center justify-center transition-all"
        :class="[
          isActive(item.path)
            ? 'text-accent'
            : 'text-gray-500 dark:text-gray-400'
        ]"
      >
        <!-- Icon with floating pill when active -->
        <div
          class="flex items-center justify-center w-10 h-10 rounded-full transition-all"
          :class="[
            isActive(item.path)
              ? 'bg-accent/20 dark:bg-accent/30 -translate-y-4 shadow-md'
              : 'bg-transparent translate-y-0'
          ]"
        >
          <component :is="item.icon" class="w-5 h-5" />
        </div>
        <span
          class="text-[10px] -mt-1 transition-all"
          :class="[
            isActive(item.path) ? '-translate-y-3' : 'translate-y-0'
          ]"
        >
          {{ t(`nav.${item.key}`) }}
        </span>
      </RouterLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { LayoutDashboard, Store, Trophy, Sparkles } from 'lucide-vue-next'

const route = useRoute()
const { t } = useI18n()

const navItems = [
  { key: 'dashboard', path: '/dashboard', icon: LayoutDashboard },
  { key: 'market', path: '/market', icon: Store },
  { key: 'league', path: '/league', icon: Trophy },
  { key: 'insights', path: '/insights', icon: Sparkles },
]

function isActive(path: string): boolean {
  return route.path === path
}

const activeIndex = computed(() => {
  return navItems.findIndex(item => isActive(item.path))
})

const navPath = computed(() => {
  const idx = activeIndex.value

  if (idx === -1) {
    // No active item - flat bar
    return `M0,0 L400,0 L400,56 L0,56 Z`
  }

  // Calculate center position for the notch (each item is 100 units wide in 400-unit viewBox)
  const centerX = (idx * 100) + 50
  const notchRadius = 26

  // Semi-circle dipping DOWN into the navbar (like a U-shaped cradle)
  return `
    M0,0
    L${centerX - notchRadius - 10},0
    C${centerX - notchRadius - 10},0 ${centerX - notchRadius},0 ${centerX - notchRadius},10
    C${centerX - notchRadius},${notchRadius + 10} ${centerX + notchRadius},${notchRadius + 10} ${centerX + notchRadius},10
    C${centerX + notchRadius},0 ${centerX + notchRadius + 10},0 ${centerX + notchRadius + 10},0
    L400,0
    L400,56
    L0,56
    Z
  `
})
</script>
