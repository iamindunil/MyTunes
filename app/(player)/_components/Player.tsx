"use client"

import { Button } from "@/components/ui/button"
import { getSongsById } from "@/lib/fetch"
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

interface Song {
  id: string
  name: string
  image: { url: string }[]
  artists: {
    primary: { name: string }[]
  }
  downloadUrl: { url: string }[]
}

/* ---------------- Component ---------------- */

export default function Player({ id }: { id: string }) {
  const [data, setData] = useState<Song | null>(null)
  const [playing, setPlaying] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [audioURL, setAudioURL] = useState("")

  const next = useNextMusicProvider()
  const { setCurrent, setDownloadProgress, downloadProgress } =
    useMusicProvider()

  /* ---------------- Fetch Song ---------------- */

  const getSong = async () => {
    const res = await getSongsById(id)
    const json = await res.json()
    const song: Song = json.data[0]

    setData(song)

    const url =
      song.downloadUrl[2]?.url ||
      song.downloadUrl[1]?.url ||
      song.downloadUrl[0]?.url

    setAudioURL(url)
  }

  /* ---------------- Helpers ---------------- */

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`
  }

  const togglePlayPause = () => {
    if (!audioRef.current) return

    playing ? audioRef.current.pause() : audioRef.current.play()
    setPlaying(!playing)
  }

  const handleSeek = (value: number[]) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const loopSong = () => {
    if (!audioRef.current) return
    audioRef.current.loop = !isLooping
    setIsLooping(!isLooping)
  }

  /* ---------------- Download ---------------- */

  const downloadSong = async () => {
    if (!audioURL) return

    setIsDownloading(true)
    setDownloadProgress(0)

    const response = await fetch(audioURL)
    if (!response.body) return

    const reader = response.body.getReader()
    const chunks: Uint8Array[] = []

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (value) chunks.push(value)
    }

    const blob = new Blob(chunks)
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `${data?.name}.mp3`
    a.click()

    URL.revokeObjectURL(url)

    toast.success("Downloaded!")
    setIsDownloading(false)
    setDownloadProgress(0)
  }

  /* ---------------- Effects ---------------- */

  useEffect(() => {
    getSong()
  }, [id])

  useEffect(() => {
    if (!audioRef.current) return

    const update = () => {
      setCurrentTime(audioRef.current!.currentTime)
      setDuration(audioRef.current!.duration)
      setCurrent(audioRef.current!.currentTime)
    }

    audioRef.current.addEventListener("timeupdate", update)
    return () =>
      audioRef.current?.removeEventListener("timeupdate", update)
  }, [])

  /* ---------------- UI ---------------- */

  return (
    <div className="mt-10">
      <audio
        ref={audioRef}
        src={audioURL}
        autoPlay
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      {!data ? (
        <Skeleton className="h-40 w-full" />
      ) : (
        <div className="px-6 md:px-20 lg:px-32 grid gap-4">
          <Image
            src={data.image[2].url}
            alt={data.name}
            width={150}
            height={150}
            className="rounded-xl"
          />

          <h1 className="text-xl font-bold">{data.name}</h1>

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
            onValueChange={handleSeek}
          />

          <div className="flex justify-between text-sm">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div className="flex gap-3">
            <Button onClick={togglePlayPause}>
              {playing ? <IoPause /> : <Play />}
            </Button>

            <Button onClick={loopSong}>
              {isLooping ? <Repeat1 /> : <Repeat />}
            </Button>

            <Button onClick={downloadSong}>
              {isDownloading ? downloadProgress : <Download />}
            </Button>

            <Button onClick={() => navigator.share?.({ url: location.href })}>
              <Share2 />
            </Button>
          </div>
        </div>
      )}

      {next?.nextData && (
        <div className="px-6 md:px-20 lg:px-32 mt-10">
          <Next {...next.nextData} />
        </div>
      )}
    </div>
  )
}
