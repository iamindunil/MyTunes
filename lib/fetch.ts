const api_url = process.env.NEXT_PUBLIC_API_URL

if (!api_url) {
  throw new Error("Missing NEXT_PUBLIC_API_URL environment variable")
}

/* ---------------- Shared Types ---------------- */

export interface Song {
  id: string
  name: string
  image: { url: string }[]
  artists: {
    primary: { name: string }[]
  }
  downloadUrl?: { url: string }[]
}

export interface SongsResponse {
  data: Song[]
}

export interface SearchResponse {
  data: {
    results: Song[]
  }
}

/* ---------------- Helpers ---------------- */

async function safeFetch(url: string): Promise<Response | null> {
  try {
    const res = await fetch(url, { cache: "no-store" })
    if (!res.ok) return null
    return res
  } catch (error) {
    console.error("Fetch error:", error)
    return null
  }
}

/* ---------------- API Methods ---------------- */

export async function getSongsByQuery(
  query: string
): Promise<Response | null> {
  if (!query.trim()) return null
  return safeFetch(`${api_url}search/songs?query=${encodeURIComponent(query)}`)
}

export async function getSongsById(
  id: string
): Promise<Response | null> {
  if (!id) return null
  return safeFetch(`${api_url}songs/${id}`)
}

export async function getSongsSuggestions(
  id: string
): Promise<Response | null> {
  if (!id) return null
  return safeFetch(`${api_url}songs/${id}/suggestions`)
}

export async function searchAlbumByQuery(
  query: string
): Promise<Response | null> {
  if (!query.trim()) return null
  return safeFetch(`${api_url}search/albums?query=${encodeURIComponent(query)}`)
}

export async function getAlbumById(
  id: string
): Promise<Response | null> {
  if (!id) return null
  return safeFetch(`${api_url}albums?id=${id}`)
}
