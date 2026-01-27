<template>
  <!-- Desktop: Tooltip on hover -->
  <div class="hidden lg:block">
    <TooltipProvider :delay-duration="0">
      <TooltipRoot>
        <TooltipTrigger as-child>
          <div class="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center cursor-help transition-all duration-150 hover:bg-accent/10 hover:dark:bg-accent/20 hover:border-accent">
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ label }}</p>
            <p class="text-base font-bold" :class="valueClass || 'text-gray-900 dark:text-white'">
              <slot />
            </p>
          </div>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent class="tooltip-content" :side-offset="5">
            {{ tooltip }}
            <TooltipArrow class="tooltip-arrow" />
          </TooltipContent>
        </TooltipPortal>
      </TooltipRoot>
    </TooltipProvider>
  </div>

  <!-- Mobile: Popover on tap -->
  <div class="lg:hidden">
    <PopoverRoot v-model:open="isOpen">
      <PopoverTrigger as-child>
        <div
          class="px-3 py-1.5 rounded-lg border text-center cursor-help transition-all duration-150"
          :class="isOpen
            ? 'bg-accent/10 dark:bg-accent/20 border-accent'
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'"
        >
          <p class="text-[10px] text-gray-500 dark:text-gray-400">{{ label }}</p>
          <p class="text-sm font-bold" :class="valueClass || 'text-gray-900 dark:text-white'">
            <slot />
          </p>
        </div>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent class="popover-content" :side-offset="5">
          {{ tooltip }}
          <PopoverArrow class="popover-arrow" />
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  PopoverArrow,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from 'radix-vue'

defineProps<{
  label: string
  tooltip: string
  valueClass?: string
}>()

const isOpen = ref(false)
</script>

<style>
/* Tooltip styles (desktop) */
.tooltip-content {
  padding: 8px 12px;
  background: #1f2937;
  color: #f3f4f6;
  font-size: 12px;
  line-height: 1.4;
  border-radius: 6px;
  max-width: 280px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 50;
  animation: tooltipFadeIn 0.1s ease;
}

.tooltip-arrow {
  fill: #1f2937;
}

/* Popover styles (mobile) */
.popover-content {
  padding: 8px 12px;
  background: #1f2937;
  color: #f3f4f6;
  font-size: 12px;
  line-height: 1.4;
  border-radius: 6px;
  max-width: 250px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 50;
  animation: tooltipFadeIn 0.1s ease;
}

.popover-content:focus {
  outline: none;
}

.popover-arrow {
  fill: #1f2937;
}

@keyframes tooltipFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
