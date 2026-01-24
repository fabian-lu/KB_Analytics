/**
 * Public API endpoints (no auth required).
 */

import { api } from './client'
import type { TableResponse } from '@/types'

export async function getTable({ season = '2024' }: { season?: string } = {}) {
  return api<TableResponse>(`/api/table?season=${season}`)
}
