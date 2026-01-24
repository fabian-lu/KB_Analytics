import type {
  PlayerDetail,
  SeasonPerformance,
  MatchdayPoints,
  PricePoint,
  PriceForecast,
  UpcomingFixture,
  TransferEvent,
  NewsArticle,
  HomeAwayStats,
  SeasonStats,
  ValueTrends,
  OwnershipInfo,
  EfficiencyStats,
  RankingInfo,
  PositionAverage,
  FormTrend,
} from '@/types/player'
import type { TeamInfo, Manager } from '@/types/dashboard'

// ============================================
// TEAMS
// ============================================

const teams: Record<string, TeamInfo> = {
  b04: { id: 'b04', name: 'Bayer Leverkusen', short_name: 'B04', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/59/Bayer_04_Leverkusen_logo.svg/40px-Bayer_04_Leverkusen_logo.svg.png' },
  fcb: { id: 'fcb', name: 'Bayern München', short_name: 'FCB', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg/40px-FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg.png' },
  bvb: { id: 'bvb', name: 'Borussia Dortmund', short_name: 'BVB', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Borussia_Dortmund_logo.svg/40px-Borussia_Dortmund_logo.svg.png' },
  rbl: { id: 'rbl', name: 'RB Leipzig', short_name: 'RBL', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/04/RB_Leipzig_2014_logo.svg/40px-RB_Leipzig_2014_logo.svg.png' },
  vfb: { id: 'vfb', name: 'VfB Stuttgart', short_name: 'VFB', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/VfB_Stuttgart_1893_Logo.svg/40px-VfB_Stuttgart_1893_Logo.svg.png' },
  sge: { id: 'sge', name: 'Eintracht Frankfurt', short_name: 'SGE', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Eintracht_Frankfurt_Logo.svg/40px-Eintracht_Frankfurt_Logo.svg.png' },
  m05: { id: 'm05', name: 'Mainz 05', short_name: 'M05', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Logo_Mainz_05.svg/40px-Logo_Mainz_05.svg.png' },
  scf: { id: 'scf', name: 'SC Freiburg', short_name: 'SCF', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6d/SC_Freiburg_logo.svg/40px-SC_Freiburg_logo.svg.png' },
}

// ============================================
// MANAGERS
// ============================================

const managers: Manager[] = [
  { id: 'user-123', name: 'Max Mustermann', profile_image: 'https://i.pravatar.cc/150?u=kickbase' },
  { id: 'user-201', name: 'Hans Schmidt', profile_image: 'https://i.pravatar.cc/150?u=hans' },
  { id: 'user-202', name: 'Lisa Müller', profile_image: 'https://i.pravatar.cc/150?u=lisa' },
  { id: 'user-203', name: 'Thomas Wagner', profile_image: 'https://i.pravatar.cc/150?u=thomas' },
]

// ============================================
// HELPER FUNCTIONS
// ============================================

function generateMatchdayPoints(
  numMatchdays: number,
  avgPoints: number,
  position: number,
): MatchdayPoints[] {
  const matchdays: MatchdayPoints[] = []
  const opponents = [teams.fcb, teams.bvb, teams.rbl, teams.vfb, teams.sge, teams.m05, teams.scf, teams.b04]

  for (let md = 1; md <= numMatchdays; md++) {
    const variance = avgPoints * 0.6
    const points = Math.max(0, Math.round(avgPoints + (Math.random() - 0.5) * variance * 2))
    const minutes = Math.random() > 0.1 ? Math.floor(60 + Math.random() * 30) : 0
    const wasStarter = minutes >= 60

    // Goals/assists based on position and randomness
    const goals = position === 4 ? (Math.random() > 0.7 ? 1 : 0) :
                  position === 3 ? (Math.random() > 0.85 ? 1 : 0) : 0
    const assists = position >= 3 ? (Math.random() > 0.8 ? 1 : 0) : 0

    matchdays.push({
      matchday: md,
      points,
      minutes_played: minutes,
      goals,
      assists,
      yellow_cards: Math.random() > 0.9 ? 1 : 0,
      red_cards: Math.random() > 0.98 ? 1 : 0,
      was_starter: wasStarter,
      opponent: opponents[md % opponents.length],
      is_home: md % 2 === 0,
      result: `${Math.floor(Math.random() * 4)}-${Math.floor(Math.random() * 4)}`,
    })
  }

  return matchdays
}

function generatePriceHistory(
  startValue: number,
  endValue: number,
  months: number = 5,
): PricePoint[] {
  const history: PricePoint[] = []
  const startDate = new Date('2025-08-15')
  const daysTotal = months * 30

  for (let day = 0; day <= daysTotal; day++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + day)

    // Smooth progression with some noise
    const progress = day / daysTotal
    const baseValue = startValue + (endValue - startValue) * progress
    const noise = baseValue * (Math.random() - 0.5) * 0.03
    const value = Math.round(baseValue + noise)

    history.push({
      date: date.toISOString().split('T')[0],
      value,
    })
  }

  return history
}

function generatePriceForecast(
  currentValue: number,
  trend: 'up' | 'down' | 'stable',
  days: number = 30,
): PriceForecast[] {
  const forecast: PriceForecast[] = []
  const startDate = new Date()

  const trendFactor = trend === 'up' ? 1.02 : trend === 'down' ? 0.98 : 1.0

  for (let day = 1; day <= days; day++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + day)

    const progress = day / days
    const baseValue = currentValue * Math.pow(trendFactor, day / 7)
    const confidence = 0.05 + progress * 0.15 // Confidence range grows over time

    forecast.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(baseValue),
      confidence_low: Math.round(baseValue * (1 - confidence)),
      confidence_high: Math.round(baseValue * (1 + confidence)),
    })
  }

  return forecast
}

function generateUpcomingFixtures(team: TeamInfo): UpcomingFixture[] {
  const opponents = [teams.fcb, teams.bvb, teams.rbl, teams.vfb, teams.sge].filter(t => t.id !== team.id)
  const fixtures: UpcomingFixture[] = []
  const startDate = new Date()

  for (let i = 0; i < 5; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + 7 * (i + 1))
    date.setHours(15, 30, 0, 0)

    fixtures.push({
      matchday: 18 + i,
      opponent: opponents[i % opponents.length],
      is_home: i % 2 === 0,
      datetime: date.toISOString(),
      difficulty: Math.floor(Math.random() * 3) + 2, // 2-4 difficulty
    })
  }

  return fixtures
}

function generateTransferHistory(playerId: string): TransferEvent[] {
  const history: TransferEvent[] = []
  const numTransfers = Math.floor(Math.random() * 5) + 1

  let basePrice = 10_000_000
  const startDate = new Date('2025-08-20')

  for (let i = 0; i < numTransfers; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + Math.floor(Math.random() * 30) + i * 20)

    const priceVariation = basePrice * (Math.random() * 0.4 + 0.8)

    history.push({
      date: date.toISOString().split('T')[0],
      type: i % 2 === 0 ? 'bought' : 'sold',
      manager: managers[i % managers.length],
      price: Math.round(priceVariation),
    })

    basePrice = priceVariation * 1.1
  }

  return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

function generateNews(playerName: string): NewsArticle[] {
  const now = new Date()

  return [
    {
      title: `${playerName} mit Traumtor gegen Bayern`,
      url: 'https://www.ligainsider.de/example1',
      source: 'ligainsider',
      date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      snippet: `${playerName} erzielte ein sensationelles Tor aus 25 Metern und sicherte seinem Team den Sieg.`,
    },
    {
      title: `Marktwert-Update: ${playerName} steigt weiter`,
      url: 'https://www.ligainsider.de/example2',
      source: 'ligainsider',
      date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      snippet: 'Nach starken Leistungen steigt der Marktwert erneut um 2 Millionen Euro.',
    },
    {
      title: `${playerName}: "Ich fühle mich in Topform"`,
      url: 'https://www.google.com/news/example1',
      source: 'google',
      date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      snippet: 'In einem exklusiven Interview spricht der Spieler über seine aktuelle Form und Ziele.',
      image_url: 'https://i.pravatar.cc/200?u=news1',
    },
    {
      title: `Bundesliga: ${playerName} unter den Top-Performern`,
      url: 'https://www.google.com/news/example2',
      source: 'google',
      date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      snippet: 'Die Statistiken zeigen: Kaum ein Spieler ist aktuell so stark wie er.',
    },
  ]
}

// ============================================
// MOCK PLAYERS
// ============================================

const mockWirtz: PlayerDetail = {
  // Identity
  id: 'mf1',
  name: 'Florian Wirtz',
  position: 3,
  jersey_number: 10,
  profile_image: 'https://i.pravatar.cc/300?u=wirtz',
  team: teams.b04,
  status: 'fit',
  status_note: undefined,

  // Playing likelihood
  play_likelihood: 95,

  // Current season
  current_season: {
    season: '2024/25',
    games_played: 16,
    games_total: 17,
    starting_appearances: 15,
    avg_minutes: 82,
    total_points: 847,
    avg_points: 52.9,
    goals: 11,
    assists: 8,
    yellow_cards: 2,
    red_cards: 0,
    clean_sheets: 0,
  },

  // Value
  value: {
    current: 128_500_000,
    change_1d: 320_000,
    change_7d: 2_340_000,
    change_1m: 8_200_000,
    change_1d_pct: 0.25,
    change_7d_pct: 1.85,
    change_1m_pct: 6.82,
  },

  ownership: {
    owner: managers[0],
    buy_price: 95_000_000,
    buy_date: '2025-08-22',
    profit: 33_500_000,
    profit_pct: 35.3,
  },

  // Detailed stats
  home_stats: {
    games: 8,
    total_points: 456,
    avg_points: 57.0,
    goals: 7,
    assists: 4,
  },
  away_stats: {
    games: 8,
    total_points: 391,
    avg_points: 48.9,
    goals: 4,
    assists: 4,
  },
  avg_points_last_3: 61.3,
  avg_points_last_5: 57.4,
  raw_points_avg: 38.2,

  // Efficiency & Rankings
  efficiency: {
    euros_per_point: 151_710,
    points_per_90: 58.1,
    bundesliga_rank: 3,
    position_rank: 1,
    total_bundesliga: 520,
    total_position: 145,
    better_than_pct: 99.4,
  },

  bundesliga_rank: {
    by_total_points: 2,
    by_avg_points: 1,
    by_market_value: 3,
    total_players: 520,
  },

  position_rank: {
    by_total_points: 1,
    by_avg_points: 1,
    by_market_value: 2,
    total_players: 145,
  },

  position_average: {
    total_points: 312,
    avg_points: 18.4,
    market_value: 8_500_000,
    euros_per_point: 462_000,
  },

  // Form
  form_trend: 'rising',
  last_5_points: [43, 61, 78, 38, 67],

  // Charts
  performance_history: [
    {
      season: '2024/25',
      matchdays: generateMatchdayPoints(17, 52.9, 3),
    },
    {
      season: '2023/24',
      matchdays: generateMatchdayPoints(34, 48.2, 3),
    },
    {
      season: '2022/23',
      matchdays: generateMatchdayPoints(34, 41.5, 3),
    },
  ],

  price_history: generatePriceHistory(95_000_000, 128_500_000),
  price_forecast: generatePriceForecast(128_500_000, 'up'),

  // Fixtures
  next_fixtures: generateUpcomingFixtures(teams.b04),

  // Transfer history
  transfer_history: [
    { date: '2025-08-22', type: 'bought', manager: managers[0], price: 95_000_000 },
  ],

  // News
  ligainsider_url: 'https://www.ligainsider.de/florian-wirtz/',
  news: generateNews('Florian Wirtz'),
}

const mockKane: PlayerDetail = {
  // Identity
  id: 'fw1',
  name: 'Harry Kane',
  position: 4,
  jersey_number: 9,
  profile_image: 'https://i.pravatar.cc/300?u=kane',
  team: teams.fcb,
  status: 'fit',

  play_likelihood: 92,

  current_season: {
    season: '2024/25',
    games_played: 17,
    games_total: 17,
    starting_appearances: 17,
    avg_minutes: 88,
    total_points: 762,
    avg_points: 44.8,
    goals: 18,
    assists: 6,
    yellow_cards: 3,
    red_cards: 0,
    clean_sheets: 0,
  },

  value: {
    current: 145_000_000,
    change_1d: -180_000,
    change_7d: -1_200_000,
    change_1m: 2_500_000,
    change_1d_pct: -0.12,
    change_7d_pct: -0.82,
    change_1m_pct: 1.75,
  },

  ownership: {
    owner: managers[1],
    buy_price: 138_000_000,
    buy_date: '2025-08-18',
    profit: 7_000_000,
    profit_pct: 5.1,
  },

  home_stats: {
    games: 9,
    total_points: 420,
    avg_points: 46.7,
    goals: 11,
    assists: 3,
  },
  away_stats: {
    games: 8,
    total_points: 342,
    avg_points: 42.8,
    goals: 7,
    assists: 3,
  },
  avg_points_last_3: 41.0,
  avg_points_last_5: 43.2,
  raw_points_avg: 32.5,

  efficiency: {
    euros_per_point: 190_290,
    points_per_90: 45.8,
    bundesliga_rank: 8,
    position_rank: 2,
    total_bundesliga: 520,
    total_position: 85,
    better_than_pct: 98.5,
  },

  bundesliga_rank: {
    by_total_points: 4,
    by_avg_points: 5,
    by_market_value: 1,
    total_players: 520,
  },

  position_rank: {
    by_total_points: 1,
    by_avg_points: 2,
    by_market_value: 1,
    total_players: 85,
  },

  position_average: {
    total_points: 245,
    avg_points: 14.4,
    market_value: 12_000_000,
    euros_per_point: 833_000,
  },

  form_trend: 'stable',
  last_5_points: [52, 38, 45, 41, 48],

  performance_history: [
    {
      season: '2024/25',
      matchdays: generateMatchdayPoints(17, 44.8, 4),
    },
    {
      season: '2023/24',
      matchdays: generateMatchdayPoints(34, 52.1, 4),
    },
  ],

  price_history: generatePriceHistory(138_000_000, 145_000_000),
  price_forecast: generatePriceForecast(145_000_000, 'stable'),

  next_fixtures: generateUpcomingFixtures(teams.fcb),

  transfer_history: [
    { date: '2025-08-18', type: 'bought', manager: managers[1], price: 138_000_000 },
  ],

  ligainsider_url: 'https://www.ligainsider.de/harry-kane/',
  news: generateNews('Harry Kane'),
}

const mockNeuer: PlayerDetail = {
  id: 'gk1',
  name: 'Manuel Neuer',
  position: 1,
  jersey_number: 1,
  profile_image: 'https://i.pravatar.cc/300?u=neuer',
  team: teams.fcb,
  status: 'injured',
  status_note: 'Oberschenkelverletzung, voraussichtlich 2 Wochen',

  play_likelihood: 0,

  current_season: {
    season: '2024/25',
    games_played: 14,
    games_total: 17,
    starting_appearances: 14,
    avg_minutes: 90,
    total_points: 312,
    avg_points: 22.3,
    goals: 0,
    assists: 0,
    yellow_cards: 1,
    red_cards: 0,
    clean_sheets: 6,
  },

  value: {
    current: 8_500_000,
    change_1d: -150_000,
    change_7d: -800_000,
    change_1m: -2_100_000,
    change_1d_pct: -1.73,
    change_7d_pct: -8.60,
    change_1m_pct: -19.81,
  },

  ownership: {
    owner: null,
    buy_price: null,
    buy_date: null,
    profit: null,
    profit_pct: null,
  },

  home_stats: {
    games: 7,
    total_points: 168,
    avg_points: 24.0,
    goals: 0,
    assists: 0,
  },
  away_stats: {
    games: 7,
    total_points: 144,
    avg_points: 20.6,
    goals: 0,
    assists: 0,
  },
  avg_points_last_3: 18.3,
  avg_points_last_5: 19.8,
  raw_points_avg: 18.5,

  efficiency: {
    euros_per_point: 27_240,
    points_per_90: 22.3,
    bundesliga_rank: 42,
    position_rank: 4,
    total_bundesliga: 520,
    total_position: 36,
    better_than_pct: 91.9,
  },

  bundesliga_rank: {
    by_total_points: 45,
    by_avg_points: 38,
    by_market_value: 52,
    total_players: 520,
  },

  position_rank: {
    by_total_points: 4,
    by_avg_points: 3,
    by_market_value: 5,
    total_players: 36,
  },

  position_average: {
    total_points: 198,
    avg_points: 11.6,
    market_value: 4_200_000,
    euros_per_point: 362_000,
  },

  form_trend: 'falling',
  last_5_points: [28, 22, 15, 0, 0],

  performance_history: [
    {
      season: '2024/25',
      matchdays: generateMatchdayPoints(17, 22.3, 1),
    },
    {
      season: '2023/24',
      matchdays: generateMatchdayPoints(34, 24.8, 1),
    },
  ],

  price_history: generatePriceHistory(12_000_000, 8_500_000),
  price_forecast: generatePriceForecast(8_500_000, 'down'),

  next_fixtures: generateUpcomingFixtures(teams.fcb),

  transfer_history: generateTransferHistory('gk1'),

  ligainsider_url: 'https://www.ligainsider.de/manuel-neuer/',
  news: generateNews('Manuel Neuer'),
}

// ============================================
// PLAYER DATABASE
// ============================================

const playerDatabase: Record<string, PlayerDetail> = {
  mf1: mockWirtz,
  fw1: mockKane,
  gk1: mockNeuer,
}

// ============================================
// EXPORTS
// ============================================

export function getMockPlayerDetail(playerId: string): PlayerDetail | null {
  return playerDatabase[playerId] || null
}

export const mockPlayers = playerDatabase
