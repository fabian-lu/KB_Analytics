/**
 * Mock data for League > Managers page.
 * 8 manager profiles with German names, distributed players, achievements, etc.
 */

import type {
  ManagerProfile,
  KickbaseAchievement,
  ManagerMatchdayResult,
  ManagerStats,
  PlayerValueChange,
  InvestmentCapacity,
  BenchStrength,
  ManagerActivity,
  EngagementLevel,
  TransferMarketListing,
} from '@/types/league'
import type { Manager, PlayerSummary, DashboardLineup } from '@/types/dashboard'
import { mockMarketPlayers, toPlayerSummary } from './marketMock'

// ============================================
// ACHIEVEMENTS POOL
// ============================================

const achievementsPool: Omit<KickbaseAchievement, 'earned_at'>[] = [
  { id: 'ach-1', name: 'First Win', description: 'Win your first matchday', icon: '🏆', level: 1 },
  { id: 'ach-2', name: 'Hat Trick', description: 'Win 3 matchdays in a row', icon: '🎩', level: 2 },
  { id: 'ach-3', name: 'Top Scorer', description: 'Achieve the highest score in a single matchday', icon: '⭐', level: 2 },
  { id: 'ach-4', name: 'Transfer Wizard', description: 'Make 50 profitable transfers', icon: '🧙', level: 3 },
  { id: 'ach-5', name: 'Budget Master', description: 'Keep budget above 10M for 5 matchdays', icon: '💰', level: 1 },
  { id: 'ach-6', name: 'Clean Sweep', description: 'All starting players score points', icon: '🧹', level: 2 },
  { id: 'ach-7', name: 'Loyal Manager', description: 'Keep the same lineup for 3 matchdays', icon: '🤝', level: 1 },
  { id: 'ach-8', name: 'Underdog Victory', description: 'Win matchday while ranked last', icon: '🐕', level: 3 },
  { id: 'ach-9', name: 'Golden Boot', description: 'Own a player who scores 5+ goals in a game', icon: '👟', level: 3 },
  { id: 'ach-10', name: 'Rising Star', description: 'Own a player whose value increased 20% in a week', icon: '📈', level: 2 },
]

function assignAchievements(count: number, seed: number): KickbaseAchievement[] {
  const shuffled = [...achievementsPool].sort((a, b) => {
    const hashA = (a.id.charCodeAt(4) + seed) % 100
    const hashB = (b.id.charCodeAt(4) + seed) % 100
    return hashA - hashB
  })

  return shuffled.slice(0, count).map((ach, idx) => ({
    ...ach,
    earned_at: new Date(2024, 7 + idx, 10 + seed).toISOString(),
  }))
}

// ============================================
// MANAGERS
// ============================================

const managerData: { name: string; seed: number }[] = [
  { name: 'Maximilian Bauer', seed: 1 },
  { name: 'Sophie Müller', seed: 2 },
  { name: 'Lukas Schmidt', seed: 3 },
  { name: 'Emma Fischer', seed: 4 },
  { name: 'Felix Weber', seed: 5 },
  { name: 'Hannah Braun', seed: 6 },
  { name: 'Jonas Wagner', seed: 7 },
  { name: 'Lena Hoffmann', seed: 8 },
]

function createManager(name: string, seed: number): Manager {
  return {
    id: `mgr-${seed}`,
    name,
    profile_image: `https://i.pravatar.cc/150?u=manager-${seed}`,
  }
}

// ============================================
// PLAYER DISTRIBUTION
// ============================================

// Convert all market players to PlayerSummary
const allPlayers: PlayerSummary[] = mockMarketPlayers.map(p => toPlayerSummary(p))

// Distribute players across 8 managers (no overlap - Kickbase ownership model)
// Each manager gets 11 starting + 2-7 bench players
function distributePlayersToManagers(): { starting: PlayerSummary[]; bench: PlayerSummary[] }[] {
  const shuffled = [...allPlayers].sort((a, b) => {
    // Deterministic shuffle based on player id
    return a.id.localeCompare(b.id)
  })

  // Split by position for proper distribution
  const byPosition: Record<number, PlayerSummary[]> = { 1: [], 2: [], 3: [], 4: [] }
  for (const p of shuffled) {
    byPosition[p.position]?.push(p)
  }

  const distributions: { starting: PlayerSummary[]; bench: PlayerSummary[] }[] = []

  for (let i = 0; i < 8; i++) {
    const starting: PlayerSummary[] = []
    const bench: PlayerSummary[] = []

    // Pick 1 GK for starting
    if (byPosition[1].length > 0) {
      starting.push(byPosition[1].shift()!)
    }

    // Pick 4 DEF for starting (or less if not enough)
    for (let j = 0; j < 4 && byPosition[2].length > 0; j++) {
      starting.push(byPosition[2].shift()!)
    }

    // Pick 4 MID for starting
    for (let j = 0; j < 4 && byPosition[3].length > 0; j++) {
      starting.push(byPosition[3].shift()!)
    }

    // Pick 2 FWD for starting
    for (let j = 0; j < 2 && byPosition[4].length > 0; j++) {
      starting.push(byPosition[4].shift()!)
    }

    // Add bench players (2-5 per manager)
    const benchCount = 2 + (i % 4)
    const remaining = [
      ...byPosition[1],
      ...byPosition[2],
      ...byPosition[3],
      ...byPosition[4],
    ]

    for (let j = 0; j < benchCount && remaining.length > 0; j++) {
      const idx = j % remaining.length
      const player = remaining.splice(idx, 1)[0]
      bench.push(player)

      // Remove from position arrays
      for (const pos of [1, 2, 3, 4]) {
        const posIdx = byPosition[pos].findIndex(p => p.id === player.id)
        if (posIdx >= 0) {
          byPosition[pos].splice(posIdx, 1)
          break
        }
      }
    }

    distributions.push({ starting, bench })
  }

  return distributions
}

