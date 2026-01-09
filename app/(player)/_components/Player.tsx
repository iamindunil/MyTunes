"use client"

import { Button } from "@/components/ui/button"
import { getSongsById, SongResponse } from "@/lib/fetch"
import { Download, Play, Repeat, Repeat1, Share2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { toast } from "sonner"
import Link from "next/link"
import Image from "next/image"
import { useMusicProvider, useNextMusicProvider } from "@/hooks/use-context"
import Next from "@/components/cards/next"
import { IoPause } from "react-icons/io5"

/* ---------------- Types ---------------- */

type Song = SongResponse["data"][0]

/* ---------------- Component ---------------- */

export default function Player({ id }: { id: string }) {
  const [data, setData] = useState<Song | null>(null)
  const [playing, setPlaying] = useState(true)
  const audioRef = useRef<HTMLAudioElement>(null)

  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [audioURL, setAudioURL] = useState("")

  const { current, setCurrent, setDownloadProgress, downloadProgress } =
    useMusicProvider()

  const next = useNextMusicProvider()

  /* ---------------- Fetch Song ---------------- */

  useEffect(() => {
    const load = async () => {
      const res = await getSongsById(id)
      if (!res) return

      const json: SongResponse = await res.json()
      const song = json.data[0]

      setData(song)

      const url =
        song.downloadUrl[2]?.url ||
        song.downloadUrl[1]?.url ||
        song.downloadUrl[0]?.url

      setAudioURL(url)
    }

    load()
  }, [id])

  /* ---------------- Audio Sync ---------------- */

  useEffect(() => {
    if (!audioRef.current) return

    audioRef.current.currentTime = current

    const update = () => {
      if (!audioRef.current) return
      setCurrentTime(audioRef.current.currentTime)
      setDuration(audioRef.current.duration)
      setCurrent(audioRef.current.currentTime)
    }

    audioRef.current.addEventListener("timeupdate", update)
    return () =>
      audioRef.current?.removeEventListener("timeupdate", update)
  }, [])

  /* ---------------- Download ---------------- */

  const downloadSong = async () => {
    if (!audioURL || !data) return

    setIsDownloading(true)
    setDownloadProgress(0)

    const res = await fetch(audioURL)
    if (!res.body) return

    const reader = res.body.getReader()
    const chunks: Uint8Array[] = []

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (value) chunks.push(value)
    }

    const blob = new Blob(
      chunks,
      { type: "audio/mpeg" }
    )

    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `${data.name}.mp3`
    a.click()

    URL.revokeObjectURL(url)

    toast.success("Downloaded!")
    setIsDownloading(false)
    setDownloadProgress(0)
  }

  /* ---------------- UI ---------------- */

  if (!data) return <Skeleton className="h-48 w-full" />

  return (
    <div className="px-6 md:px-20 lg:px-32 mt-10">
      <audio
        ref={audioRef}
        src={audioURL}
        autoPlay
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      <Image
        src={data.image[2].url}
        alt={data.name}
        width={160}
        height={160}
        className="rounded-xl"
      />

      <h1 className="text-xl font-bold mt-4">{data.name}</h1>

      <Link
        href={`/search/${encodeURIComponent(
          data.artists.primary[0]?.name
        )}`}
        className="text-muted-foreground"
      >
        {data.artists.primary[0]?.name}
      </Link>

      <Slider
        value={[currentTime]}
        max={duration}
        onValueChange={(v) => {
          if (!audioRef.current) return
          audioRef.current.currentTime = v[0]
          setCurrentTime(v[0])
        }}
      />

      <div className="flex justify-between text-sm">
        <span>{Math.floor(currentTime)}s</span>
        <span>{Math.floor(duration)}s</span>
      </div>

      <div className="flex gap-3 mt-4">
        <Button onClick={() => playing ? audioRef.current?.pause() : audioRef.current?.play()}>
          {playing ? <IoPause /> : <Play />}
        </Button>

        <Button onClick={() => {
          if (!audioRef.current) return
          audioRef.current.loop = !isLooping
          setIsLooping(!isLooping)
        }}>
          {isLooping ? <Repeat1 /> : <Repeat />}
        </Button>

        <Button onClick={downloadSong}>
          {isDownloading ? downloadProgress : <Download />}
        </Button>

        <Button onClick={() => navigator.share?.({ url: location.href })}>
          <Share2 />
        </Button>
      </div>

      {next.nextData && <Next {...next.nextData} />}
    </div>
  )
}
