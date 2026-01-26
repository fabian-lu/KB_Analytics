/**
 * Types for Market > Players page.
 * Lightweight player type for list/card views (not the full PlayerDetail).
 * Covers ALL features from feature_ideas.md Players subpage.
 */

import type { PlayerStatus, FormTrend } from './player'

// ============================================
// Market Player (list item)
// ============================================

export interface MarketPlayer {
  id: string
  name: string
  position: number              // 1=GK, 2=DEF, 3=MID, 4=FWD
  age: number
  team_id: string
  team_name: string
  team_short_name: string
  team_logo: string
  profile_image: string
  status: PlayerStatus
  status_note: string | null    // e.g. "Knee injury"
  expected_return: string | null // ISO date or descriptive, e.g. "2025-02-10"

  // Value & trends
  market_value: number
  value_change_1d: number
  value_change_7d: number
  value_change_30d: number
  value_change_1d_pct: number
  value_change_7d_pct: number
  value_change_30d_pct: number
  friday_projection: number     // projected value by next matchday

  // Points
  total_points: number
  avg_points: number
  appearances: number           // games played
  goals: number
  assists: number

  // Derived metrics
  ppm: number                   // points per million
  form: number                  // last 5 game average
  season_avg: number            // full season average
  form_trend: FormTrend
  raw_points_avg: number        // raw points (without bonuses)
  stability: number             // std deviation (lower = more consistent)
  points_per_minute: number     // normalized pts/min

  // Home / Away splits
  home_avg: number
  away_avg: number

  // Flags & badges
  is_set_piece_taker: boolean
  is_new_signing: boolean       // fresh Bundesliga transfer
  is_comeback: boolean          // returning from injury
  rotation_risk: boolean        // likely to be rotated
}

// ============================================
// Search selection (for autocomplete chips)
// ============================================

export interface SearchSelection {
  type: 'player' | 'team'
  id: string
  label: string
}

// ============================================
// Filter & Sort
// ============================================

export type MarketPresetFilter =
  | 'all'
  | 'hot'         // rising value
  | 'falling'     // falling value
  | 'top_ppm'     // best PPM
  | 'top_points'  // highest total points

export type MarketSortOption =
  | 'market_value'
  | 'total_points'
  | 'avg_points'
  | 'ppm'
  | 'value_change_7d'
  | 'form'
  | 'stability'
  | 'points_per_minute'
  | 'raw_points_avg'

export type MarketViewMode = 'list' | 'card'
