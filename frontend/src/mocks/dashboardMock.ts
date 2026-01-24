import type {
  DashboardResponse,
  DashboardLineup,
  PlayerSummary,
  Manager,
  LeagueRanking,
  SeasonRankingEntry,
  MatchdayRankingEntry,
  SquadValueSnapshot,
  LeagueValueComparison,
  CashData,
  Transfer,
  DailyProfitSnapshot,
  ManagerBudget,
  MatchdayData,
  TeamInfo,
  Fixture,
  BundesligaTableEntry,
} from '@/types/dashboard'

// ===========================================
// LINEUP MOCKS
// ===========================================

// Helper to create a player
function createPlayer(
  id: string,
  name: string,
  position: number,
  teamName: string,
  totalPoints: number,
  marketValue: number,
  stdPoints?: number,
  avgLast3?: number
): PlayerSummary {
  const avgPoints = Math.round(totalPoints / 17 * 10) / 10
  return {
    id,
    name,
    position,
    team_id: `team-${id}`,
    team_name: teamName,
    team_logo: `https://i.pravatar.cc/40?u=${teamName.toLowerCase().replace(' ', '')}`,
    profile_image: `https://i.pravatar.cc/150?u=${id}`,
    market_value: marketValue,
    total_points: totalPoints,
    avg_points: avgPoints,
    std_points: stdPoints ?? Math.round(avgPoints * 0.4 * 10) / 10,  // Default ~40% of avg
    avg_last_3: avgLast3 ?? Math.round(avgPoints * (0.8 + Math.random() * 0.4) * 10) / 10,  // Random recent form
    euros_per_point: totalPoints > 0 ? Math.round(marketValue / totalPoints) : null,
  }
}

// All available players (18 total: 2 GK, 5 DF, 6 MF, 5 FW)
const allPlayers = {
  // Goalkeepers (position: 1)
  gk1: createPlayer('gk1', 'Manuel Neuer', 1, 'Bayern München', 89, 8_000_000),
  gk2: createPlayer('gk2', 'Gregor Kobel', 1, 'Borussia Dortmund', 112, 12_000_000),

  // Defenders (position: 2)
  df1: createPlayer('df1', 'Dayot Upamecano', 2, 'Bayern München', 134, 18_000_000),
  df2: createPlayer('df2', 'Nico Schlotterbeck', 2, 'Borussia Dortmund', 98, 14_000_000),
  df3: createPlayer('df3', 'Jeremie Frimpong', 2, 'Bayer Leverkusen', 187, 22_000_000),
  df4: createPlayer('df4', 'Alphonso Davies', 2, 'Bayern München', 156, 25_000_000),
  df5: createPlayer('df5', 'Jonathan Tah', 2, 'Bayer Leverkusen', 121, 16_000_000),

  // Midfielders (position: 3)
  mf1: createPlayer('mf1', 'Florian Wirtz', 3, 'Bayer Leverkusen', 342, 28_500_000),
  mf2: createPlayer('mf2', 'Jamal Musiala', 3, 'Bayern München', 318, 32_000_000),
  mf3: createPlayer('mf3', 'Xavi Simons', 3, 'RB Leipzig', 256, 18_200_000),
  mf4: createPlayer('mf4', 'Granit Xhaka', 3, 'Bayer Leverkusen', 198, 15_000_000),
  mf5: createPlayer('mf5', 'Joshua Kimmich', 3, 'Bayern München', 167, 20_000_000),
  mf6: createPlayer('mf6', 'Leroy Sané', 3, 'Bayern München', 145, 24_800_000),

  // Forwards (position: 4)
  fw1: createPlayer('fw1', 'Harry Kane', 4, 'Bayern München', 289, 45_000_000),
  fw2: createPlayer('fw2', 'Serhou Guirassy', 4, 'Borussia Dortmund', 98, 19_500_000),
  fw3: createPlayer('fw3', 'Victor Boniface', 4, 'Bayer Leverkusen', 167, 21_000_000),
  fw4: createPlayer('fw4', 'Loïs Openda', 4, 'RB Leipzig', 145, 18_000_000),
  fw5: createPlayer('fw5', 'Niclas Füllkrug', 4, 'Borussia Dortmund', 87, 22_000_000),
}

