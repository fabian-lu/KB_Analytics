<template>
  <nav class="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark">
    <div class="h-16 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 grid items-center" style="grid-template-columns: 1fr auto 1fr;">
      <!-- Left: Logo -->
      <RouterLink to="/dashboard" class="justify-self-start">
        <img
          :src="isDark ? logoFullDark : logoFullLight"
          alt="Kickbase Analytics"
          class="h-16"
        />
      </RouterLink>

      <!-- Center: Navigation -->
      <div class="flex items-center space-x-1">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="[
            isActive(item.path)
              ? 'text-accent bg-accent/10'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
          ]"
        >
          {{ t(`nav.${item.key}`) }}
        </RouterLink>
      </div>

      <!-- Right: Controls -->
      <div class="flex items-center justify-self-end space-x-2">
        <LeagueSwitcher />
        <LanguageToggle />
        <DarkModeToggle />
        <UserMenu />
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useDarkMode } from '@/composables/useDarkMode'
import LeagueSwitcher from '@/components/LeagueSwitcher.vue'
import LanguageToggle from '@/components/LanguageToggle.vue'
import DarkModeToggle from '@/components/DarkModeToggle.vue'
import UserMenu from '@/components/layout/UserMenu.vue'

import logoFullLight from '@/assets/logo-full-light.svg'
import logoFullDark from '@/assets/logo-full-dark.svg'

const route = useRoute()
const { t } = useI18n()
const { isDark } = useDarkMode()

const navItems = [
  { key: 'dashboard', path: '/dashboard' },
  { key: 'market', path: '/market' },
  { key: 'league', path: '/league' },
  { key: 'insights', path: '/insights' },
]

function isActive(path: string): boolean {
  // For nested routes (e.g., /market/overview), check if current path starts with nav path
  if (path === '/dashboard') {
    return route.path === '/dashboard'
  }
  return route.path.startsWith(path)
}
</script>
