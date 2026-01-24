<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isLoading"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      >
        <div class="flex flex-col items-center gap-3">
          <Loader2 class="w-10 h-10 text-accent animate-spin" />
          <span v-if="loadingMessage" class="text-white text-sm">
            {{ loadingMessage }}
          </span>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import { useLoading } from '@/composables/useLoading'

const { isLoading, loadingMessage } = useLoading()
</script>
