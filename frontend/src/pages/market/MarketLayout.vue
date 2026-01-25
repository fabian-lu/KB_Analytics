<template>
  <div class="flex flex-col h-full">
    <!-- Secondary Navigation -->
    <div class="sticky top-16 z-40 bg-surface dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          ref="navRef"
          class="flex gap-1 py-1.5 md:py-3 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0"
          role="tablist"
        >
          <RouterLink
            v-for="tab in tabs"
            :key="tab.path"
            :to="tab.path"
            :ref="el => setTabRef(tab.path, el)"
            class="flex-shrink-0 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-full transition-all"
            :class="[
              isActive(tab.path)
                ? 'bg-cyan-500 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
            ]"
          >
            <component :is="tab.icon" class="w-3.5 h-3.5 md:w-4 md:h-4 inline-block mr-1 md:mr-1.5 -mt-0.5" />
            {{ t(`market.tabs.${tab.key}`) }}
          </RouterLink>
        </nav>
      </div>
    </div>

    <!-- Subpage Content with Swipe -->
    <div
      ref="swipeContainer"
      class="min-h-[50vh] relative overflow-hidden"
    >
      <RouterView v-slot="{ Component }">
        <Transition :name="slideDirection">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSwipe } from '@vueuse/core'
import {
  LayoutGrid,
  Users,
  ArrowLeftRight,
  UserPlus,
  Star,
  TrendingUp
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const swipeContainer = ref<HTMLElement | null>(null)
const navRef = ref<HTMLElement | null>(null)
const tabRefs = ref<Record<string, HTMLElement | null>>({})
const slideDirection = ref<'slide-left' | 'slide-right'>('slide-left')

const tabs = [
  { key: 'overview', path: '/market/overview', icon: LayoutGrid },
  { key: 'players', path: '/market/players', icon: Users },
  { key: 'transfers', path: '/market/transfers', icon: ArrowLeftRight },
  { key: 'freeAgents', path: '/market/free-agents', icon: UserPlus },
  { key: 'watchlist', path: '/market/watchlist', icon: Star },
  { key: 'trends', path: '/market/trends', icon: TrendingUp },
]

function setTabRef(path: string, el: any) {
  if (el?.$el) {
    tabRefs.value[path] = el.$el
  }
}

function isActive(path: string): boolean {
  return route.path === path
}

const currentIndex = computed(() => {
  return tabs.findIndex(tab => tab.path === route.path)
})

function navigateToTab(index: number) {
  if (index >= 0 && index < tabs.length) {
    const targetPath = tabs[index].path
    // Set slide direction based on navigation direction
    slideDirection.value = index > currentIndex.value ? 'slide-left' : 'slide-right'
    router.push(targetPath)
  }
}

// Scroll active tab into view
function scrollActiveTabIntoView() {
  const activeTab = tabRefs.value[route.path]
  if (activeTab && navRef.value) {
    const navRect = navRef.value.getBoundingClientRect()
    const tabRect = activeTab.getBoundingClientRect()

    // Check if tab is outside visible area
    if (tabRect.left < navRect.left || tabRect.right > navRect.right) {
      activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }
}

// Watch route changes to scroll tab into view
watch(() => route.path, () => {
  nextTick(scrollActiveTabIntoView)
})

// Swipe detection
const { direction } = useSwipe(swipeContainer, {
  threshold: 50,
  onSwipeEnd() {
    if (direction.value === 'left') {
      // Swipe left = go to next tab
      navigateToTab(currentIndex.value + 1)
    } else if (direction.value === 'right') {
      // Swipe right = go to previous tab
      navigateToTab(currentIndex.value - 1)
    }
  },
})
</script>

<style scoped>
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-none::-webkit-scrollbar {
  display: none;
}

/* Slide left (next tab) */
.slide-left-enter-active {
  transition: all 0.25s ease-out;
}
.slide-left-leave-active {
  transition: all 0.25s ease-out;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Slide right (previous tab) */
.slide-right-enter-active {
  transition: all 0.25s ease-out;
}
.slide-right-leave-active {
  transition: all 0.25s ease-out;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}
.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
