import type { MarketPlayer } from '@/types/market'
import type { PlayerStatus, FormTrend } from '@/types/player'

// ============================================
// TEAMS (for search autocomplete)
// ============================================

export interface MockTeam {
  id: string
  name: string
  short_name: string
  logo: string
}

export const mockTeams: MockTeam[] = [
  { id: 'fcb', name: 'Bayern München', short_name: 'FCB', logo: 'https://tmssl.akamaized.net/images/wappen/head/27.png' },
  { id: 'bvb', name: 'Borussia Dortmund', short_name: 'BVB', logo: 'https://tmssl.akamaized.net/images/wappen/head/16.png' },
  { id: 'b04', name: 'Bayer Leverkusen', short_name: 'B04', logo: 'https://tmssl.akamaized.net/images/wappen/head/15.png' },
  { id: 'rbl', name: 'RB Leipzig', short_name: 'RBL', logo: 'https://tmssl.akamaized.net/images/wappen/head/23826.png' },
  { id: 'vfb', name: 'VfB Stuttgart', short_name: 'VFB', logo: 'https://tmssl.akamaized.net/images/wappen/head/79.png' },
  { id: 'sge', name: 'Eintracht Frankfurt', short_name: 'SGE', logo: 'https://tmssl.akamaized.net/images/wappen/head/24.png' },
  { id: 'scf', name: 'SC Freiburg', short_name: 'SCF', logo: 'https://tmssl.akamaized.net/images/wappen/head/60.png' },
  { id: 'tsg', name: 'TSG Hoffenheim', short_name: 'TSG', logo: 'https://tmssl.akamaized.net/images/wappen/head/533.png' },
  { id: 'wob', name: 'VfL Wolfsburg', short_name: 'WOB', logo: 'https://tmssl.akamaized.net/images/wappen/head/82.png' },
  { id: 'bmg', name: 'Bor. Mönchengladbach', short_name: 'BMG', logo: 'https://tmssl.akamaized.net/images/wappen/head/18.png' },
  { id: 'svw', name: 'Werder Bremen', short_name: 'SVW', logo: 'https://tmssl.akamaized.net/images/wappen/head/86.png' },
  { id: 'fcu', name: 'Union Berlin', short_name: 'FCU', logo: 'https://tmssl.akamaized.net/images/wappen/head/89.png' },
  { id: 'fca', name: 'FC Augsburg', short_name: 'FCA', logo: 'https://tmssl.akamaized.net/images/wappen/head/167.png' },
  { id: 'm05', name: 'Mainz 05', short_name: 'M05', logo: 'https://tmssl.akamaized.net/images/wappen/head/39.png' },
  { id: 'boc', name: 'VfL Bochum', short_name: 'BOC', logo: 'https://tmssl.akamaized.net/images/wappen/head/80.png' },
  { id: 'hei', name: 'FC Heidenheim', short_name: 'HEI', logo: 'https://tmssl.akamaized.net/images/wappen/head/2036.png' },
  { id: 'fch', name: 'FC St. Pauli', short_name: 'STP', logo: 'https://tmssl.akamaized.net/images/wappen/head/35.png' },
  { id: 'ksc', name: 'Holstein Kiel', short_name: 'KIE', logo: 'https://tmssl.akamaized.net/images/wappen/head/72.png' },
]

function teamById(id: string): MockTeam {
  return mockTeams.find(t => t.id === id)!
}

// ============================================
// HELPER
// ============================================

interface PlayerInput {
  id: string
  name: string
  position: number
  age: number
  teamId: string
  status: PlayerStatus
  statusNote?: string | null
  expectedReturn?: string | null
  marketValue: number
  valueChange1d: number
  valueChange7d: number
  valueChange30d: number
  totalPoints: number
  appearances: number
  goals: number
  assists: number
  form: number            // last 5 avg
  formTrend: FormTrend
  rawPointsAvg: number
  stability: number       // std dev
  homeAvg: number
  awayAvg: number
  avgPointsWin: number
  avgPointsDraw: number
  avgPointsLoss: number
  isSetPieceTaker?: boolean
  isNewSigning?: boolean
  isComeback?: boolean
  rotationRisk?: boolean
}

