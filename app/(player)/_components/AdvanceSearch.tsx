"use client"


import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza"
import { ScrollArea } from "@/components/ui/scroll-area"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getSongsByQuery } from "@/lib/fetch"
import { Loader, Play, Search, SearchIcon } from "lucide-react"

/* ---------------- Types ---------------- */

interface Song {
  id: string
  name: string
  image: {
    url: string
  }[]
  artists: {
    primary: {
      name: string
    }[]
  }
}

/* ---------------- Component ---------------- */

export default function AdvanceSearch() {
  const [query, setQuery] = useState<string>("")
  const [data, setData] = useState<Song[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const getSongs = async (): Promise<void> => {
    if (!query.trim()) {
      setData([])
      return
    }

    setLoading(true)

    try {
      const response = await getSongsByQuery(query)
      if (!response) {
        setData([])
        return
      }

      const result = await response.json()

      if (result?.data?.results) {
        setData(result.data.results as Song[])
      } else {
        setData([])
      }
    } catch (error) {
      setData([])
    } finally {
      setLoading(false)
    }
  }

  /* ---------------- Debounce search ---------------- */

  useEffect(() => {
    if (!query) {
      setData([])
      return
    }

    const handler = setTimeout(() => {
      getSongs()
    }, 400)

    return () => clearTimeout(handler)
  }, [query])

  /* ---------------- UI ---------------- */

  return (
    <div className="px-6 !-mb-3 md:px-20 lg:px-32">
      <Credenza>
        {/* Trigger */}
        <CredenzaTrigger asChild>
          <div className="flex items-center relative z-10 w-full cursor-pointer">
            <div className="flex bg-secondary/50 text-foreground/80 items-center h-10 w-full rounded-lg border border-border px-3 text-sm">
              Look for songs by name...
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-0 rounded-xl rounded-l-none"
            >
              <SearchIcon className="w-4 h-4" />
            </Button>
          </div>
        </CredenzaTrigger>

        {/* Content */}
        <CredenzaContent>
          <CredenzaHeader>
            <CredenzaTitle className="flex gap-2">
              <Input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="search"
                placeholder="Search for songs by name..."
                autoComplete="off"
              />

              <Button size="icon" className="min-w-10" asChild={!!query}>
                {query ? (
                  <Link href={`/search/${query}`}>
                    <Search className="h-4 w-4" />
                  </Link>
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </CredenzaTitle>
          </CredenzaHeader>

          <CredenzaBody className="grid gap-2 mb-5 px-0">
            {/* Loading */}
            {loading && (
              <div className="flex h-[400px] items-center justify-center text-sm text-muted-foreground">
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </div>
            )}

            {/* Empty states */}
            {!loading && query && data.length === 0 && (
              <div className="flex h-[400px] items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  No results found!
                </p>
              </div>
            )}

            {!query && !loading && (
              <div className="flex h-[400px] items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  Type something to search...
                </p>
              </div>
            )}

            {/* Results */}
            {!loading && query && data.length > 0 && (
              <>
                <div className="px-4 md:px-0">
                  <h1 className="text-sm text-foreground/70">
                    Search results for{" "}
                    <span className="bg-primary/70 text-primary-foreground px-1 rounded">
                      {query}
                    </span>
                  </h1>
                </div>

                <ScrollArea className="h-[390px] px-4 md:px-0">
                  <div className="flex flex-col gap-2">
                    {data.map((song) => (
                      <Link
                        key={song.id}
                        href={`/${song.id}`}
                        className="w-full hover:bg-secondary/30 border border-border rounded-md p-3 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={song.image?.[2]?.url ?? ""}
                            alt={song.name}
                            className="bg-secondary/50 w-8 h-8 rounded-md"
                          />

                          <p className="text-sm leading-tight">
                            {song.name.length > 40
                              ? `${song.name.slice(0, 40)}...`
                              : song.name}
                            <span className="block text-muted-foreground text-xs">
                              {song.artists.primary[0]?.name ?? "Unknown"}
                            </span>
                          </p>
                        </div>

                        <Button size="icon" variant="outline">
                          <Play className="h-4 w-4" />
                        </Button>
                      </Link>
                    ))}
                  </div>
                </ScrollArea>
              </>
            )}
          </CredenzaBody>
        </CredenzaContent>
      </Credenza>
    </div>
  )
}
