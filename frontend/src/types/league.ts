/**
 * Types for League pages.
 * Reuses Manager, PlayerSummary, DashboardLineup from dashboard.ts
 */

import type { Manager, PlayerSummary, DashboardLineup } from './dashboard'
import type { MarketPlayer } from './market'

// ============================================
// Transfer Market Listing
// ============================================

export interface TransferMarketListing {
  /** The player being sold (full MarketPlayer data) */
  player: MarketPlayer
  /** Manager who listed the player */
  seller: Manager
  /** Asking price set by seller */
  asking_price: number
  /** ISO timestamp when listed */
  listed_at: string
  /** Hours since listing (derived) */
  hours_listed: number
  /** Price difference: asking_price - market_value */
  price_diff: number
  /** Price difference as percentage */
  price_diff_pct: number
}

export type TransferMarketSortOption =
  | 'asking_price'
  | 'market_value'
  | 'price_diff'
  | 'hours_listed'
  | 'avg_points'
  | 'ppm'
  | 'value_change_7d'

// ============================================
// Transfer History
// ============================================

export type LeagueTransferType = 'buy' | 'sell'

export interface LeagueTransfer {
  id: string
  /** The player being transferred */
  player: PlayerSummary
  /** Type of transfer from the perspective of the manager */
  type: LeagueTransferType
  /** Manager involved (buyer for 'buy', seller for 'sell') */
  manager: Manager
  /** The other party (null if bought from/sold to Kickbase) */
  counterparty: Manager | null
  /** Price paid/received */
  price: number
  /** Market value at time of transfer */
  market_value_at_transfer: number
  /** Difference: price - market_value (positive = overpay, negative = underpay) */
  price_diff: number
  /** Difference as percentage */
  price_diff_pct: number
  /** ISO timestamp of transfer */
  date: string
  /** Days ago (derived) */
  days_ago: number
}

// ============================================
// Trader Statistics
// ============================================

export interface ManagerTraderStats {
  manager: Manager
  /** Total number of transfers */
  total_transfers: number
  /** Number of buys */
  buys: number
  /** Number of sells */
  sells: number
  /** Total spent on buys */
  total_spent: number
  /** Total received from sells */
  total_received: number
  /** Average price paid per buy */
  avg_buy_price: number
  /** Average price received per sell */
  avg_sell_price: number
  /** Average overpay percentage on buys (positive = overpays, negative = underpays) */
  avg_overpay_pct: number
  /** Total profit/loss from flip trades (bought then sold same player) */
  flip_profit: number
  /** Number of profitable flips */
  profitable_flips: number
  /** Number of unprofitable flips */
  unprofitable_flips: number
  /** ROI percentage: (total_received - total_spent) / total_spent * 100 */
  roi_pct: number
  /** Position preferences: which positions they overpay most for */
  position_overpay: Record<number, number> // position -> avg overpay %
}

export type TransferSortOption =
  | 'date'
  | 'price'
  | 'price_diff'

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
