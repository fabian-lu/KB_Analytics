<template>
  <!-- Global loading overlay -->
  <LoadingOverlay />

  <!-- Logged in: Show with layout (nav, etc.) -->
  <AppLayout v-if="isLoggedIn">
    <RouterView />
  </AppLayout>

  <!-- Not logged in: Show page directly (public page handles its own layout) -->
  <RouterView v-else />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import AppLayout from '@/components/layout/AppLayout.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'

const { isLoggedIn } = useAuth()
</script>
