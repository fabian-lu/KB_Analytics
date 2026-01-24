<template>
  <header class="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark">
    <div class="flex items-center justify-between h-14 px-2">
      <!-- Left: Logo -->
      <RouterLink to="/dashboard">
        <img
          :src="isDark ? logoFullDark : logoFullLight"
          alt="Kickbase Analytics"
          class="h-14"
        />
      </RouterLink>

      <!-- Right: Controls -->
      <div class="flex items-center space-x-2">
        <LanguageToggle />
        <DarkModeToggle />
        <UserMenu />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useDarkMode } from '@/composables/useDarkMode'
import LanguageToggle from '@/components/LanguageToggle.vue'
import DarkModeToggle from '@/components/DarkModeToggle.vue'
import UserMenu from '@/components/layout/UserMenu.vue'

import logoFullLight from '@/assets/logo-full-light.svg'
import logoFullDark from '@/assets/logo-full-dark.svg'

const { isDark } = useDarkMode()
</script>
