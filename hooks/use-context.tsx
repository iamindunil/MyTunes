"use client"

import { createContext, useContext } from "react"

/* ---------------- Types ---------------- */

interface MusicContextType {
  current: number
  setCurrent: (time: number) => void
  downloadProgress: number
  setDownloadProgress: (value: number) => void
}

interface NextMusicContextType {
  nextData: {
    id: string
    name: string
    artist: string
    image: string
  } | null
}

/* ---------------- Contexts ---------------- */

export const MusicContext = createContext<MusicContextType | null>(null)
export const NextMusicContext =
  createContext<NextMusicContextType | null>(null)

/* ---------------- Hooks ---------------- */

export function useMusicProvider(): MusicContextType {
  const context = useContext(MusicContext)
  if (!context) {
    throw new Error("useMusicProvider must be used inside MusicProvider")
  }
  return context
}

export function useNextMusicProvider(): NextMusicContextType {
  const context = useContext(NextMusicContext)
  if (!context) {
    throw new Error("useNextMusicProvider must be used inside NextMusicProvider")
  }
  return context
}
