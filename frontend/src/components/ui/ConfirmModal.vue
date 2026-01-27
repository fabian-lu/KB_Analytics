<template>
  <BaseModal :open="open" :title="title" size="sm" @close="$emit('close')">
    <p class="text-sm text-gray-600 dark:text-gray-400">{{ message }}</p>

    <template #footer>
      <div class="flex items-center justify-end gap-3">
        <button
          class="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          @click="$emit('close')"
        >
          {{ t('confirm.cancel') }}
        </button>
        <button
          class="px-4 py-2 text-sm font-medium rounded-lg text-white transition-colors"
          :class="confirmClass"
          @click="$emit('confirm')"
        >
          {{ confirmLabel || t('confirm.confirm') }}
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import BaseModal from '@/components/ui/BaseModal.vue'

const { t } = useI18n()

withDefaults(defineProps<{
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  confirmClass?: string
}>(), {
  confirmLabel: undefined,
  confirmClass: 'bg-red-500 hover:bg-red-600',
})

defineEmits<{
  close: []
  confirm: []
}>()
</script>
