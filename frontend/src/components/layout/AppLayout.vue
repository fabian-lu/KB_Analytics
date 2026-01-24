<template>
  <div class="min-h-screen bg-surface dark:bg-surface-dark">
    <!-- Desktop: Top navigation -->
    <TopNav class="hidden md:block" />

    <!-- Mobile: Header bar -->
    <MobileHeader class="block md:hidden" />

    <!-- Page content -->
    <main class="pb-20 md:pb-0">
      <slot />
    </main>

    <!-- Mobile: Bottom navigation -->
    <BottomNav class="flex md:hidden" />
  </div>
</template>

<script setup lang="ts">
import TopNav from './TopNav.vue'
import MobileHeader from './MobileHeader.vue'
import BottomNav from './BottomNav.vue'
</script>
