<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger
      class="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      <span class="text-sm font-medium truncate max-w-[150px]">
        {{ currentLeague?.name || 'Select League' }}
      </span>
      <ChevronDown class="w-4 h-4 text-gray-500" />
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        class="min-w-[200px] bg-surface dark:bg-card-dark rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1 z-50"
        :side-offset="5"
        align="end"
      >
        <DropdownMenuItem
          v-for="league in leagues"
          :key="league.id"
          class="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer outline-none transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          :class="{ 'bg-accent/10 text-accent': currentLeague?.id === league.id }"
          @click="switchLeague(league)"
        >
          <span class="text-sm">{{ league.name }}</span>
          <Check v-if="currentLeague?.id === league.id" class="w-4 h-4 ml-auto" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

<script setup lang="ts">
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuItem,
} from 'radix-vue'
import { ChevronDown, Check } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import type { League } from '@/types'

const router = useRouter()
const { leagues, currentLeague, setCurrentLeague } = useAuth()

function switchLeague(league: League) {
  if (league.id === currentLeague.value?.id) return

  setCurrentLeague(league)

  // Reload current page to fetch new data
  // Using router.go(0) refreshes the page
  router.go(0)
}
</script>