function createPlayer(p: PlayerInput): MarketPlayer {
  const team = teamById(p.teamId)
  const mvM = p.marketValue / 1_000_000
  const avgPoints = p.appearances > 0 ? Math.round((p.totalPoints / p.appearances) * 10) / 10 : 0
  const ppm = mvM > 0 ? Math.round((p.totalPoints / mvM) * 10) / 10 : 0
  const totalMinutes = p.appearances * 78 // rough avg minutes per game
  const pointsPerMinute = totalMinutes > 0 ? Math.round((p.totalPoints / totalMinutes) * 1000) / 1000 : 0

  const pctOf = (change: number, base: number) =>
    base !== 0 ? Math.round((change / (base - change)) * 10000) / 100 : 0

  return {
    id: p.id,
    name: p.name,
    position: p.position,
    age: p.age,
    team_id: team.id,
    team_name: team.name,
    team_short_name: team.short_name,
    team_logo: team.logo,
    profile_image: `https://i.pravatar.cc/150?u=${p.id}`,
    status: p.status,
    status_note: p.statusNote ?? null,
    expected_return: p.expectedReturn ?? null,
    market_value: p.marketValue,
    value_change_1d: p.valueChange1d,
    value_change_7d: p.valueChange7d,
    value_change_30d: p.valueChange30d,
    value_change_1d_pct: pctOf(p.valueChange1d, p.marketValue),
    value_change_7d_pct: pctOf(p.valueChange7d, p.marketValue),
    value_change_30d_pct: pctOf(p.valueChange30d, p.marketValue),
    friday_projection: Math.round(p.marketValue + p.valueChange1d * 3),
    total_points: p.totalPoints,
    avg_points: avgPoints,
    appearances: p.appearances,
    goals: p.goals,
    assists: p.assists,
    ppm,
    form: p.form,
    season_avg: avgPoints,
    form_trend: p.formTrend,
    raw_points_avg: p.rawPointsAvg,
    stability: p.stability,
    points_per_minute: pointsPerMinute,
    home_avg: p.homeAvg,
    away_avg: p.awayAvg,
    avg_points_win: p.avgPointsWin,
    avg_points_draw: p.avgPointsDraw,
    avg_points_loss: p.avgPointsLoss,
    result_sensitivity: avgPoints > 0
      ? Math.round(((p.avgPointsWin - p.avgPointsLoss) / avgPoints) * 100)
      : 0,
    is_set_piece_taker: p.isSetPieceTaker ?? false,
    is_new_signing: p.isNewSigning ?? false,
    is_comeback: p.isComeback ?? false,
    rotation_risk: p.rotationRisk ?? false,
  }
}

// ============================================
// MOCK PLAYERS (30 across all positions)
// ============================================

