/**
 * Authentication API endpoints.
 */

import { api } from './client'
import type { LoginResponse } from '@/types'

export async function login({ email, password }: { email: string; password: string }) {
  return api<LoginResponse>('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
}