// MOCK 1: Normal lineup (4-3-3, 11 starting, 7 bench)
export const mockLineupNormal: DashboardLineup = {
  formation: '4-3-3',
  starting: [
    allPlayers.gk1,
    allPlayers.df1, allPlayers.df2, allPlayers.df3, allPlayers.df4,
    allPlayers.mf1, allPlayers.mf2, allPlayers.mf3,
    allPlayers.fw1, allPlayers.fw2, allPlayers.fw3,
  ],
  bench: [
    allPlayers.gk2,
    allPlayers.df5,
    allPlayers.mf4, allPlayers.mf5, allPlayers.mf6,
    allPlayers.fw4, allPlayers.fw5,
  ],
}

// MOCK 2: No bench (exactly 11 players)
export const mockLineupNoBench: DashboardLineup = {
  formation: '4-3-3',
  starting: [
    allPlayers.gk1,
    allPlayers.df1, allPlayers.df2, allPlayers.df3, allPlayers.df4,
    allPlayers.mf1, allPlayers.mf2, allPlayers.mf3,
    allPlayers.fw1, allPlayers.fw2, allPlayers.fw3,
  ],
  bench: [],
}

// MOCK 3: Not enough players (only 8)
export const mockLineupNotEnough: DashboardLineup = {
  formation: '3-3-1',
  starting: [
    allPlayers.gk1,
    allPlayers.df1, allPlayers.df2, allPlayers.df3,
    allPlayers.mf1, allPlayers.mf2, allPlayers.mf3,
    allPlayers.fw1,
  ],
  bench: [],
}

// MOCK 4: No midfielders
export const mockLineupNoMidfielders: DashboardLineup = {
  formation: '5-0-5',
  starting: [
    allPlayers.gk1,
    allPlayers.df1, allPlayers.df2, allPlayers.df3, allPlayers.df4, allPlayers.df5,
    allPlayers.fw1, allPlayers.fw2, allPlayers.fw3, allPlayers.fw4, allPlayers.fw5,
  ],
  bench: [
    allPlayers.gk2,
    allPlayers.mf1, allPlayers.mf2, allPlayers.mf3, allPlayers.mf4, allPlayers.mf5, allPlayers.mf6,
  ],
}

// MOCK 5: Empty starting (all on bench)
export const mockLineupEmpty: DashboardLineup = {
  formation: '',
  starting: [],
  bench: [
    allPlayers.gk1, allPlayers.gk2,
    allPlayers.df1, allPlayers.df2, allPlayers.df3, allPlayers.df4, allPlayers.df5,
    allPlayers.mf1, allPlayers.mf2, allPlayers.mf3, allPlayers.mf4, allPlayers.mf5, allPlayers.mf6,
    allPlayers.fw1, allPlayers.fw2, allPlayers.fw3, allPlayers.fw4, allPlayers.fw5,
  ],
}

// MOCK 6: Invalid formation (too many forwards)
export const mockLineupInvalid: DashboardLineup = {
  formation: '2-3-5',
  starting: [
    allPlayers.gk1,
    allPlayers.df1, allPlayers.df2,
    allPlayers.mf1, allPlayers.mf2, allPlayers.mf3,
    allPlayers.fw1, allPlayers.fw2, allPlayers.fw3, allPlayers.fw4, allPlayers.fw5,
  ],
  bench: [
    allPlayers.gk2,
    allPlayers.df3, allPlayers.df4, allPlayers.df5,
    allPlayers.mf4, allPlayers.mf5, allPlayers.mf6,
  ],
}

// ===========================================
// LEAGUE RANKING MOCKS
// ===========================================