export const mockMarketPlayers: MarketPlayer[] = [
  // ── Goalkeepers (4) ──────────────────────────
  createPlayer({
    id: 'gk1', name: 'Manuel Neuer', position: 1, age: 38,
    teamId: 'fcb', status: 'injured', statusNote: 'Thigh injury', expectedReturn: '2025-02-10',
    marketValue: 8_500_000, valueChange1d: -150_000, valueChange7d: -800_000, valueChange30d: -2_100_000,
    totalPoints: 312, appearances: 14, goals: 0, assists: 0,
    form: 18.3, formTrend: 'falling', rawPointsAvg: 18.5, stability: 8.2,
    homeAvg: 24.0, awayAvg: 20.6, avgPointsWin: 26, avgPointsDraw: 22, avgPointsLoss: 14,
    rotationRisk: false,
  }),
  createPlayer({
    id: 'gk-kobel', name: 'Gregor Kobel', position: 1, age: 26,
    teamId: 'bvb', status: 'fit',
    marketValue: 12_000_000, valueChange1d: 80_000, valueChange7d: 450_000, valueChange30d: 1_200_000,
    totalPoints: 398, appearances: 17, goals: 0, assists: 0,
    form: 24.8, formTrend: 'rising_slight', rawPointsAvg: 20.1, stability: 6.4,
    homeAvg: 26.2, awayAvg: 22.1, avgPointsWin: 28, avgPointsDraw: 24, avgPointsLoss: 16,
  }),
  createPlayer({
    id: 'gk-trapp', name: 'Kevin Trapp', position: 1, age: 34,
    teamId: 'sge', status: 'fit',
    marketValue: 5_200_000, valueChange1d: -30_000, valueChange7d: -120_000, valueChange30d: -340_000,
    totalPoints: 278, appearances: 16, goals: 0, assists: 0,
    form: 16.2, formTrend: 'stable', rawPointsAvg: 15.8, stability: 7.8,
    homeAvg: 18.4, awayAvg: 14.0, avgPointsWin: 21, avgPointsDraw: 17, avgPointsLoss: 11,
  }),
  createPlayer({
    id: 'gk-hradecky', name: 'Lukáš Hrádecký', position: 1, age: 35,
    teamId: 'b04', status: 'fit',
    marketValue: 7_800_000, valueChange1d: 60_000, valueChange7d: 380_000, valueChange30d: 900_000,
    totalPoints: 356, appearances: 17, goals: 0, assists: 0,
    form: 22.1, formTrend: 'rising', rawPointsAvg: 19.2, stability: 5.9,
    homeAvg: 23.4, awayAvg: 18.6, avgPointsWin: 25, avgPointsDraw: 21, avgPointsLoss: 14,
  }),

  // ── Defenders (8) ────────────────────────────
  createPlayer({
    id: 'df-frimpong', name: 'Jeremie Frimpong', position: 2, age: 23,
    teamId: 'b04', status: 'fit',
    marketValue: 22_000_000, valueChange1d: 280_000, valueChange7d: 1_800_000, valueChange30d: 4_200_000,
    totalPoints: 387, appearances: 17, goals: 2, assists: 6,
    form: 25.4, formTrend: 'rising', rawPointsAvg: 22.8, stability: 6.1,
    homeAvg: 26.8, awayAvg: 22.2, avgPointsWin: 30, avgPointsDraw: 22, avgPointsLoss: 14,
    isSetPieceTaker: false,
  }),
  createPlayer({
    id: 'df-davies', name: 'Alphonso Davies', position: 2, age: 24,
    teamId: 'fcb', status: 'fit',
    marketValue: 25_000_000, valueChange1d: -120_000, valueChange7d: -600_000, valueChange30d: -1_800_000,
    totalPoints: 312, appearances: 16, goals: 1, assists: 4,
    form: 17.8, formTrend: 'falling_slight', rawPointsAvg: 16.2, stability: 9.4,
    homeAvg: 21.2, awayAvg: 15.8, avgPointsWin: 24, avgPointsDraw: 19, avgPointsLoss: 12,
    rotationRisk: true,
  }),
  createPlayer({
    id: 'df-tah', name: 'Jonathan Tah', position: 2, age: 28,
    teamId: 'b04', status: 'fit',
    marketValue: 16_000_000, valueChange1d: 140_000, valueChange7d: 920_000, valueChange30d: 2_100_000,
    totalPoints: 298, appearances: 17, goals: 1, assists: 1,
    form: 18.6, formTrend: 'rising_slight', rawPointsAvg: 16.8, stability: 4.2,
    homeAvg: 19.0, awayAvg: 16.2, avgPointsWin: 21, avgPointsDraw: 18, avgPointsLoss: 12,
  }),
  createPlayer({
    id: 'df-schlotterbeck', name: 'Nico Schlotterbeck', position: 2, age: 25,
    teamId: 'bvb', status: 'fit',
    marketValue: 14_000_000, valueChange1d: 50_000, valueChange7d: 340_000, valueChange30d: 800_000,
    totalPoints: 256, appearances: 16, goals: 1, assists: 0,
    form: 15.2, formTrend: 'stable', rawPointsAvg: 14.6, stability: 5.8,
    homeAvg: 17.4, awayAvg: 13.0, avgPointsWin: 20, avgPointsDraw: 16, avgPointsLoss: 10,
  }),
  createPlayer({
    id: 'df-ndicka', name: 'Evan Ndicka', position: 2, age: 24,
    teamId: 'sge', status: 'suspended', statusNote: 'Red card suspension',
    marketValue: 11_500_000, valueChange1d: -80_000, valueChange7d: -450_000, valueChange30d: -1_200_000,
    totalPoints: 198, appearances: 14, goals: 0, assists: 1,
    form: 12.8, formTrend: 'falling_slight', rawPointsAvg: 12.4, stability: 7.1,
    homeAvg: 15.2, awayAvg: 10.8, avgPointsWin: 18, avgPointsDraw: 14, avgPointsLoss: 9,
  }),
  createPlayer({
    id: 'df-raum', name: 'David Raum', position: 2, age: 26,
    teamId: 'rbl', status: 'fit',
    marketValue: 13_200_000, valueChange1d: 100_000, valueChange7d: 720_000, valueChange30d: 1_600_000,
    totalPoints: 267, appearances: 16, goals: 0, assists: 5,
    form: 18.2, formTrend: 'rising_slight', rawPointsAvg: 15.6, stability: 6.8,
    homeAvg: 19.6, awayAvg: 15.0, avgPointsWin: 22, avgPointsDraw: 16, avgPointsLoss: 10,
    isSetPieceTaker: true,
  }),
  createPlayer({
    id: 'df-anton', name: 'Waldemar Anton', position: 2, age: 28,
    teamId: 'bvb', status: 'doubt', statusNote: 'Muscle tightness',
    marketValue: 9_800_000, valueChange1d: -40_000, valueChange7d: -280_000, valueChange30d: -600_000,
    totalPoints: 201, appearances: 15, goals: 1, assists: 0,
    form: 12.4, formTrend: 'stable', rawPointsAvg: 12.2, stability: 5.4,
    homeAvg: 14.2, awayAvg: 11.0, avgPointsWin: 17, avgPointsDraw: 13, avgPointsLoss: 9,
  }),
  createPlayer({
    id: 'df-mittelstaedt', name: 'Maximilian Mittelstädt', position: 2, age: 27,
    teamId: 'vfb', status: 'fit',
    marketValue: 8_600_000, valueChange1d: 90_000, valueChange7d: 560_000, valueChange30d: 1_400_000,
    totalPoints: 234, appearances: 16, goals: 0, assists: 4,
    form: 16.1, formTrend: 'rising', rawPointsAvg: 14.2, stability: 5.2,
    homeAvg: 17.8, awayAvg: 12.4, avgPointsWin: 19, avgPointsDraw: 14, avgPointsLoss: 9,
    isNewSigning: true,
  }),

  // ── Midfielders (10) ─────────────────────────
  createPlayer({
    id: 'mf1', name: 'Florian Wirtz', position: 3, age: 21,
    teamId: 'b04', status: 'fit',
    marketValue: 128_500_000, valueChange1d: 320_000, valueChange7d: 2_340_000, valueChange30d: 8_200_000,
    totalPoints: 847, appearances: 16, goals: 11, assists: 8,
    form: 61.3, formTrend: 'rising', rawPointsAvg: 38.2, stability: 12.4,
    homeAvg: 57.0, awayAvg: 48.9, avgPointsWin: 68, avgPointsDraw: 48, avgPointsLoss: 32,
    isSetPieceTaker: true,
  }),
  createPlayer({
    id: 'mf-musiala', name: 'Jamal Musiala', position: 3, age: 21,
    teamId: 'fcb', status: 'fit',
    marketValue: 118_000_000, valueChange1d: 210_000, valueChange7d: 1_450_000, valueChange30d: 5_800_000,
    totalPoints: 798, appearances: 17, goals: 9, assists: 10,
    form: 49.2, formTrend: 'rising_slight', rawPointsAvg: 34.1, stability: 11.8,
    homeAvg: 52.4, awayAvg: 44.8, avgPointsWin: 62, avgPointsDraw: 44, avgPointsLoss: 28,
  }),
  createPlayer({
    id: 'mf-simons', name: 'Xavi Simons', position: 3, age: 21,
    teamId: 'rbl', status: 'fit',
    marketValue: 52_000_000, valueChange1d: 130_000, valueChange7d: 890_000, valueChange30d: 3_200_000,
    totalPoints: 534, appearances: 17, goals: 7, assists: 5,
    form: 33.8, formTrend: 'rising_slight', rawPointsAvg: 26.4, stability: 9.6,
    homeAvg: 36.2, awayAvg: 28.4, avgPointsWin: 42, avgPointsDraw: 30, avgPointsLoss: 18,
    isSetPieceTaker: true,
  }),
  createPlayer({
    id: 'mf-xhaka', name: 'Granit Xhaka', position: 3, age: 32,
    teamId: 'b04', status: 'fit',
    marketValue: 15_000_000, valueChange1d: 20_000, valueChange7d: 180_000, valueChange30d: 420_000,
    totalPoints: 412, appearances: 17, goals: 2, assists: 3,
    form: 24.8, formTrend: 'stable', rawPointsAvg: 22.6, stability: 4.8,
    homeAvg: 25.6, awayAvg: 22.8, avgPointsWin: 28, avgPointsDraw: 24, avgPointsLoss: 18,
    isSetPieceTaker: true,
  }),
  createPlayer({
    id: 'mf-kimmich', name: 'Joshua Kimmich', position: 3, age: 29,
    teamId: 'fcb', status: 'fit',
    marketValue: 20_000_000, valueChange1d: -60_000, valueChange7d: -340_000, valueChange30d: -800_000,
    totalPoints: 367, appearances: 17, goals: 1, assists: 4,
    form: 20.6, formTrend: 'falling_slight', rawPointsAvg: 19.8, stability: 5.6,
    homeAvg: 22.4, awayAvg: 18.8, avgPointsWin: 26, avgPointsDraw: 21, avgPointsLoss: 15,
    isSetPieceTaker: true, rotationRisk: true,
  }),
  createPlayer({
    id: 'mf-sane', name: 'Leroy Sané', position: 3, age: 29,
    teamId: 'fcb', status: 'injured', statusNote: 'Knee injury', expectedReturn: '2025-03-01',
    marketValue: 24_800_000, valueChange1d: -320_000, valueChange7d: -1_900_000, valueChange30d: -5_600_000,
    totalPoints: 245, appearances: 13, goals: 3, assists: 2,
    form: 16.4, formTrend: 'falling', rawPointsAvg: 14.8, stability: 11.2,
    homeAvg: 20.8, awayAvg: 14.2, avgPointsWin: 28, avgPointsDraw: 16, avgPointsLoss: 8,
  }),
  createPlayer({
    id: 'mf-brandt', name: 'Julian Brandt', position: 3, age: 28,
    teamId: 'bvb', status: 'fit',
    marketValue: 16_500_000, valueChange1d: 90_000, valueChange7d: 620_000, valueChange30d: 1_800_000,
    totalPoints: 389, appearances: 17, goals: 4, assists: 7,
    form: 24.2, formTrend: 'rising_slight', rawPointsAvg: 20.4, stability: 7.2,
    homeAvg: 26.0, awayAvg: 21.8, avgPointsWin: 30, avgPointsDraw: 22, avgPointsLoss: 14,
    isSetPieceTaker: true,
  }),
  createPlayer({
    id: 'mf-grimaldo', name: 'Alejandro Grimaldo', position: 3, age: 29,
    teamId: 'b04', status: 'fit',
    marketValue: 19_200_000, valueChange1d: 160_000, valueChange7d: 1_100_000, valueChange30d: 3_400_000,
    totalPoints: 423, appearances: 17, goals: 3, assists: 8,
    form: 27.6, formTrend: 'rising', rawPointsAvg: 21.8, stability: 6.4,
    homeAvg: 28.4, awayAvg: 24.2, avgPointsWin: 32, avgPointsDraw: 24, avgPointsLoss: 14,
    isSetPieceTaker: true,
  }),
  createPlayer({
    id: 'mf-sabitzer', name: 'Marcel Sabitzer', position: 3, age: 30,
    teamId: 'bvb', status: 'fit',
    marketValue: 8_400_000, valueChange1d: 40_000, valueChange7d: 280_000, valueChange30d: 680_000,
    totalPoints: 312, appearances: 16, goals: 3, assists: 2,
    form: 19.8, formTrend: 'stable', rawPointsAvg: 18.4, stability: 5.0,
    homeAvg: 21.2, awayAvg: 17.4, avgPointsWin: 24, avgPointsDraw: 19, avgPointsLoss: 13,
  }),
  createPlayer({
    id: 'mf-laimer', name: 'Konrad Laimer', position: 3, age: 27,
    teamId: 'fcb', status: 'fit',
    marketValue: 9_200_000, valueChange1d: -30_000, valueChange7d: -220_000, valueChange30d: -480_000,
    totalPoints: 198, appearances: 15, goals: 0, assists: 1,
    form: 11.8, formTrend: 'falling_slight', rawPointsAvg: 11.2, stability: 4.4,
    homeAvg: 14.0, awayAvg: 10.6, avgPointsWin: 16, avgPointsDraw: 13, avgPointsLoss: 9,
    rotationRisk: true,
  }),

  // ── Forwards (8) ─────────────────────────────
  createPlayer({
    id: 'fw1', name: 'Harry Kane', position: 4, age: 31,
    teamId: 'fcb', status: 'fit',
    marketValue: 145_000_000, valueChange1d: -180_000, valueChange7d: -1_200_000, valueChange30d: 2_500_000,
    totalPoints: 762, appearances: 17, goals: 18, assists: 6,
    form: 41.0, formTrend: 'stable', rawPointsAvg: 32.5, stability: 10.8,
    homeAvg: 46.7, awayAvg: 42.8, avgPointsWin: 58, avgPointsDraw: 40, avgPointsLoss: 24,
    isSetPieceTaker: true,
  }),
  createPlayer({
    id: 'fw-guirassy', name: 'Serhou Guirassy', position: 4, age: 28,
    teamId: 'bvb', status: 'fit',
    marketValue: 19_500_000, valueChange1d: -140_000, valueChange7d: -980_000, valueChange30d: -2_800_000,
    totalPoints: 287, appearances: 15, goals: 8, assists: 2,
    form: 17.4, formTrend: 'falling_slight', rawPointsAvg: 15.2, stability: 9.8,
    homeAvg: 22.0, awayAvg: 14.6, avgPointsWin: 28, avgPointsDraw: 18, avgPointsLoss: 8,
    isComeback: true, // returned from earlier injury
  }),
  createPlayer({
    id: 'fw-boniface', name: 'Victor Boniface', position: 4, age: 23,
    teamId: 'b04', status: 'fit',
    marketValue: 21_000_000, valueChange1d: 240_000, valueChange7d: 1_650_000, valueChange30d: 4_800_000,
    totalPoints: 398, appearances: 14, goals: 10, assists: 3,
    form: 31.2, formTrend: 'rising', rawPointsAvg: 24.6, stability: 10.2,
    homeAvg: 32.8, awayAvg: 26.4, avgPointsWin: 38, avgPointsDraw: 26, avgPointsLoss: 14,
    isComeback: true,
  }),
  createPlayer({
    id: 'fw-openda', name: 'Loïs Openda', position: 4, age: 25,
    teamId: 'rbl', status: 'fit',
    marketValue: 18_000_000, valueChange1d: 60_000, valueChange7d: 420_000, valueChange30d: 1_200_000,
    totalPoints: 345, appearances: 17, goals: 9, assists: 4,
    form: 21.4, formTrend: 'rising_slight', rawPointsAvg: 17.8, stability: 7.6,
    homeAvg: 23.0, awayAvg: 18.2, avgPointsWin: 28, avgPointsDraw: 19, avgPointsLoss: 10,
  }),
  createPlayer({
    id: 'fw-fullkrug', name: 'Niclas Füllkrug', position: 4, age: 31,
    teamId: 'bvb', status: 'injured', statusNote: 'Achilles tendon', expectedReturn: '2025-03-15',
    marketValue: 15_800_000, valueChange1d: -380_000, valueChange7d: -2_100_000, valueChange30d: -6_200_000,
    totalPoints: 156, appearances: 11, goals: 4, assists: 1,
    form: 11.2, formTrend: 'falling', rawPointsAvg: 10.8, stability: 8.6,
    homeAvg: 16.4, awayAvg: 10.2, avgPointsWin: 22, avgPointsDraw: 12, avgPointsLoss: 6,
  }),
  createPlayer({
    id: 'fw-ekitike', name: 'Hugo Ekitiké', position: 4, age: 22,
    teamId: 'sge', status: 'fit',
    marketValue: 14_200_000, valueChange1d: 200_000, valueChange7d: 1_340_000, valueChange30d: 3_800_000,
    totalPoints: 356, appearances: 16, goals: 8, assists: 5,
    form: 24.6, formTrend: 'rising', rawPointsAvg: 19.2, stability: 8.4,
    homeAvg: 26.2, awayAvg: 20.8, avgPointsWin: 30, avgPointsDraw: 20, avgPointsLoss: 12,
    isNewSigning: true,
  }),
  createPlayer({
    id: 'fw-undav', name: 'Deniz Undav', position: 4, age: 28,
    teamId: 'vfb', status: 'fit',
    marketValue: 11_800_000, valueChange1d: 110_000, valueChange7d: 780_000, valueChange30d: 2_200_000,
    totalPoints: 312, appearances: 16, goals: 7, assists: 3,
    form: 20.8, formTrend: 'rising_slight', rawPointsAvg: 16.4, stability: 6.8,
    homeAvg: 22.4, awayAvg: 17.2, avgPointsWin: 26, avgPointsDraw: 18, avgPointsLoss: 10,
    isNewSigning: true,
  }),
  createPlayer({
    id: 'fw-burkardt', name: 'Jonathan Burkardt', position: 4, age: 24,
    teamId: 'm05', status: 'fit',
    marketValue: 7_400_000, valueChange1d: 140_000, valueChange7d: 920_000, valueChange30d: 2_600_000,
    totalPoints: 289, appearances: 17, goals: 9, assists: 2,
    form: 18.6, formTrend: 'rising', rawPointsAvg: 14.8, stability: 7.4,
    homeAvg: 20.2, awayAvg: 15.8, avgPointsWin: 24, avgPointsDraw: 16, avgPointsLoss: 8,
    isSetPieceTaker: true,
  }),
]

