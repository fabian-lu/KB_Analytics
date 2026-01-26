<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 space-y-4 md:space-y-6">
    <!-- Main scatter chart -->
    <AnalysisChart
      :players="players"
      @player-click="openPlayer"
    />

    <!-- Similar Players finder - first after chart -->
    <SimilarPlayersFinder
      :all-players="players"
      @player-click="openPlayer"
    />

    <!-- Two-column grid for form sections -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      <FormTrendSection
        :all-players="players"
        variant="hot"
        :limit="5"
        @player-click="openPlayer"
      />
      <FormTrendSection
        :all-players="players"
        variant="cold"
        :limit="5"
        @player-click="openPlayer"
      />
    </div>

    <!-- Two-column grid for momentum sections -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      <ValueMomentumSection
        :all-players="players"
        variant="accelerating"
        :limit="5"
        @player-click="openPlayer"
      />
      <ValueMomentumSection
        :all-players="players"
        variant="decelerating"
        :limit="5"
        @player-click="openPlayer"
      />
    </div>

    <!-- Breakout candidates -->
    <BreakoutCandidates
      :all-players="players"
      :max-age="24"
      :max-value="25000000"
      :limit="5"
      @player-click="openPlayer"
    />

    <!-- Player modal -->
    <PlayerModal
      v-if="selectedPlayerId"
      :player-id="selectedPlayerId"
      :open="!!selectedPlayerId"
      @close="selectedPlayerId = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import AnalysisChart from '@/components/market/AnalysisChart.vue'
import FormTrendSection from '@/components/market/FormTrendSection.vue'
import ValueMomentumSection from '@/components/market/ValueMomentumSection.vue'
import SimilarPlayersFinder from '@/components/market/SimilarPlayersFinder.vue'
import BreakoutCandidates from '@/components/market/BreakoutCandidates.vue'
import PlayerModal from '@/components/player/PlayerModal.vue'
import { mockMarketPlayers } from '@/mocks/marketMock'
import type { MarketPlayer } from '@/types/market'

// Use mock data for now
const players = mockMarketPlayers

// Selected player for modal
const selectedPlayerId = ref<string | null>(null)

// Navigation guard: close modal on back button instead of leaving
onBeforeRouteLeave((_to, _from, next) => {
  if (selectedPlayerId.value) {
    selectedPlayerId.value = null
    next(false)
  } else {
    next()
  }
})

function openPlayer(player: MarketPlayer) {
  selectedPlayerId.value = player.id
}
</script>
