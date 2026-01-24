/**
 * Dashboard API endpoints (requires auth).
 */

import { api } from './client'
import type { DashboardResponse } from '@/types'

export async function getDashboard({ leagueId, token }: { leagueId: string; token: string }) {
  return api<DashboardResponse>(`/api/leagues/${leagueId}/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}
