<template>
  <header class="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-surface dark:bg-surface-dark">
    <div class="flex items-center justify-between h-16 px-6">
      <!-- Left: Logo -->
      <div class="flex-shrink-0">
        <RouterLink to="/">
          <img
            :src="isDark ? logoFullDark : logoFullLight"
            alt="Kickbase Analytics"
            class="h-12"
          />
        </RouterLink>
      </div>

      <!-- Right: Controls + Login button -->
      <div class="flex items-center space-x-2">
        <LanguageToggle />
        <DarkModeToggle />
        <button
          @click="$emit('login-click')"
          class="px-4 py-2 rounded-lg bg-accent text-white font-medium hover:bg-accent-dark transition-colors"
        >
          Login
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useDarkMode } from '@/composables/useDarkMode'
import LanguageToggle from '@/components/LanguageToggle.vue'
import DarkModeToggle from '@/components/DarkModeToggle.vue'

import logoFullLight from '@/assets/logo-full-light.svg'
import logoFullDark from '@/assets/logo-full-dark.svg'

const { isDark } = useDarkMode()

defineEmits<{
  'login-click': []
}>()
</script>