// All managers in the league (16 total - max possible)
const managers: Manager[] = [
  { id: 'user-123', name: 'Max Mustermann', profile_image: 'https://i.pravatar.cc/150?u=kickbase' },
  { id: 'user-201', name: 'Hans Schmidt', profile_image: 'https://i.pravatar.cc/150?u=hans' },
  { id: 'user-202', name: 'Lisa Müller', profile_image: 'https://i.pravatar.cc/150?u=lisa' },
  { id: 'user-203', name: 'Thomas Wagner', profile_image: 'https://i.pravatar.cc/150?u=thomas' },
  { id: 'user-204', name: 'Sarah Fischer', profile_image: 'https://i.pravatar.cc/150?u=sarah' },
  { id: 'user-205', name: 'Michael Bauer', profile_image: 'https://i.pravatar.cc/150?u=michael' },
  { id: 'user-206', name: 'Anna Weber', profile_image: 'https://i.pravatar.cc/150?u=anna' },
  { id: 'user-207', name: 'Felix Hoffmann', profile_image: 'https://i.pravatar.cc/150?u=felix' },
  { id: 'user-208', name: 'Julia Schneider', profile_image: 'https://i.pravatar.cc/150?u=julia' },
  { id: 'user-209', name: 'Markus Braun', profile_image: 'https://i.pravatar.cc/150?u=markus' },
  { id: 'user-210', name: 'Sabine Koch', profile_image: 'https://i.pravatar.cc/150?u=sabine' },
  { id: 'user-211', name: 'Christian Richter', profile_image: 'https://i.pravatar.cc/150?u=christian' },
  { id: 'user-212', name: 'Katharina Wolf', profile_image: 'https://i.pravatar.cc/150?u=katharina' },
  { id: 'user-213', name: 'Stefan Klein', profile_image: 'https://i.pravatar.cc/150?u=stefan' },
  { id: 'user-214', name: 'Monika Schäfer', profile_image: 'https://i.pravatar.cc/150?u=monika' },
  { id: 'user-215', name: 'Andreas Neumann', profile_image: 'https://i.pravatar.cc/150?u=andreas' },
]

// Season rankings (sorted by total points descending)
const mockSeasonRanking: SeasonRankingEntry[] = [
  { manager: managers[1], rank: 1, total_points: 5120, avg_points_per_matchday: 301 },
  { manager: managers[2], rank: 2, total_points: 4890, avg_points_per_matchday: 288 },
  { manager: managers[0], rank: 3, total_points: 4532, avg_points_per_matchday: 267 },  // Current user
  { manager: managers[3], rank: 4, total_points: 4210, avg_points_per_matchday: 248 },
  { manager: managers[4], rank: 5, total_points: 3980, avg_points_per_matchday: 234 },
  { manager: managers[5], rank: 6, total_points: 3650, avg_points_per_matchday: 215 },
  { manager: managers[6], rank: 7, total_points: 3420, avg_points_per_matchday: 201 },
  { manager: managers[7], rank: 8, total_points: 2890, avg_points_per_matchday: 170 },
  { manager: managers[8], rank: 9, total_points: 2780, avg_points_per_matchday: 164 },
  { manager: managers[9], rank: 10, total_points: 2650, avg_points_per_matchday: 156 },
  { manager: managers[10], rank: 11, total_points: 2540, avg_points_per_matchday: 149 },
  { manager: managers[11], rank: 12, total_points: 2380, avg_points_per_matchday: 140 },
  { manager: managers[12], rank: 13, total_points: 2210, avg_points_per_matchday: 130 },
  { manager: managers[13], rank: 14, total_points: 2050, avg_points_per_matchday: 121 },
  { manager: managers[14], rank: 15, total_points: 1890, avg_points_per_matchday: 111 },
  { manager: managers[15], rank: 16, total_points: 1720, avg_points_per_matchday: 101 },
]

