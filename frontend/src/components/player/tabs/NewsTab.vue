<template>
  <div class="space-y-6">
    <!-- Ligainsider Link -->
    <div>
      <a
        :href="player.ligainsider_url"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all"
      >
        <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
          <ExternalLink class="w-6 h-6" />
        </div>
        <div class="flex-1">
          <p class="font-semibold">Ligainsider</p>
          <p class="text-sm text-white/80">{{ t('player.viewFullProfile') }}</p>
        </div>
        <ChevronRight class="w-5 h-5" />
      </a>
    </div>

    <!-- Ligainsider Articles -->
    <div>
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-blue-500" />
        {{ t('player.ligainsiderNews') }}
      </h3>
      <div v-if="ligainsiderArticles.length > 0" class="space-y-3">
        <a
          v-for="article in ligainsiderArticles"
          :key="article.url"
          :href="article.url"
          target="_blank"
          rel="noopener noreferrer"
          class="block rounded-xl p-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <div class="flex justify-between items-start gap-3">
            <div class="flex-1 min-w-0">
              <p class="font-medium text-gray-900 dark:text-white line-clamp-2">
                {{ article.title }}
              </p>
              <p v-if="article.snippet" class="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                {{ article.snippet }}
              </p>
              <p class="text-xs text-gray-400 dark:text-gray-500 mt-2">
                {{ formatDate(article.date) }}
              </p>
            </div>
            <ExternalLink class="w-4 h-4 text-gray-400 flex-shrink-0" />
          </div>
        </a>
      </div>
      <div v-else class="rounded-xl p-4 bg-gray-50 dark:bg-gray-800/50 text-center">
        <p class="text-gray-500 dark:text-gray-400">{{ t('player.noLigainsiderNews') }}</p>
      </div>
    </div>

    <!-- Google News -->
    <div>
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-green-500" />
        {{ t('player.googleNews') }}
      </h3>
      <div v-if="googleArticles.length > 0" class="space-y-3">
        <a
          v-for="article in googleArticles"
          :key="article.url"
          :href="article.url"
          target="_blank"
          rel="noopener noreferrer"
          class="block rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <div class="flex">
            <div v-if="article.image_url" class="w-24 h-24 flex-shrink-0">
              <img
                :src="article.image_url"
                :alt="article.title"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="flex-1 p-3 min-w-0">
              <p class="font-medium text-gray-900 dark:text-white line-clamp-2 text-sm">
                {{ article.title }}
              </p>
              <p v-if="article.snippet" class="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                {{ article.snippet }}
              </p>
              <p class="text-xs text-gray-400 dark:text-gray-500 mt-2">
                {{ formatDate(article.date) }}
              </p>
            </div>
          </div>
        </a>
      </div>
      <div v-else class="rounded-xl p-4 bg-gray-50 dark:bg-gray-800/50 text-center">
        <p class="text-gray-500 dark:text-gray-400">{{ t('player.noGoogleNews') }}</p>
      </div>
    </div>

    <!-- Search Links -->
    <div>
      <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        {{ t('player.moreLinks') }}
      </h3>
      <div class="grid grid-cols-2 gap-2">
        <a
          :href="`https://www.google.com/search?q=${encodeURIComponent(player.name + ' ' + player.team.name)}`"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Search class="w-4 h-4 text-gray-500" />
          <span class="text-sm text-gray-700 dark:text-gray-300">Google</span>
        </a>
        <a
          :href="`https://www.transfermarkt.de/schnellsuche/ergebnis/schnellsuche?query=${encodeURIComponent(player.name)}`"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ExternalLink class="w-4 h-4 text-gray-500" />
          <span class="text-sm text-gray-700 dark:text-gray-300">Transfermarkt</span>
        </a>
        <a
          :href="`https://www.kicker.de/suche?q=${encodeURIComponent(player.name)}`"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ExternalLink class="w-4 h-4 text-gray-500" />
          <span class="text-sm text-gray-700 dark:text-gray-300">Kicker</span>
        </a>
        <a
          :href="`https://www.youtube.com/results?search_query=${encodeURIComponent(player.name + ' highlights')}`"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Play class="w-4 h-4 text-gray-500" />
          <span class="text-sm text-gray-700 dark:text-gray-300">YouTube</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ExternalLink, ChevronRight, Search, Play } from 'lucide-vue-next'
import type { PlayerDetail } from '@/types/player'

const props = defineProps<{
  player: PlayerDetail
}>()

const { t } = useI18n()

const ligainsiderArticles = computed(() =>
  props.player.news.filter(n => n.source === 'ligainsider')
)

const googleArticles = computed(() =>
  props.player.news.filter(n => n.source === 'google')
)

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return t('player.today')
  if (diffDays === 1) return t('player.yesterday')
  if (diffDays < 7) return t('player.daysAgo', { days: diffDays })

  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
