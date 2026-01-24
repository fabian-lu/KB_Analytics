/**
 * Types for player detail modal.
 * Comprehensive player information for the detailed player view.
 */

import type { Manager, TeamInfo } from './dashboard'

// ============================================
// Player Status
// ============================================

export type PlayerStatus = 'fit' | 'injured' | 'suspended' | 'doubt' | 'unknown'

// ============================================
// Value & Trends
// ============================================

export interface ValueTrends {
  current: number
  change_1d: number         // vs yesterday
  change_7d: number         // vs 7 days ago
  change_1m: number         // vs 1 month ago
  change_1d_pct: number
  change_7d_pct: number
  change_1m_pct: number
}

export interface OwnershipInfo {
  owner: Manager | null     // null = not owned by anyone in league
  buy_price: number | null
  buy_date: string | null   // ISO date
  profit: number | null     // unrealized profit/loss
  profit_pct: number | null
}

// ============================================
// Performance & Stats
// ============================================

export interface SeasonStats {
  season: string            // e.g., "2024/25"
  games_played: number
  games_total: number       // total matchdays so far this season
  starting_appearances: number
  avg_minutes: number
  total_points: number
  avg_points: number
  goals: number
  assists: number
  yellow_cards: number
  red_cards: number
  clean_sheets: number      // for GK/DEF
}

export interface MatchdayPoints {
  matchday: number
  points: number
  minutes_played: number
  goals: number
  assists: number
  yellow_cards: number
  red_cards: number
  was_starter: boolean
  opponent: TeamInfo
  is_home: boolean
  result: string            // e.g., "2-1"
}

export interface SeasonPerformance {
  season: string
  matchdays: MatchdayPoints[]
}

export interface HomeAwayStats {
  games: number
  total_points: number
  avg_points: number
  goals: number
  assists: number
}

// ============================================
// Rankings & Comparison
// ============================================

export interface RankingInfo {
  by_total_points: number
  by_avg_points: number
  by_market_value: number
  total_players: number     // e.g., rank 12 of 520
}

export interface PositionAverage {
  total_points: number
  avg_points: number
  market_value: number
  euros_per_point: number
}

export interface EfficiencyStats {
  euros_per_point: number
  points_per_90: number
  bundesliga_rank: number   // rank by efficiency
  position_rank: number     // rank among same position
  total_bundesliga: number  // total players in bundesliga
  total_position: number    // total players in same position
  better_than_pct: number   // "Better than 78% of players"
}

// ============================================
// Price History & Forecast
// ============================================

export interface PricePoint {
  date: string              // ISO date
  value: number
}

export interface PriceForecast {
  date: string
  value: number
  confidence_low: number
  confidence_high: number
}

// ============================================
// Fixtures
// ============================================

export interface UpcomingFixture {
  matchday: number
  opponent: TeamInfo
  is_home: boolean
  datetime: string          // ISO datetime
  difficulty: number        // 1-5 (1=easy, 5=hard)
}

// ============================================
// Transfer History
// ============================================

export interface TransferEvent {
  date: string              // ISO date
  type: 'bought' | 'sold'
  manager: Manager
  price: number
}

// ============================================
// News
// ============================================

export interface NewsArticle {
  title: string
  url: string
  source: 'ligainsider' | 'google'
  date: string              // ISO date
  snippet?: string
  image_url?: string
}

// ============================================
// Form Trend
// ============================================

export type FormTrend = 'rising' | 'rising_slight' | 'stable' | 'falling_slight' | 'falling'

// ============================================
// Main Player Detail Type
// ============================================

export interface PlayerDetail {
  // Identity
  id: string
  name: string
  position: number          // 1=GK, 2=DEF, 3=MID, 4=FWD
  jersey_number: number | null
  profile_image: string
  team: TeamInfo
  status: PlayerStatus
  status_note?: string      // e.g., "Knee injury, out 2 weeks"

  // Playing likelihood
  play_likelihood: number   // 0-100

  // Current season quick stats
  current_season: SeasonStats

  // Value
  value: ValueTrends
  ownership: OwnershipInfo

  // Detailed stats
  home_stats: HomeAwayStats
  away_stats: HomeAwayStats
  avg_points_last_3: number
  avg_points_last_5: number
  raw_points_avg: number    // Without bonuses (starter bonus, goals, etc.)

  // Efficiency & Rankings
  efficiency: EfficiencyStats
  bundesliga_rank: RankingInfo
  position_rank: RankingInfo
  position_average: PositionAverage

  // Form
  form_trend: FormTrend
  last_5_points: number[]   // Points for last 5 matchdays

  // Charts
  performance_history: SeasonPerformance[]  // All seasons
  price_history: PricePoint[]
  price_forecast: PriceForecast[]

  // Fixtures
  next_fixtures: UpcomingFixture[]

  // Transfer history
  transfer_history: TransferEvent[]

  // News
  ligainsider_url: string
  news: NewsArticle[]
}

// ============================================
// Position Helpers
// ============================================

export const POSITION_LABELS: Record<number, string> = {
  1: 'GK',
  2: 'DEF',
  3: 'MID',
  4: 'FWD',
}

export const POSITION_FULL_LABELS: Record<number, string> = {
  1: 'Goalkeeper',
  2: 'Defender',
  3: 'Midfielder',
  4: 'Forward',
}

export const POSITION_COLORS: Record<number, { bg: string; text: string; gradient: string }> = {
  1: {
    bg: 'bg-amber-500',
    text: 'text-amber-500',
    gradient: 'from-amber-400 to-yellow-500',
  },
  2: {
    bg: 'bg-blue-500',
    text: 'text-blue-500',
    gradient: 'from-blue-400 to-blue-600',
  },
  3: {
    bg: 'bg-emerald-500',
    text: 'text-emerald-500',
    gradient: 'from-emerald-400 to-green-600',
  },
  4: {
    bg: 'bg-rose-500',
    text: 'text-rose-500',
    gradient: 'from-rose-400 to-red-600',
  },
}