// ============================================
// MATCHUP DATA (fixtures, vulnerability, clean sheets)
// ============================================

export interface Fixture {
  matchday: number
  opponent_id: string
  opponent_name: string
  opponent_short: string
  opponent_logo: string
  is_home: boolean
  difficulty: number // 1 (easy) to 5 (hard)
}

export interface TeamMatchupData {
  team_id: string
  team_name: string
  team_short: string
  team_logo: string
  // Points conceded to positions (avg per game)
  points_conceded_def: number
  points_conceded_mid: number
  points_conceded_fwd: number
  // Clean sheet probability (0-100%)
  clean_sheet_pct: number
  // Next 5 fixtures
  fixtures: Fixture[]
}

// Difficulty ratings: 1=very easy, 2=easy, 3=medium, 4=hard, 5=very hard
function getTeamDifficulty(teamId: string): number {
  const ratings: Record<string, number> = {
    'fcb': 5, 'b04': 5, 'bvb': 4, 'rbl': 4, 'vfb': 3,
    'sge': 3, 'scf': 3, 'tsg': 3, 'wob': 3, 'bmg': 3,
    'svw': 2, 'fcu': 2, 'fca': 2, 'm05': 2, 'boc': 1,
    'hei': 1, 'fch': 1, 'ksc': 1,
  }
  return ratings[teamId] ?? 3
}