const playerDistributions = distributePlayersToManagers()

// ============================================
// MATCHDAY HISTORY GENERATOR
// ============================================

function generateMatchdayHistory(seed: number, totalManagers: number): ManagerMatchdayResult[] {
  const history: ManagerMatchdayResult[] = []
  for (let md = 1; md <= 17; md++) {
    // Generate deterministic points based on seed and matchday
    const hash = (seed * 17 + md * 31) % 1000
    const basePoints = 150 + (hash % 200) // 150-350 points range
    const points = basePoints + Math.floor((seed * md) % 50)

    // Generate rank based on points (simplified)
    const rank = 1 + ((hash + md) % totalManagers)

    history.push({ matchday: md, points, rank })
  }
  return history
}

// ============================================
// STATS CALCULATOR
// ============================================

function calculateStats(history: ManagerMatchdayResult[]): ManagerStats {
  const points = history.map(h => h.points)
  const avg = points.reduce((s, p) => s + p, 0) / points.length

  // Find best and worst
  let best = history[0]
  let worst = history[0]
  for (const h of history) {
    if (h.points > best.points) best = h
    if (h.points < worst.points) worst = h
  }

  // Standard deviation
  const variance = points.reduce((s, p) => s + Math.pow(p - avg, 2), 0) / points.length
  const stdDev = Math.sqrt(variance)

  // Wins and top3
  const wins = history.filter(h => h.rank === 1).length
  const top3 = history.filter(h => h.rank <= 3).length

  return {
    avg_points_per_matchday: Math.round(avg * 10) / 10,
    best_matchday: { matchday: best.matchday, points: best.points },
    worst_matchday: { matchday: worst.matchday, points: worst.points },
    consistency: Math.round(stdDev * 10) / 10,
    matchday_wins: wins,
    total_matchdays_played: history.length,
    top3_finishes: top3,
  }
}

// ============================================
// VALUE CHANGES
// ============================================

function createValueChanges(players: PlayerSummary[]): PlayerValueChange[] {
  return players.map((player, idx) => {
    const hash = player.id.charCodeAt(0) + idx
    const direction = hash % 2 === 0 ? 1 : -1

    const change1d = direction * (50_000 + (hash % 150) * 1000)
    const change7d = change1d * 4
    const change30d = change1d * 12

    return {
      player,
      change_1d: change1d,
      change_7d: change7d,
      change_30d: change30d,
      change_1d_pct: Math.round((change1d / player.market_value) * 10000) / 100,
      change_7d_pct: Math.round((change7d / player.market_value) * 10000) / 100,
      change_30d_pct: Math.round((change30d / player.market_value) * 10000) / 100,
    }
  })
}

// ============================================
// INVESTMENT CAPACITY
// ============================================

function calculateInvestment(budget: number, players: PlayerSummary[]): InvestmentCapacity {
  const sellableValue = players.reduce((s, p) => s + p.market_value, 0)
  const totalSpendingPower = budget + sellableValue
  const maxSingleBuy = Math.floor(totalSpendingPower * 0.7) // 70% max for single buy

  return {
    budget,
    sellable_value: sellableValue,
    total_spending_power: totalSpendingPower,
    max_single_buy: maxSingleBuy,
  }
}

// ============================================
// BENCH STRENGTH
// ============================================

function calculateBenchStrength(starting: PlayerSummary[], bench: PlayerSummary[]): BenchStrength {
  const startingTotal = starting.reduce((s, p) => s + p.total_points, 0)
  const startingAvg = starting.length > 0 ? startingTotal / starting.length : 0

  const benchTotal = bench.reduce((s, p) => s + p.total_points, 0)
  const benchAvg = bench.length > 0 ? benchTotal / bench.length : 0

  const benchValue = bench.reduce((s, p) => s + p.market_value, 0)

  return {
    bench_total_points: benchTotal,
    bench_avg_points: Math.round(benchAvg * 10) / 10,
    bench_total_value: benchValue,
    bench_player_count: bench.length,
    starting_total_points: startingTotal,
    starting_avg_points: Math.round(startingAvg * 10) / 10,
    bench_vs_starting_ratio: startingAvg > 0 ? Math.round((benchAvg / startingAvg) * 100) / 100 : 0,
  }
}

// ============================================
// ACTIVITY
// ============================================

