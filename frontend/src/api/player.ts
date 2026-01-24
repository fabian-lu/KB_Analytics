/**
 * Player API functions.
 * Currently uses mock data, will be replaced with real API calls later.
 */

import type { PlayerDetail } from '@/types/player'
import { getMockPlayerDetail } from '@/mocks/playerMock'

/**
 * Get detailed player information by ID.
 * Currently returns mock data - will be replaced with real API call.
 */
export async function getPlayerDetail({
  playerId,
}: {
  playerId: string
  token?: string
}): Promise<PlayerDetail | null> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300))

  // Return mock data for now
  return getMockPlayerDetail(playerId)
}
