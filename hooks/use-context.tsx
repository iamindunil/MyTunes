"use client"

import { createContext, useContext } from "react"

export const MusicContext = createContext<any>(null)
export const NextMusicContext = createContext<any>(null)

export function useMusicProvider() {
  return useContext(MusicContext)
}

export function useNextMusicProvider() {
  return useContext(NextMusicContext)
}
