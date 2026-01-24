<template>
  <BaseModal :open="open" size="full" @close="$emit('close')">
    <template #header>
      <PlayerHeader v-if="player" :player="player" />
      <div v-else class="h-20" />
    </template>

    <div v-if="player" class="flex flex-col h-full">
      <!-- Tabs -->
      <div class="flex gap-1 overflow-x-auto pb-2 mb-4 border-b border-gray-200 dark:border-gray-700 -mx-4 sm:-mx-6 px-4 sm:px-6">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap"
          :class="activeTab === tab.id
            ? 'bg-cyan-500 text-white'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'"
        >
          {{ t(tab.labelKey) }}
        </button>
      </div>

      <!-- Tab Content -->
      <div class="flex-1 overflow-y-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
        <OverviewTab v-if="activeTab === 'overview'" :player="player" />
        <StatsTab v-if="activeTab === 'stats'" :player="player" />
        <ValueTab v-if="activeTab === 'value'" :player="player" />
        <CompareTab v-if="activeTab === 'compare'" :player="player" />
        <HistoryTab v-if="activeTab === 'history'" :player="player" />
        <NewsTab v-if="activeTab === 'news'" :player="player" />
      </div>
    </div>

    <!-- Loading state -->
    <div v-else-if="loading" class="flex flex-col items-center justify-center py-20">
      <div class="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      <p class="mt-4 text-gray-500 dark:text-gray-400">{{ t('player.loading') }}</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="flex flex-col items-center justify-center py-20 text-center">
      <div class="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
        <AlertCircle class="w-8 h-8 text-red-500" />
      </div>
      <p class="text-gray-900 dark:text-white font-medium">{{ t('player.errorTitle') }}</p>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ error }}</p>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { AlertCircle } from 'lucide-vue-next'
import BaseModal from '@/components/ui/BaseModal.vue'
import PlayerHeader from './PlayerHeader.vue'
import OverviewTab from './tabs/OverviewTab.vue'
import StatsTab from './tabs/StatsTab.vue'
import ValueTab from './tabs/ValueTab.vue'
import CompareTab from './tabs/CompareTab.vue'
import HistoryTab from './tabs/HistoryTab.vue'
import NewsTab from './tabs/NewsTab.vue'
import { getPlayerDetail } from '@/api/player'
import type { PlayerDetail } from '@/types/player'

const props = defineProps<{
  open: boolean
  playerId: string | null
}>()

defineEmits<{
  close: []
}>()

const { t } = useI18n()

const player = ref<PlayerDetail | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const activeTab = ref('overview')

const tabs = [
  { id: 'overview', labelKey: 'player.tabs.overview' },
  { id: 'stats', labelKey: 'player.tabs.stats' },
  { id: 'value', labelKey: 'player.tabs.value' },
  { id: 'compare', labelKey: 'player.tabs.compare' },
  { id: 'history', labelKey: 'player.tabs.history' },
  { id: 'news', labelKey: 'player.tabs.news' },
]

// Fetch player when modal opens
watch(() => [props.open, props.playerId], async ([isOpen, id]) => {
  if (isOpen && id) {
    loading.value = true
    error.value = null
    player.value = null
    activeTab.value = 'overview'

    try {
      const data = await getPlayerDetail({ playerId: id })
      if (data) {
        player.value = data
      } else {
        error.value = t('player.notFound')
      }
    } catch (e) {
      error.value = t('player.errorLoading')
    } finally {
      loading.value = false
    }
  }
}, { immediate: true })
</script>