const engagementLevels: EngagementLevel[] = ['very_active', 'active', 'moderate', 'passive', 'inactive']

function createActivity(seed: number): ManagerActivity {
  const total = 15 + (seed * 7) % 40
  const buys = Math.floor(total * 0.55)
  const sells = total - buys

  const daysSince = (seed * 3) % 14
  const transfersPerWeek = Math.round((total / 17) * 10) / 10

  const levelIdx = Math.min(4, Math.max(0, Math.floor(daysSince / 3)))
  const engagement = engagementLevels[levelIdx]

  const lastTransfer = new Date()
  lastTransfer.setDate(lastTransfer.getDate() - daysSince)

  return {
    total_transfers: total,
    buys,
    sells,
    transfers_per_week: transfersPerWeek,
    last_transfer_date: lastTransfer.toISOString().split('T')[0],
    days_since_last_transfer: daysSince,
    engagement_level: engagement,
  }
}

// ============================================
// FORMATION DETECTOR
// ============================================

function detectFormation(players: PlayerSummary[]): string {
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 }
  for (const p of players) {
    counts[p.position] = (counts[p.position] || 0) + 1
  }
  return `${counts[2]}-${counts[3]}-${counts[4]}`
}

// ============================================
// CREATE MANAGER PROFILES
// ============================================

function createManagerProfile(
  name: string,
  seed: number,
  rank: number,
  distribution: { starting: PlayerSummary[]; bench: PlayerSummary[] }
): ManagerProfile {
  const manager = createManager(name, seed)
  const { starting, bench } = distribution

  const allPlayers = [...starting, ...bench]
  const teamValue = allPlayers.reduce((s, p) => s + p.market_value, 0)
  const budget = 5_000_000 + (seed * 2_000_000) % 15_000_000

  const history = generateMatchdayHistory(seed, 8)
  const totalPoints = history.reduce((s, h) => s + h.points, 0)

  // Transfer profit: some positive, some negative
  const transferProfit = ((seed * 1_234_567) % 10_000_000) - 3_000_000

  const lineup: DashboardLineup = {
    formation: detectFormation(starting),
    starting,
    bench,
  }

  return {
    manager,
    rank,
    team_value: teamValue,
    budget,
    total_points: totalPoints,
    transfer_profit: transferProfit,
    lineup,
    investment: calculateInvestment(budget, allPlayers),
    value_changes: createValueChanges(allPlayers),
    stats: calculateStats(history),
    matchday_history: history,
    achievements: assignAchievements(2 + (seed % 5), seed),
    bench_strength: calculateBenchStrength(starting, bench),
    activity: createActivity(seed),
  }
}

// ============================================
// EXPORT MOCK DATA
// ============================================

export const mockManagerProfiles: ManagerProfile[] = managerData.map((m, idx) =>
  createManagerProfile(m.name, m.seed, idx + 1, playerDistributions[idx])
).sort((a, b) => b.total_points - a.total_points)
  .map((profile, idx) => ({ ...profile, rank: idx + 1 })) // Re-rank by total points

// ============================================
// TRANSFER MARKET LISTINGS
// ============================================

/**
 * Create mock transfer market listings.
 * Some players from each manager are listed for sale.
 */
function createTransferMarketListings(): TransferMarketListing[] {
  const listings: TransferMarketListing[] = []

  // Pick 1-2 players from each manager's squad to list on the market
  for (const profile of mockManagerProfiles) {
    const squadPlayers = [...profile.lineup.starting, ...profile.lineup.bench]

    // Pick players based on manager seed for deterministic selection
    const numToList = 1 + (profile.manager.id.charCodeAt(4) % 2) // 1 or 2 players

    for (let i = 0; i < numToList && i < squadPlayers.length; i++) {
      const playerSummary = squadPlayers[(profile.manager.id.charCodeAt(4) + i * 3) % squadPlayers.length]

      // Find the full MarketPlayer data
      const marketPlayer = mockMarketPlayers.find(p => p.id === playerSummary.id)
      if (!marketPlayer) continue

      // Calculate listing details
      const seed = playerSummary.id.charCodeAt(0) + profile.manager.id.charCodeAt(4)

      // Asking price: market value +/- some percentage (some overpriced, some bargains)
      const priceVariation = ((seed % 30) - 10) / 100 // -10% to +20%
      const askingPrice = Math.round(marketPlayer.market_value * (1 + priceVariation))

      // Hours listed: 1 to 72 hours
      const hoursListed = 1 + (seed % 72)

      // Calculate time listed
      const listedAt = new Date()
      listedAt.setHours(listedAt.getHours() - hoursListed)

      const priceDiff = askingPrice - marketPlayer.market_value
      const priceDiffPct = Math.round((priceDiff / marketPlayer.market_value) * 10000) / 100

      listings.push({
        player: marketPlayer,
        seller: profile.manager,
        asking_price: askingPrice,
        listed_at: listedAt.toISOString(),
        hours_listed: hoursListed,
        price_diff: priceDiff,
        price_diff_pct: priceDiffPct,
      })
    }
  }

  return listings
}

export const mockTransferMarketListings: TransferMarketListing[] = createTransferMarketListings()
