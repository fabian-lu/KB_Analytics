/**
 * Types for League > Managers page.
 * Reuses Manager, PlayerSummary, DashboardLineup from dashboard.ts
 */

import type { Manager, PlayerSummary, DashboardLineup } from './dashboard'

// ============================================
// Kickbase Achievements
// ============================================

export interface KickbaseAchievement {
  id: string
  name: string
  description: string
  icon: string // emoji
  earned_at: string // ISO date
  level: 1 | 2 | 3 // bronze, silver, gold
}

// ============================================
// Manager Matchday History
// ============================================

export interface ManagerMatchdayResult {
  matchday: number
  points: number
  rank: number
}

// ============================================
// Manager Stats
// ============================================

export interface ManagerStats {
  avg_points_per_matchday: number
  best_matchday: { matchday: number; points: number }
  worst_matchday: { matchday: number; points: number }
  consistency: number // std deviation
  matchday_wins: number
  total_matchdays_played: number
  top3_finishes: number
}

// ============================================
// Player Value Changes
// ============================================

export interface PlayerValueChange {
  player: PlayerSummary
  change_1d: number
  change_7d: number
  change_30d: number
  change_1d_pct: number
  change_7d_pct: number
  change_30d_pct: number
}

// ============================================
// Investment Capacity
// ============================================

export interface InvestmentCapacity {
  budget: number
  sellable_value: number
  total_spending_power: number
  max_single_buy: number
}

// ============================================
// Bench Strength
// ============================================

export interface BenchStrength {
  bench_total_points: number
  bench_avg_points: number
  bench_total_value: number
  bench_player_count: number
  starting_total_points: number
  starting_avg_points: number
  bench_vs_starting_ratio: number // bench_avg / starting_avg
}

// ============================================
// Manager Activity
// ============================================

export type EngagementLevel = 'very_active' | 'active' | 'moderate' | 'passive' | 'inactive'

export interface ManagerActivity {
  total_transfers: number
  buys: number
  sells: number
  transfers_per_week: number
  last_transfer_date: string // ISO date
  days_since_last_transfer: number
  engagement_level: EngagementLevel
}

// ============================================
// Full Manager Profile
// ============================================

export interface ManagerProfile {
  manager: Manager
  rank: number
  team_value: number
  budget: number
  total_points: number
  transfer_profit: number
  lineup: DashboardLineup
  investment: InvestmentCapacity
  value_changes: PlayerValueChange[]
  stats: ManagerStats
  matchday_history: ManagerMatchdayResult[]
  achievements: KickbaseAchievement[]
  bench_strength: BenchStrength
  activity: ManagerActivity
}
