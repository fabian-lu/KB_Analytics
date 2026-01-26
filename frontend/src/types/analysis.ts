/**
 * Types for Market > Analysis page.
 * Chart configuration, regression, and analysis-specific types.
 */

import type { MarketPlayer } from './market'

// ============================================
// Chart Data Point (for scatter plot)
// ============================================

export interface ChartDataPoint {
  x: number                    // Market value in millions
  y: number                    // Avg points (or other Y metric)
  player: MarketPlayer         // Full player data for tooltip/click
}

// ============================================
// Regression Line
// ============================================

export interface RegressionResult {
  slope: number
  intercept: number
  r2: number                   // R-squared (goodness of fit)
  line: { x: number; y: number }[]  // Points for drawing the line
}

// ============================================
// Highlighted Players
// ============================================

export interface HighlightedPlayer {
  id: string
  name: string
  color: string               // Assigned highlight color
}

// ============================================
// Chart Configuration
// ============================================

export type YAxisMetric = 'avg_points' | 'form' | 'total_points'

export interface AnalysisChartConfig {
  yAxisMetric: YAxisMetric
  showRegressionLine: boolean
  showPositionAverages: boolean
  selectedPositions: number[]  // Empty = all positions
  selectedTeams: string[]      // Empty = all teams
  highlightedPlayers: HighlightedPlayer[]
}

// ============================================
// Position Statistics (for averages)
// ============================================

export interface PositionStats {
  position: number
  count: number
  avgMarketValue: number       // Average market value in millions
  avgPoints: number            // Average points
  avgPPM: number               // Average PPM
  minValue: number
  maxValue: number
  minPoints: number
  maxPoints: number
}

// ============================================
// Analysis Sections
// ============================================

export interface FormPlayer {
  player: MarketPlayer
  formDiff: number             // Difference between form and season avg
}

export interface ValueMomentumPlayer {
  player: MarketPlayer
  momentum: 'accelerating' | 'decelerating'
  change7d: number
  change30d: number
  acceleration: number         // Rate of change (7d vs 30d daily avg)
}

export interface SimilarPlayerResult {
  player: MarketPlayer
  similarity: number           // 0-100 score
  priceDiff: number            // Price difference vs target
  pointsDiff: number           // Avg points difference vs target
}

// ============================================
// Highlight Colors
// ============================================

export const HIGHLIGHT_COLORS = [
  '#f43f5e', // rose
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#f97316', // orange
  '#84cc16', // lime
  '#ec4899', // pink
  '#14b8a6', // teal
  '#eab308', // yellow
] as const

// ============================================
// Utility Functions
// ============================================

/**
 * Calculate linear regression for scatter plot data
 */
export function calculateRegression(points: ChartDataPoint[]): RegressionResult {
  const n = points.length
  if (n < 2) {
    return { slope: 0, intercept: 0, r2: 0, line: [] }
  }

  // Calculate means
  let sumX = 0, sumY = 0
  for (const p of points) {
    sumX += p.x
    sumY += p.y
  }
  const meanX = sumX / n
  const meanY = sumY / n

  // Calculate slope and intercept
  let numerator = 0, denominator = 0
  for (const p of points) {
    numerator += (p.x - meanX) * (p.y - meanY)
    denominator += (p.x - meanX) ** 2
  }

  const slope = denominator !== 0 ? numerator / denominator : 0
  const intercept = meanY - slope * meanX

  // Calculate R-squared
  let ssRes = 0, ssTot = 0
  for (const p of points) {
    const predicted = slope * p.x + intercept
    ssRes += (p.y - predicted) ** 2
    ssTot += (p.y - meanY) ** 2
  }
  const r2 = ssTot !== 0 ? 1 - ssRes / ssTot : 0

  // Generate line points for the full range
  const minX = Math.min(...points.map(p => p.x))
  const maxX = Math.max(...points.map(p => p.x))
  const line = [
    { x: minX, y: slope * minX + intercept },
    { x: maxX, y: slope * maxX + intercept },
  ]

  return { slope, intercept, r2, line }
}

/**
 * Calculate position-specific regression
 */
export function calculatePositionRegressions(
  points: ChartDataPoint[]
): Record<number, RegressionResult> {
  const byPosition: Record<number, ChartDataPoint[]> = {}

  for (const p of points) {
    const pos = p.player.position
    if (!byPosition[pos]) byPosition[pos] = []
    byPosition[pos].push(p)
  }

  const result: Record<number, RegressionResult> = {}
  for (const [pos, pts] of Object.entries(byPosition)) {
    result[Number(pos)] = calculateRegression(pts)
  }

  return result
}

/**
 * Calculate statistics for each position
 */
export function calculatePositionStats(players: MarketPlayer[]): PositionStats[] {
  const byPosition: Record<number, MarketPlayer[]> = {}

  for (const p of players) {
    if (!byPosition[p.position]) byPosition[p.position] = []
    byPosition[p.position].push(p)
  }

  return Object.entries(byPosition).map(([pos, players]) => {
    const values = players.map(p => p.market_value / 1_000_000)
    const points = players.map(p => p.avg_points)
    const ppms = players.map(p => p.ppm)

    return {
      position: Number(pos),
      count: players.length,
      avgMarketValue: values.reduce((a, b) => a + b, 0) / values.length,
      avgPoints: points.reduce((a, b) => a + b, 0) / points.length,
      avgPPM: ppms.reduce((a, b) => a + b, 0) / ppms.length,
      minValue: Math.min(...values),
      maxValue: Math.max(...values),
      minPoints: Math.min(...points),
      maxPoints: Math.max(...points),
    }
  })
}

/**
 * Find similar players to a target player
 */
export function findSimilarPlayers(
  target: MarketPlayer,
  allPlayers: MarketPlayer[],
  maxResults: number = 5
): SimilarPlayerResult[] {
  // Filter to same position, exclude target, and cheaper players only
  const candidates = allPlayers.filter(p =>
    p.id !== target.id &&
    p.position === target.position &&
    p.market_value < target.market_value
  )

  // Score each candidate by similarity (weighted factors)
  const scored = candidates.map(player => {
    const pointsDiff = Math.abs(player.avg_points - target.avg_points)
    const formDiff = Math.abs(player.form - target.form)
    const ppmDiff = Math.abs(player.ppm - target.ppm)

    // Normalize and weight (lower is more similar)
    const pointsScore = pointsDiff / (target.avg_points || 1)
    const formScore = formDiff / (target.form || 1)
    const ppmScore = ppmDiff / (target.ppm || 1)

    // Combined similarity (inverted so higher = more similar)
    const rawScore = pointsScore * 0.4 + formScore * 0.3 + ppmScore * 0.3
    const similarity = Math.max(0, Math.round((1 - rawScore) * 100))

    return {
      player,
      similarity,
      priceDiff: player.market_value - target.market_value,
      pointsDiff: player.avg_points - target.avg_points,
    }
  })

  // Sort by similarity (highest first) and return top results
  return scored
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, maxResults)
}
