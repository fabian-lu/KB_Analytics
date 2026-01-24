/**
 * Types for dashboard endpoint.
 * Must match backend/app/models/dashboard.py
 */

// ============================================
// Core Data Types
// ============================================

export interface PlayerSummary {
  id: string
  name: string
  position: number  // 1=GK, 2=DEF, 3=MID, 4=FWD
  team_id: string
  team_name: string
  team_logo?: string
  profile_image: string
  market_value: number
  total_points: number
  avg_points: number
  std_points?: number     // Standard deviation of points (consistency)
  avg_last_3?: number     // Average points over last 3 matchdays
  euros_per_point: number | null
}

export interface MatchdayPerformance {
  matchday: number
  points: number
  is_winner: boolean  // Did user win this matchday in their league?
}

export interface UserProfile {
  id: string
  name: string
  profile_image: string
  league_name: string
  league_id: string
}

// ============================================
// Dashboard Stats
// ============================================

export interface DashboardStats {
  rank: number
  total_managers: number
  total_points: number
  avg_points_per_matchday: number
  team_value: number
  budget: number
  matchday_wins: number
  current_matchday: number
}

// ============================================
// Countdown / Next Deadline
// ============================================

export interface NextDeadline {
  matchday: number
  deadline: string  // ISO date string
}

// ============================================
// League Ranking (for rank modal)
// ============================================

// A manager in the league (reusable base type)
export interface Manager {
  id: string
  name: string
  profile_image: string
}

// Season leaderboard entry
export interface SeasonRankingEntry {
  manager: Manager
  rank: number
  total_points: number
  avg_points_per_matchday: number
}

// Single matchday ranking entry
export interface MatchdayRankingEntry {
  manager: Manager
  rank: number
  points: number
}

// Full ranking data
export interface LeagueRanking {
  season: SeasonRankingEntry[]
  matchdays: MatchdayRankingEntry[][]  // matchdays[0] = matchday 1, etc.
}

// ============================================
// Squad Value (for squad value modal)
// ============================================

// Squad value at a point in time
export interface SquadValueSnapshot {
  matchday: number
  total_value: number
}

// Single manager's squad value (for comparison)
export interface ManagerSquadValue {
  manager: Manager
  squad_value: number
}

// League comparison data
export interface LeagueValueComparison {
  managers: ManagerSquadValue[]  // All managers with their squad values
  your_rank: number  // rank by squad value in league
}

// ============================================
// Cash / Budget (for cash modal)
// ============================================

// A single transfer (buy or sell)
export interface Transfer {
  player_id: string
  player_name: string
  player_image: string
  type: 'buy' | 'sell'
  price: number
  date: string  // ISO date string
  profit: number  // Positive = gain, negative = loss (only meaningful for sells)
}

// Daily profit snapshot (one entry per day over the season)
export interface DailyProfitSnapshot {
  date: string  // ISO date string (YYYY-MM-DD)
  transfer_profit: number  // Cumulative transfer profit at this point
}

// Manager's available budget (for league comparison)
export interface ManagerBudget {
  manager: Manager
  budget: number
}

// All cash modal data
export interface CashData {
  budget: number
  total_assets: number  // budget + squad value
  total_transfer_profit: number
  profit_history: DailyProfitSnapshot[]  // Daily profit data over the season
  best_transfers: Transfer[]  // Top 3 profitable sells
  worst_transfers: Transfer[]  // Top 3 loss sells
  league_budgets: ManagerBudget[]  // All managers ranked by budget
  your_budget_rank: number
  // Forecast calculation inputs
  avg_daily_profit: number  // Average daily transfer profit
  daily_bonus: number  // Daily bonus (100K)
  days_until_matchday: number
}

// ============================================
// Matchday / Fixtures (for matchday modal)
// ============================================

// Team info for fixtures and table
export interface TeamInfo {
  id: string
  name: string
  short_name: string  // e.g., "FCB", "BVB"
  logo: string
}

// A single fixture
export interface Fixture {
  id: string
  home_team: TeamInfo
  away_team: TeamInfo
  datetime: string  // ISO date string
  home_score: number | null  // null if not played yet
  away_score: number | null
}

// Bundesliga table entry
export interface BundesligaTableEntry {
  rank: number
  team: TeamInfo
  played: number
  goal_difference: number
  points: number  // Actual Bundesliga points
  kickbase_points: number  // Total Kickbase points from this team's players
}

// All matchday modal data
export interface MatchdayData {
  current_matchday: number
  total_matchdays: number  // Usually 34
  matchday_fixtures: Fixture[][]  // matchday_fixtures[0] = MD1 fixtures, etc.
  table: BundesligaTableEntry[]
}

// ============================================
// Lineup
// ============================================

export interface DashboardLineup {
  formation: string  // e.g., "4-4-2"
  starting: PlayerSummary[]
  bench: PlayerSummary[]
}

// ============================================
// Main Response Type
// ============================================

export interface DashboardResponse {
  user: UserProfile
  stats: DashboardStats
  next_deadline: NextDeadline
  performance_history: MatchdayPerformance[]
  best_value_players: PlayerSummary[]
  worst_value_players: PlayerSummary[]
  lineup: DashboardLineup
  league_ranking: LeagueRanking
  squad_value_history: SquadValueSnapshot[]
  league_value_comparison: LeagueValueComparison
  cash_data: CashData
  matchday_data: MatchdayData
}
