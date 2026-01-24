<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger
      class="flex items-center p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      <User class="w-5 h-5" />
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        class="min-w-[160px] bg-surface dark:bg-card-dark rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1 z-50"
        :side-offset="5"
        align="end"
      >
        <!-- User info -->
        <div class="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
          <p class="text-sm font-medium text-gray-900 dark:text-white">
            {{ userName }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ currentLeagueName }}
          </p>
        </div>

        <!-- Menu items -->
        <DropdownMenuItem
          class="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer outline-none transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
        >
          <UserCircle class="w-4 h-4" />
          <span class="text-sm">{{ t('user.profile') }}</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          class="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer outline-none transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
          @click="showSettings = true"
        >
          <Settings class="w-4 h-4" />
          <span class="text-sm">{{ t('user.settings') }}</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator class="h-px my-1 bg-gray-200 dark:bg-gray-700" />

        <DropdownMenuItem
          class="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer outline-none transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
          @click="logout"
        >
          <LogOut class="w-4 h-4" />
          <span class="text-sm">{{ t('user.logout') }}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>

  <!-- Settings Modal -->
  <SettingsModal :open="showSettings" @close="showSettings = false" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from 'radix-vue'
import { User, UserCircle, Settings, LogOut } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useAuth } from '@/composables/useAuth'
import SettingsModal from '@/components/SettingsModal.vue'

const { t } = useI18n()
const { user, currentLeague, logout } = useAuth()

const showSettings = ref(false)

const userName = computed(() => user.value?.name || 'Manager')
const currentLeagueName = computed(() => currentLeague.value?.name || '')
</script>
