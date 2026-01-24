<template>
  <button
    @click="toggle"
    class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    :title="locale === 'en' ? 'Switch to German' : 'Wechseln zu Englisch'"
  >
    <img
      :src="locale === 'en' ? flagDe : flagEn"
      :alt="locale === 'en' ? 'Switch to German' : 'Switch to English'"
      class="w-5 h-3.5 md:w-7 md:h-5 rounded-sm object-cover"
    />
  </button>
</template>

<script setup lang="ts">
import { useLanguage } from '@/composables/useLanguage'

import flagEn from '@/assets/flags/en.svg'
import flagDe from '@/assets/flags/de.svg'

const { locale, toggle } = useLanguage()
</script>