// Helper to generate matchday rankings with some randomness
function generateMatchdayRankings(numMatchdays: number): MatchdayRankingEntry[][] {
  const result: MatchdayRankingEntry[][] = []

  for (let md = 0; md < numMatchdays; md++) {
    // Generate random points for each manager (between 150 and 1500)
    const entries = managers.map(manager => ({
      manager,
      points: Math.floor(150 + Math.random() * 1350),
      rank: 0,  // Will be set after sorting
    }))

    // Sort by points descending and assign ranks
    entries.sort((a, b) => b.points - a.points)
    entries.forEach((entry, index) => {
      entry.rank = index + 1
    })

    result.push(entries)
  }

  return result
}

// Generate 17 matchdays of rankings
const mockMatchdayRankings = generateMatchdayRankings(17)

const mockLeagueRanking: LeagueRanking = {
  season: mockSeasonRanking,
  matchdays: mockMatchdayRankings,
}

// ===========================================
// SQUAD VALUE MOCKS
// ===========================================

// Squad value history - shows growth over the season
const mockSquadValueHistory: SquadValueSnapshot[] = [
  { matchday: 1, total_value: 120_000_000 },
  { matchday: 2, total_value: 122_500_000 },
  { matchday: 3, total_value: 121_800_000 },
  { matchday: 4, total_value: 125_200_000 },
  { matchday: 5, total_value: 128_900_000 },
  { matchday: 6, total_value: 132_100_000 },
  { matchday: 7, total_value: 135_600_000 },
  { matchday: 8, total_value: 133_200_000 },
  { matchday: 9, total_value: 138_400_000 },
  { matchday: 10, total_value: 142_700_000 },
  { matchday: 11, total_value: 141_500_000 },
  { matchday: 12, total_value: 145_800_000 },
  { matchday: 13, total_value: 148_200_000 },
  { matchday: 14, total_value: 152_600_000 },
  { matchday: 15, total_value: 151_900_000 },
  { matchday: 16, total_value: 154_300_000 },
  { matchday: 17, total_value: 156_420_000 },
]

// League comparison - all 16 managers with squad values
// Values clustered around 145-165M with a few outliers
const mockLeagueValueComparison: LeagueValueComparison = {
  managers: [
    { manager: managers[0], squad_value: 156_420_000 },  // Current user (rank 4)
    { manager: managers[1], squad_value: 178_500_000 },  // Outlier - highest
    { manager: managers[2], squad_value: 168_200_000 },
    { manager: managers[3], squad_value: 162_800_000 },
    { manager: managers[4], squad_value: 155_100_000 },
    { manager: managers[5], squad_value: 152_400_000 },
    { manager: managers[6], squad_value: 150_800_000 },
    { manager: managers[7], squad_value: 149_200_000 },
    { manager: managers[8], squad_value: 147_600_000 },
    { manager: managers[9], squad_value: 146_100_000 },
    { manager: managers[10], squad_value: 144_500_000 },
    { manager: managers[11], squad_value: 142_900_000 },
    { manager: managers[12], squad_value: 141_200_000 },
    { manager: managers[13], squad_value: 138_800_000 },
    { manager: managers[14], squad_value: 132_500_000 },
    { manager: managers[15], squad_value: 118_000_000 },  // Outlier - lowest
  ],
  your_rank: 4,
}

// ===========================================
// CASH / BUDGET MOCKS
// ===========================================

// Generate daily profit history (simulates ~5 months of season data)
function generateDailyProfitHistory(): DailyProfitSnapshot[] {
  const history: DailyProfitSnapshot[] = []
  const startDate = new Date('2025-08-15')  // Season start
  const endDate = new Date('2026-01-20')    // Current date

  let cumulativeProfit = 0
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    // Add some random daily changes (transfers happen occasionally)
    const dayOfWeek = currentDate.getDay()
    const random = Math.random()

    // Transfers more likely on weekends
    if (random > 0.85 || (dayOfWeek === 0 || dayOfWeek === 6) && random > 0.7) {
      // A transfer happened - could be profit or loss
      const profitChange = (Math.random() - 0.4) * 2_000_000  // Slightly biased towards profit
      cumulativeProfit += profitChange
    }

    history.push({
      date: currentDate.toISOString().split('T')[0],
      transfer_profit: Math.round(cumulativeProfit),
    })

    currentDate.setDate(currentDate.getDate() + 1)
  }

  // Ensure final value matches our target
  if (history.length > 0) {
    history[history.length - 1].transfer_profit = 9_640_000
  }

  return history
}