function createFixtures(teamId: string): Fixture[] {
  // Simplified schedule - each team gets 5 upcoming opponents
  const schedules: Record<string, Array<{ opp: string; home: boolean }>> = {
    'fcb': [{ opp: 'boc', home: true }, { opp: 'bvb', home: false }, { opp: 'scf', home: true }, { opp: 'rbl', home: false }, { opp: 'svw', home: true }],
    'bvb': [{ opp: 'hei', home: true }, { opp: 'fcb', home: true }, { opp: 'm05', home: false }, { opp: 'sge', home: true }, { opp: 'b04', home: false }],
    'b04': [{ opp: 'ksc', home: true }, { opp: 'fcu', home: false }, { opp: 'tsg', home: true }, { opp: 'wob', home: false }, { opp: 'bvb', home: true }],
    'rbl': [{ opp: 'fca', home: true }, { opp: 'bmg', home: false }, { opp: 'boc', home: true }, { opp: 'fcb', home: true }, { opp: 'scf', home: false }],
    'vfb': [{ opp: 'svw', home: true }, { opp: 'hei', home: false }, { opp: 'fcu', home: true }, { opp: 'm05', home: false }, { opp: 'tsg', home: true }],
    'sge': [{ opp: 'wob', home: true }, { opp: 'ksc', home: false }, { opp: 'bmg', home: true }, { opp: 'bvb', home: false }, { opp: 'fca', home: true }],
    'scf': [{ opp: 'tsg', home: true }, { opp: 'fch', home: false }, { opp: 'fcb', home: false }, { opp: 'hei', home: true }, { opp: 'rbl', home: true }],
    'tsg': [{ opp: 'scf', home: false }, { opp: 'svw', home: true }, { opp: 'b04', home: false }, { opp: 'ksc', home: true }, { opp: 'vfb', home: false }],
    'wob': [{ opp: 'sge', home: false }, { opp: 'm05', home: true }, { opp: 'fch', home: false }, { opp: 'b04', home: true }, { opp: 'boc', home: false }],
    'bmg': [{ opp: 'm05', home: true }, { opp: 'rbl', home: true }, { opp: 'sge', home: false }, { opp: 'svw', home: true }, { opp: 'hei', home: false }],
    'svw': [{ opp: 'vfb', home: false }, { opp: 'tsg', home: false }, { opp: 'ksc', home: true }, { opp: 'bmg', home: false }, { opp: 'fcb', home: false }],
    'fcu': [{ opp: 'fch', home: true }, { opp: 'b04', home: true }, { opp: 'vfb', home: false }, { opp: 'fca', home: true }, { opp: 'm05', home: false }],
    'fca': [{ opp: 'rbl', home: false }, { opp: 'boc', home: true }, { opp: 'hei', home: false }, { opp: 'fcu', home: false }, { opp: 'sge', home: false }],
    'm05': [{ opp: 'bmg', home: false }, { opp: 'wob', home: false }, { opp: 'bvb', home: true }, { opp: 'vfb', home: true }, { opp: 'fcu', home: true }],
    'boc': [{ opp: 'fcb', home: false }, { opp: 'fca', home: false }, { opp: 'rbl', home: false }, { opp: 'fch', home: true }, { opp: 'wob', home: true }],
    'hei': [{ opp: 'bvb', home: false }, { opp: 'vfb', home: true }, { opp: 'fca', home: true }, { opp: 'scf', home: false }, { opp: 'bmg', home: true }],
    'fch': [{ opp: 'fcu', home: false }, { opp: 'scf', home: true }, { opp: 'wob', home: true }, { opp: 'boc', home: false }, { opp: 'ksc', home: true }],
    'ksc': [{ opp: 'b04', home: false }, { opp: 'sge', home: true }, { opp: 'svw', home: false }, { opp: 'tsg', home: false }, { opp: 'fch', home: false }],
  }

  const schedule = schedules[teamId] ?? []
  return schedule.map((s, idx) => {
    const opp = mockTeams.find(t => t.id === s.opp)!
    return {
      matchday: 19 + idx, // Starting from matchday 19
      opponent_id: opp.id,
      opponent_name: opp.name,
      opponent_short: opp.short_name,
      opponent_logo: opp.logo,
      is_home: s.home,
      difficulty: getTeamDifficulty(opp.id),
    }
  })
}

