<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50"
          @click="$emit('close')"
        />

        <!-- Modal -->
        <div
          class="relative bg-white dark:bg-gray-900 rounded-xl w-full shadow-xl border border-gray-200 dark:border-gray-700 mx-4"
          :class="sizeClass"
        >
          <!-- Header -->
          <div
            v-if="title || $slots.header"
            class="px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700"
          >
            <slot name="header">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white pr-8">
                {{ title }}
              </h2>
            </slot>
          </div>

          <!-- Content -->
          <div class="p-6">
            <slot />
          </div>

          <!-- Footer (optional) -->
          <div
            v-if="$slots.footer"
            class="px-6 pb-6 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <slot name="footer" />
          </div>

          <!-- Close button -->
          <button
            @click="$emit('close')"
            class="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch, onUnmounted } from 'vue'
import { X } from 'lucide-vue-next'

type ModalSize = 'sm' | 'md' | 'lg' | 'xl'

const props = withDefaults(defineProps<{
  open: boolean
  title?: string
  size?: ModalSize
}>(), {
  title: undefined,
  size: 'md',
})

defineEmits<{
  close: []
}>()

const sizeClass = computed(() => {
  const sizes: Record<ModalSize, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }
  return sizes[props.size]
})

// Disable body scroll when modal is open
watch(() => props.open, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

// Cleanup on unmount
onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div:last-child,
.modal-leave-active > div:last-child {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from > div:last-child,
.modal-leave-to > div:last-child {
  transform: scale(0.95);
  opacity: 0;
}
</style>