const mockProfitHistory = generateDailyProfitHistory()

// Best transfers (most profitable sells)
const mockBestTransfers: Transfer[] = [
  {
    player_id: 'p1',
    player_name: 'Florian Wirtz',
    player_image: 'https://i.pravatar.cc/150?u=wirtz',
    type: 'sell',
    price: 35_200_000,
    date: '2025-11-15',
    profit: 4_800_000,
  },
  {
    player_id: 'p2',
    player_name: 'Jamal Musiala',
    player_image: 'https://i.pravatar.cc/150?u=musiala',
    type: 'sell',
    price: 28_500_000,
    date: '2025-10-28',
    profit: 3_200_000,
  },
  {
    player_id: 'p3',
    player_name: 'Victor Boniface',
    player_image: 'https://i.pravatar.cc/150?u=boniface',
    type: 'sell',
    price: 18_900_000,
    date: '2025-12-02',
    profit: 2_400_000,
  },
]

// Worst transfers (biggest losses on sells)
const mockWorstTransfers: Transfer[] = [
  {
    player_id: 'p4',
    player_name: 'Niclas Füllkrug',
    player_image: 'https://i.pravatar.cc/150?u=fullkrug',
    type: 'sell',
    price: 15_200_000,
    date: '2025-09-20',
    profit: -3_800_000,
  },
  {
    player_id: 'p5',
    player_name: 'Leroy Sané',
    player_image: 'https://i.pravatar.cc/150?u=sane',
    type: 'sell',
    price: 19_800_000,
    date: '2025-10-05',
    profit: -2_500_000,
  },
  {
    player_id: 'p6',
    player_name: 'Serhou Guirassy',
    player_image: 'https://i.pravatar.cc/150?u=guirassy',
    type: 'sell',
    price: 14_100_000,
    date: '2025-11-22',
    profit: -1_900_000,
  },
]

// League budgets (all managers ranked by available cash)
const mockLeagueBudgets: ManagerBudget[] = [
  { manager: managers[3], budget: 28_500_000 },
  { manager: managers[7], budget: 24_200_000 },
  { manager: managers[11], budget: 19_800_000 },
  { manager: managers[1], budget: 18_100_000 },
  { manager: managers[5], budget: 15_600_000 },
  { manager: managers[9], budget: 14_200_000 },
  { manager: managers[0], budget: 12_340_000 },  // Current user (rank 7)
  { manager: managers[13], budget: 11_500_000 },
  { manager: managers[2], budget: 10_800_000 },
  { manager: managers[6], budget: 9_400_000 },
  { manager: managers[10], budget: 8_100_000 },
  { manager: managers[14], budget: 6_700_000 },
  { manager: managers[4], budget: 5_200_000 },
  { manager: managers[8], budget: 4_100_000 },
  { manager: managers[12], budget: 2_800_000 },
  { manager: managers[15], budget: 1_500_000 },
]

const mockCashData: CashData = {
  budget: 12_340_000,
  total_assets: 168_760_000,  // 12.34M + 156.42M squad value
  total_transfer_profit: 9_640_000,
  profit_history: mockProfitHistory,
  best_transfers: mockBestTransfers,
  worst_transfers: mockWorstTransfers,
  league_budgets: mockLeagueBudgets,
  your_budget_rank: 7,
  // Forecast calculation inputs
  avg_daily_profit: 62_000,  // ~62K average daily profit from transfers
  daily_bonus: 100_000,  // 100K daily bonus
  days_until_matchday: 2,  // 2 days until next matchday
}

// ===========================================
// MATCHDAY / FIXTURES MOCKS
// ===========================================