export const mockTeamMatchups: TeamMatchupData[] = [
  // Top teams - harder to score against, higher clean sheet %
  {
    team_id: 'fcb', team_name: 'Bayern München', team_short: 'FCB',
    team_logo: 'https://tmssl.akamaized.net/images/wappen/head/27.png',
    points_conceded_def: 14.2, points_conceded_mid: 22.8, points_conceded_fwd: 18.4,
    clean_sheet_pct: 42,
    fixtures: createFixtures('fcb'),
  },
  {
    team_id: 'b04', team_name: 'Bayer Leverkusen', team_short: 'B04',
    team_logo: 'https://tmssl.akamaized.net/images/wappen/head/15.png',
    points_conceded_def: 13.8, points_conceded_mid: 21.2, points_conceded_fwd: 16.8,
    clean_sheet_pct: 48,
    fixtures: createFixtures('b04'),
  },
  {
    team_id: 'bvb', team_name: 'Borussia Dortmund', team_short: 'BVB',
    team_logo: 'https://tmssl.akamaized.net/images/wappen/head/16.png',
    points_conceded_def: 16.4, points_conceded_mid: 26.2, points_conceded_fwd: 22.6,
    clean_sheet_pct: 28,
    fixtures: createFixtures('bvb'),
  },
  {
    team_id: 'rbl', team_name: 'RB Leipzig', team_short: 'RBL',
    team_logo: 'https://tmssl.akamaized.net/images/wappen/head/23826.png',
    points_conceded_def: 15.6, points_conceded_mid: 24.8, points_conceded_fwd: 20.2,
    clean_sheet_pct: 35,
    fixtures: createFixtures('rbl'),
  },
  {
    team_id: 'vfb', team_name: 'VfB Stuttgart', team_short: 'VFB',
    team_logo: 'https://tmssl.akamaized.net/images/wappen/head/79.png',
    points_conceded_def: 17.2, points_conceded_mid: 27.4, points_conceded_fwd: 24.8,
    clean_sheet_pct: 22,
    fixtures: createFixtures('vfb'),
  },
  // Mid-table teams
  {
    team_id: 'sge', team_name: 'Eintracht Frankfurt', team_short: 'SGE',
    team_logo: 'https://tmssl.akamaized.net/images/wappen/head/24.png',
    points_conceded_def: 18.4, points_conceded_mid: 28.6, points_conceded_fwd: 26.2,
    clean_sheet_pct: 18,
    fixtures: createFixtures('sge'),
  },
  {
    team_id: 'scf', team_name: 'SC Freiburg', team_short: 'SCF',
    team_logo: 'https://tmssl.akamaized.net/images/wappen/head/60.png',
    points_conceded_def: 16.8, points_conceded_mid: 25.4, points_conceded_fwd: 21.8,
    clean_sheet_pct: 26,
    fixtures: createFixtures('scf'),
  },
  {
    team_id: 'tsg', team_name: 'TSG Hoffenheim', team_short: 'TSG',
    team_logo: 'https://tmssl.akamaized.net/images/wappen/head/533.png',
    points_conceded_def: 19.2, points_conceded_mid: 29.8, points_conceded_fwd: 27.4,
    clean_sheet_pct: 14,
    fixtures: createFixtures('tsg'),
  },
  {
    team_id: 'wob', team_name: 'VfL Wolfsburg', team_short: 'WOB',
    team_logo: 'https://tmssl.akamaized.net/images/wappen/head/82.png',
    points_conceded_def: 17.8, points_conceded_mid: 27.2, points_conceded_fwd: 24.2,
    clean_sheet_pct: 20,
    fixtures: createFixtures('wob'),
  },
  {
    team_id: 'bmg', team_name: 'Bor. Mönchengladbach', team_short: 'BMG',
    team_logo: 'https://tmssl.akamaized.net/images/wappen/head/18.png',
    points_conceded_def: 18.8, points_conceded_mid: 29.2, points_conceded_fwd: 26.8,
    clean_sheet_pct: 16,
    fixtures: createFixtures('bmg'),
  },
  {
    team_id: 'svw', team_name: 'Werder Bremen', team_short: 'SVW',
    team_logo: 'https://tmssl.akamaized.net/images/wappen/head/86.png',
    points_conceded_def: 19.6, points_conceded_mid: 30.4, points_conceded_fwd: 28.2,
    clean_sheet_pct: 12,
    fixtures: createFixtures('svw'),
  },
  {
    team_id: 'fcu', team_name: 'Union Berlin', team_short: 'FCU',
    team_logo: 'https://tmssl.akamaized.net/images/wappen/head/89.png',
    points_conceded_def: 17.4, points_conceded_mid: 26.6, points_conceded_fwd: 23.4,
    clean_sheet_pct: 24,
    fixtures: createFixtures('fcu'),
  },
  {
    team_id: 'fca', team_name: 'FC Augsburg', team_short: 'FCA',
    team_logo: 'https://tmssl.akamaized.net/images/wappen/head/167.png',
    points_conceded_def: 20.2, points_conceded_mid: 31.2, points_conceded_fwd: 29.4,
    clean_sheet_pct: 10,
    fixtures: createFixtures('fca'),
  },
  {
    team_id: 'm05', team_name: 'Mainz 05', team_short: 'M05',
    team_logo: 'https://tmssl.akamaized.net/images/wappen/head/39.png',
    points_conceded_def: 18.2, points_conceded_mid: 28.4, points_conceded_fwd: 25.6,
    clean_sheet_pct: 18,
    fixtures: createFixtures('m05'),
  },
  // Bottom teams - easier to score against, lower clean sheet %
  {
    team_id: 'boc', team_name: 'VfL Bochum', team_short: 'BOC',
    team_logo: 'https://tmssl.akamaized.net/images/wappen/head/80.png',
    points_conceded_def: 22.4, points_conceded_mid: 34.8, points_conceded_fwd: 32.6,
    clean_sheet_pct: 6,
    fixtures: createFixtures('boc'),
  },
  {
    team_id: 'hei', team_name: 'FC Heidenheim', team_short: 'HEI',
    team_logo: 'https://tmssl.akamaized.net/images/wappen/head/2036.png',
    points_conceded_def: 21.8, points_conceded_mid: 33.6, points_conceded_fwd: 31.2,
    clean_sheet_pct: 8,
    fixtures: createFixtures('hei'),
  },
  {
    team_id: 'fch', team_name: 'FC St. Pauli', team_short: 'STP',
    team_logo: 'https://tmssl.akamaized.net/images/wappen/head/35.png',
    points_conceded_def: 21.2, points_conceded_mid: 32.8, points_conceded_fwd: 30.4,
    clean_sheet_pct: 10,
    fixtures: createFixtures('fch'),
  },
  {
    team_id: 'ksc', team_name: 'Holstein Kiel', team_short: 'KIE',
    team_logo: 'https://tmssl.akamaized.net/images/wappen/head/72.png',
    points_conceded_def: 23.6, points_conceded_mid: 36.2, points_conceded_fwd: 34.8,
    clean_sheet_pct: 4,
    fixtures: createFixtures('ksc'),
  },
]
