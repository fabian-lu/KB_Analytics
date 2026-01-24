/**
 * Types for authentication.
 */

export interface User {
  id: string
  name: string
  email: string
  profile_image_url: string | null
}

export interface League {
  id: string
  name: string
}

export interface LoginResponse {
  token: string
  user: User
  leagues: League[]
}