// All 18 Bundesliga teams
const bundesligaTeams: TeamInfo[] = [
  { id: 'fcb', name: 'Bayern München', short_name: 'FCB', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg/40px-FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg.png' },
  { id: 'bvb', name: 'Borussia Dortmund', short_name: 'BVB', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Borussia_Dortmund_logo.svg/40px-Borussia_Dortmund_logo.svg.png' },
  { id: 'b04', name: 'Bayer Leverkusen', short_name: 'B04', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/59/Bayer_04_Leverkusen_logo.svg/40px-Bayer_04_Leverkusen_logo.svg.png' },
  { id: 'rbl', name: 'RB Leipzig', short_name: 'RBL', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/04/RB_Leipzig_2014_logo.svg/40px-RB_Leipzig_2014_logo.svg.png' },
  { id: 'vfb', name: 'VfB Stuttgart', short_name: 'VFB', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/VfB_Stuttgart_1893_Logo.svg/40px-VfB_Stuttgart_1893_Logo.svg.png' },
  { id: 'sge', name: 'Eintracht Frankfurt', short_name: 'SGE', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Eintracht_Frankfurt_Logo.svg/40px-Eintracht_Frankfurt_Logo.svg.png' },
  { id: 'tsg', name: 'TSG Hoffenheim', short_name: 'TSG', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Logo_TSG_Hoffenheim.svg/40px-Logo_TSG_Hoffenheim.svg.png' },
  { id: 'scf', name: 'SC Freiburg', short_name: 'SCF', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6d/SC_Freiburg_logo.svg/40px-SC_Freiburg_logo.svg.png' },
  { id: 'wob', name: 'VfL Wolfsburg', short_name: 'WOB', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Logo-VfL-Wolfsburg.svg/40px-Logo-VfL-Wolfsburg.svg.png' },
  { id: 'bmg', name: 'Borussia Mönchengladbach', short_name: 'BMG', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Borussia_M%C3%B6nchengladbach_logo.svg/40px-Borussia_M%C3%B6nchengladbach_logo.svg.png' },
  { id: 'svw', name: 'Werder Bremen', short_name: 'SVW', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/SV-Werder-Bremen-Logo.svg/40px-SV-Werder-Bremen-Logo.svg.png' },
  { id: 'fcu', name: 'Union Berlin', short_name: 'FCU', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/1._FC_Union_Berlin_Logo.svg/40px-1._FC_Union_Berlin_Logo.svg.png' },
  { id: 'bsc', name: 'Hertha BSC', short_name: 'BSC', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Hertha_BSC_Logo_2012.svg/40px-Hertha_BSC_Logo_2012.svg.png' },
  { id: 'fca', name: 'FC Augsburg', short_name: 'FCA', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/FC_Augsburg_logo.svg/40px-FC_Augsburg_logo.svg.png' },
  { id: 'm05', name: 'Mainz 05', short_name: 'M05', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Logo_Mainz_05.svg/40px-Logo_Mainz_05.svg.png' },
  { id: 'boc', name: 'VfL Bochum', short_name: 'BOC', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/VfL_Bochum_logo.svg/40px-VfL_Bochum_logo.svg.png' },
  { id: 'koe', name: 'FC Köln', short_name: 'KOE', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/53/FC_Cologne_logo.svg/40px-FC_Cologne_logo.svg.png' },
  { id: 'hei', name: 'FC Heidenheim', short_name: 'HEI', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/FC-Heidenheim-1846.svg/40px-FC-Heidenheim-1846.svg.png' },
]

// Generate fixtures for a matchday
function generateMatchdayFixtures(matchday: number, played: boolean): Fixture[] {
  const fixtures: Fixture[] = []
  const shuffled = [...bundesligaTeams].sort(() => Math.random() - 0.5)

  // Base date for this matchday (spread across Friday-Sunday)
  const baseDate = new Date('2025-08-15')
  baseDate.setDate(baseDate.getDate() + (matchday - 1) * 7)

  for (let i = 0; i < 9; i++) {
    const homeTeam = shuffled[i * 2]
    const awayTeam = shuffled[i * 2 + 1]

    // Spread games: Fri 20:30, Sat 15:30 (5 games), Sat 18:30, Sun 15:30, Sun 17:30
    const gameDate = new Date(baseDate)
    let hours = 15, minutes = 30
    if (i === 0) { gameDate.setDate(gameDate.getDate()); hours = 20; minutes = 30 } // Friday
    else if (i <= 5) { gameDate.setDate(gameDate.getDate() + 1); hours = 15; minutes = 30 } // Saturday
    else if (i === 6) { gameDate.setDate(gameDate.getDate() + 1); hours = 18; minutes = 30 } // Saturday evening
    else if (i === 7) { gameDate.setDate(gameDate.getDate() + 2); hours = 15; minutes = 30 } // Sunday
    else { gameDate.setDate(gameDate.getDate() + 2); hours = 17; minutes = 30 } // Sunday evening
    gameDate.setHours(hours, minutes, 0, 0)

    fixtures.push({
      id: `md${matchday}-${i}`,
      home_team: homeTeam,
      away_team: awayTeam,
      datetime: gameDate.toISOString(),
      home_score: played ? Math.floor(Math.random() * 4) : null,
      away_score: played ? Math.floor(Math.random() * 4) : null,
    })
  }

  return fixtures
}

// Generate all matchday fixtures (17 played, rest not played)
const mockMatchdayFixtures: Fixture[][] = []
for (let md = 1; md <= 34; md++) {
  mockMatchdayFixtures.push(generateMatchdayFixtures(md, md <= 17))
}

// Bundesliga table (sorted by points)
const mockBundesligaTable: BundesligaTableEntry[] = [
  { rank: 1, team: bundesligaTeams[2], played: 17, goal_difference: 32, points: 43, kickbase_points: 4520 },  // Leverkusen
  { rank: 2, team: bundesligaTeams[0], played: 17, goal_difference: 28, points: 38, kickbase_points: 4280 },  // Bayern
  { rank: 3, team: bundesligaTeams[1], played: 17, goal_difference: 18, points: 34, kickbase_points: 3950 },  // Dortmund
  { rank: 4, team: bundesligaTeams[3], played: 17, goal_difference: 14, points: 32, kickbase_points: 3720 },  // Leipzig
  { rank: 5, team: bundesligaTeams[4], played: 17, goal_difference: 12, points: 30, kickbase_points: 3580 },  // Stuttgart
  { rank: 6, team: bundesligaTeams[5], played: 17, goal_difference: 8, points: 28, kickbase_points: 3340 },   // Frankfurt
  { rank: 7, team: bundesligaTeams[7], played: 17, goal_difference: 5, points: 26, kickbase_points: 3120 },   // Freiburg
  { rank: 8, team: bundesligaTeams[6], played: 17, goal_difference: 3, points: 25, kickbase_points: 2980 },   // Hoffenheim
  { rank: 9, team: bundesligaTeams[8], played: 17, goal_difference: 1, points: 24, kickbase_points: 2850 },   // Wolfsburg
  { rank: 10, team: bundesligaTeams[10], played: 17, goal_difference: -2, points: 22, kickbase_points: 2720 }, // Bremen
  { rank: 11, team: bundesligaTeams[9], played: 17, goal_difference: -4, points: 21, kickbase_points: 2590 },  // Gladbach
  { rank: 12, team: bundesligaTeams[11], played: 17, goal_difference: -6, points: 20, kickbase_points: 2480 }, // Union
  { rank: 13, team: bundesligaTeams[14], played: 17, goal_difference: -8, points: 18, kickbase_points: 2350 }, // Mainz
  { rank: 14, team: bundesligaTeams[13], played: 17, goal_difference: -10, points: 17, kickbase_points: 2220 }, // Augsburg
  { rank: 15, team: bundesligaTeams[17], played: 17, goal_difference: -12, points: 15, kickbase_points: 2080 }, // Heidenheim
  { rank: 16, team: bundesligaTeams[12], played: 17, goal_difference: -18, points: 13, kickbase_points: 1920 }, // Hertha
  { rank: 17, team: bundesligaTeams[16], played: 17, goal_difference: -24, points: 11, kickbase_points: 1750 }, // Köln
  { rank: 18, team: bundesligaTeams[15], played: 17, goal_difference: -37, points: 8, kickbase_points: 1480 },  // Bochum
]

const mockMatchdayData: MatchdayData = {
  current_matchday: 17,
  total_matchdays: 34,
  matchday_fixtures: mockMatchdayFixtures,
  table: mockBundesligaTable,
}

// ===========================================
// MAIN MOCK DATA
// Change `lineup` to test different scenarios
// ===========================================

export const mockDashboardData: DashboardResponse = {
  user: {
    id: 'user-123',
    name: 'Max Mustermann',
    profile_image: 'https://i.pravatar.cc/150?u=kickbase',
    league_name: 'Bundesliga Buddies',
    league_id: 'league-456',
  },

  stats: {
    rank: 3,
    total_managers: 16,
    total_points: 4532,
    avg_points_per_matchday: 287,
    team_value: 156_420_000,
    budget: 12_340_000,
    matchday_wins: 5,
    current_matchday: 17,
  },

  next_deadline: {
    matchday: 18,
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  },

  performance_history: [
    { matchday: 1, points: 180, is_winner: false },
    { matchday: 2, points: 420, is_winner: false },
    { matchday: 3, points: 250, is_winner: false },
    { matchday: 4, points: 650, is_winner: true },
    { matchday: 5, points: 380, is_winner: false },
    { matchday: 6, points: 890, is_winner: false },
    { matchday: 7, points: 1350, is_winner: true },
    { matchday: 8, points: 520, is_winner: false },
    { matchday: 9, points: 710, is_winner: false },
    { matchday: 10, points: 1100, is_winner: true },
    { matchday: 11, points: 290, is_winner: false },
    { matchday: 12, points: 480, is_winner: false },
    { matchday: 13, points: 950, is_winner: true },
    { matchday: 14, points: 1500, is_winner: true },
    { matchday: 15, points: 620, is_winner: false },
    { matchday: 16, points: 340, is_winner: false },
    { matchday: 17, points: 780, is_winner: false },
    { matchday: 18, points: 1250, is_winner: true },
    { matchday: 19, points: 410, is_winner: false },
    { matchday: 20, points: 560, is_winner: false },
    { matchday: 21, points: 920, is_winner: false },
    { matchday: 22, points: 270, is_winner: false },
    { matchday: 23, points: 1050, is_winner: true },
    { matchday: 24, points: 680, is_winner: false },
    { matchday: 25, points: 350, is_winner: false },
    { matchday: 26, points: 1400, is_winner: true },
    { matchday: 27, points: 590, is_winner: false },
    { matchday: 28, points: 830, is_winner: false },
    { matchday: 29, points: 210, is_winner: false },
    { matchday: 30, points: 990, is_winner: true },
    { matchday: 31, points: 450, is_winner: false },
    { matchday: 32, points: 1150, is_winner: false },
    { matchday: 33, points: 730, is_winner: false },
    { matchday: 34, points: 1600, is_winner: true },
  ],

  best_value_players: [
    allPlayers.mf1,  // Wirtz
    allPlayers.mf2,  // Musiala
    allPlayers.mf3,  // Simons
  ],

  worst_value_players: [
    allPlayers.fw5,  // Füllkrug
    allPlayers.fw2,  // Guirassy
    allPlayers.mf6,  // Sané
  ],

  // Change this to test different scenarios:
  // mockLineupNormal, mockLineupNoBench, mockLineupNotEnough,
  // mockLineupNoMidfielders, mockLineupEmpty, mockLineupInvalid
  lineup: mockLineupNormal,

  league_ranking: mockLeagueRanking,
  squad_value_history: mockSquadValueHistory,
  league_value_comparison: mockLeagueValueComparison,
  cash_data: mockCashData,
  matchday_data: mockMatchdayData,
}
