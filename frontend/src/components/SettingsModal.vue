<template>
  <BaseModal :open="open" :title="t('user.settings')" @close="$emit('close')">
    <!-- League Selection -->
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {{ t('settings.selectLeague') }}
      </label>
      <div class="space-y-2">
        <button
          v-for="league in leagues"
          :key="league.id"
          @click="selectLeague(league)"
          class="w-full p-3 text-left rounded-lg border transition-colors"
          :class="[
            currentLeague?.id === league.id
              ? 'border-accent bg-accent/10 text-accent'
              : 'border-gray-200 dark:border-gray-700 hover:border-accent hover:bg-accent/5 text-gray-900 dark:text-white'
          ]"
        >
          <span class="font-medium">{{ league.name }}</span>
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAuth } from '@/composables/useAuth'
import BaseModal from '@/components/ui/BaseModal.vue'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const { t } = useI18n()
const { leagues, currentLeague, setCurrentLeague } = useAuth()

function selectLeague(league: typeof leagues.value[0]) {
  setCurrentLeague(league)
  emit('close')
}
</script>
