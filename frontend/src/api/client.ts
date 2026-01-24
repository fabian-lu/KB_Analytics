/**
 * Generic fetch wrapper for API calls.
 */

export async function api<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(endpoint, options)

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json()
}
