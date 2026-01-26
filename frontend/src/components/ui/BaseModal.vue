<template>
  <Teleport to="body">
    <Transition :name="transitionName">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center"
      >
        <!-- Backdrop - blocks scroll/touch on the background -->
        <div
          class="absolute inset-0 bg-black/50"
          :class="{ 'md:block hidden': size === 'full' }"
          @click="handleClose"
          @touchstart.prevent
          @touchmove.prevent
          @touchend.prevent
          @wheel.prevent
        />

        <!-- Modal container -->
        <div
          class="relative bg-white dark:bg-gray-900 w-full shadow-xl border-gray-200 dark:border-gray-700"
          :class="modalClasses"
        >
          <!-- Header -->
          <div
            v-if="title || $slots.header"
            class="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-700"
          >
            <slot name="header">
              <h2 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white pr-8">
                {{ title }}
              </h2>
            </slot>
          </div>

          <!-- Content -->
          <div :class="contentClasses">
            <slot />
          </div>

          <!-- Footer (optional) -->
          <div
            v-if="$slots.footer"
            class="px-4 sm:px-6 pb-4 sm:pb-6 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <slot name="footer" />
          </div>

          <!-- Close button -->
          <button
            @click="handleClose"
            class="absolute top-3 sm:top-4 right-3 sm:right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10"
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

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

const props = withDefaults(defineProps<{
  open: boolean
  title?: string
  size?: ModalSize
}>(), {
  title: undefined,
  size: 'md',
})

const emit = defineEmits<{
  close: []
}>()

// Modal container classes based on size
const modalClasses = computed(() => {
  if (props.size === 'full') {
    return [
      'h-full md:h-auto md:max-h-[90vh]',
      'md:max-w-4xl md:mx-4',
      'md:rounded-xl md:border',
      'flex flex-col',
    ]
  }

  const sizes: Record<Exclude<ModalSize, 'full'>, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }
  return ['rounded-xl border mx-4', sizes[props.size]]
})

// Content area classes
const contentClasses = computed(() => {
  if (props.size === 'full') {
    return 'p-4 sm:p-6 flex-1 overflow-y-auto overscroll-contain'
  }
  return 'p-4 sm:p-6'
})

// Different transition for full size on mobile (slide up vs scale)
const transitionName = computed(() => {
  return props.size === 'full' ? 'modal-full' : 'modal'
})

// Handle close from button/backdrop click
function handleClose() {
  emit('close')
}

// Save original body styles
let originalBodyOverflow = ''
let originalBodyPosition = ''
let originalBodyTop = ''
let originalBodyWidth = ''
let scrollY = 0

// Disable body scroll when modal is open
watch(() => props.open, (isOpen) => {
  if (isOpen) {
    // Save scroll position and lock body
    scrollY = window.scrollY
    originalBodyOverflow = document.body.style.overflow
    originalBodyPosition = document.body.style.position
    originalBodyTop = document.body.style.top
    originalBodyWidth = document.body.style.width

    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
  } else {
    // Restore body scroll
    document.body.style.overflow = originalBodyOverflow
    document.body.style.position = originalBodyPosition
    document.body.style.top = originalBodyTop
    document.body.style.width = originalBodyWidth
    window.scrollTo(0, scrollY)
  }
})

// Cleanup on unmount
onUnmounted(() => {
  document.body.style.overflow = originalBodyOverflow
  document.body.style.position = originalBodyPosition
  document.body.style.top = originalBodyTop
  document.body.style.width = originalBodyWidth
  window.scrollTo(0, scrollY)
})
</script>

<style scoped>
/* Standard modal transition (scale) */
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

/* Full modal transition (slide up on mobile, scale on desktop) */
.modal-full-enter-active,
.modal-full-leave-active {
  transition: opacity 0.3s ease;
}

.modal-full-enter-from,
.modal-full-leave-to {
  opacity: 0;
}

.modal-full-enter-active > div:last-child,
.modal-full-leave-active > div:last-child {
  transition: transform 0.3s ease;
}

.modal-full-enter-from > div:last-child,
.modal-full-leave-to > div:last-child {
  transform: translateY(100%);
}

/* On desktop, use scale instead of slide */
@media (min-width: 768px) {
  .modal-full-enter-from > div:last-child,
  .modal-full-leave-to > div:last-child {
    transform: scale(0.95);
  }
}
</style>
