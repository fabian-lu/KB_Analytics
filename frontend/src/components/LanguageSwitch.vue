<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger
      class="flex items-center p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      <img
        :src="currentFlag"
        :alt="locale"
        class="w-5 h-5 rounded-sm object-cover"
      />
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        class="min-w-[120px] bg-surface dark:bg-card-dark rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1 z-50"
        :side-offset="5"
      >
        <DropdownMenuItem
          v-for="lang in languages"
          :key="lang.code"
          class="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer outline-none transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          :class="{ 'bg-accent/10 text-accent': locale === lang.code }"
          @click="setLocale(lang.code)"
        >
          <img
            :src="lang.flag"
            :alt="lang.code"
            class="w-5 h-5 rounded-sm object-cover"
          />
          <span class="text-sm">{{ lang.name }}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuItem,
} from 'radix-vue'
import { useLanguage, type Locale } from '@/composables/useLanguage'

import flagEn from '@/assets/flags/en.svg'
import flagDe from '@/assets/flags/de.svg'

const { locale, setLocale } = useLanguage()

const languages = [
  { code: 'en' as Locale, name: 'English', flag: flagEn },
  { code: 'de' as Locale, name: 'Deutsch', flag: flagDe },
]

const currentFlag = computed(() => {
  return locale.value === 'de' ? flagDe : flagEn
})
</script>
