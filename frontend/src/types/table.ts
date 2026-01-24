/**
 * Types for Bundesliga table endpoint.
 */

export interface TeamStanding {
  position: number
  team_name: string
  short_name: string
  team_icon_url: string
  points: number
  matches: number
  won: number
  draw: number
  lost: number
  goals: number
  opponent_goals: number
  goal_diff: number
}

export interface TableResponse {
  season: string
  standings: TeamStanding[]
}
