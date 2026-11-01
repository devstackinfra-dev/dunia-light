"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Maximize2,
  Minimize2,
  Sparkles,
  Heart,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Tv,
  Music,
} from "lucide-react"
import {
  getActiveEventId,
  getEventState,
  getTelaoSettings,
  DEFAULT_TELAO_SETTINGS,
  type DuniaEventState,
  type DuniaGuestPhoto,
  type DuniaTelaoSettings,
} from "@/lib/dunia-store"

// Trilhas sonoras para o telão
const AUDIO_TRACKS: Record<string, string> = {
  acoustic: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=piano-moment-9835.mp3",
  jazz: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=relaxing-light-piano-108842.mp3",
  bossa: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=acoustic-guitars-ambient-uplifting-10707.mp3",
  sunset: "https://cdn.pixabay.com/download/audio/2021/11/01/audio_00fa32490d.mp3?filename=sunset-landscape-piano-9740.mp3",
}

export default function LiveTelaoPage() {
  const [mounted, setMounted] = useState(false)
  const [state, setState] = useState<DuniaEventState | null>(null)
  const [settings, setSettings] = useState<DuniaTelaoSettings>(DEFAULT_TELAO_SETTINGS)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [audioBlocked, setAudioBlocked] = useState(false)
  const [lastExecutedCmd, setLastExecutedCmd] = useState<number>(0)
  const [slideKey, setSlideKey] = useState<number>(0)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  // 1. Inicialização
  useEffect(() => {
    setMounted(true)
    const activeId = getActiveEventId()
    const current = getEventState(activeId)
    setState(current)
    const telaoSet = getTelaoSettings(activeId)
    setSettings(telaoSet)
  }, [])

  // 2. Sincronização em tempo real com o Painel do Casal
  useEffect(() => {
    const handleSync = (updatedSettings?: DuniaTelaoSettings) => {
      const activeId = getActiveEventId()
      const current = getEventState(activeId)
      setState(current)

      const activeSettings = updatedSettings || getTelaoSettings(activeId)
      setSettings(activeSettings)

      // Executa comandos manuais enviados pelo Painel do Casal
      if (
        activeSettings.manualCommand &&
        activeSettings.manualCommand.timestamp > lastExecutedCmd
      ) {
        setLastExecutedCmd(activeSettings.manualCommand.timestamp)
        const photos = (current.album?.guestPhotos || []).filter((p) => p.approved)
        if (photos.length > 0) {
          if (activeSettings.manualCommand.action === "next") {
            setCurrentIndex((prev) => (prev + 1) % photos.length)
            setSlideKey((k) => k + 1)
          } else if (activeSettings.manualCommand.action === "prev") {
            setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1))
            setSlideKey((k) => k + 1)
          } else if (
            activeSettings.manualCommand.action === "jump" &&
            typeof activeSettings.manualCommand.targetIndex === "number"
          ) {
            setCurrentIndex(activeSettings.manualCommand.targetIndex % photos.length)
            setSlideKey((k) => k + 1)
          }
        }
      }
    }

    // A. BroadcastChannel (Cross-tab instantâneo)
    let bc: BroadcastChannel | null = null
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      bc = new BroadcastChannel("dunia-telao-sync")
      bc.onmessage = (msg) => {
        if (msg.data?.settings) {
          handleSync(msg.data.settings)
        }
      }
    }

    // B. Window CustomEvent (Same window)
    const onCustomUpdate = (e: any) => handleSync(e.detail)
    window.addEventListener("dunia-telao-update", onCustomUpdate)

    // C. Storage Event
    const onStorage = (e: StorageEvent) => {
      if (e.key === "dunia-telao-sync-trigger" || e.key?.startsWith("dunia-v7-state-")) {
        handleSync()
      }
    }
    window.addEventListener("storage", onStorage)

    // D. Polling periódico de fallback (1.5s)
    const interval = setInterval(() => handleSync(), 1500)

    return () => {
      if (bc) bc.close()
      window.removeEventListener("dunia-telao-update", onCustomUpdate)
      window.removeEventListener("storage", onStorage)
      clearInterval(interval)
    }
  }, [lastExecutedCmd])

  // 3. Controle de Áudio / Música de Fundo
  useEffect(() => {
    if (!audioRef.current) return
    const audio = audioRef.current

    const trackUrl =
      settings.musicTrack === "custom" && settings.customMusicUrl
        ? settings.customMusicUrl
        : AUDIO_TRACKS[settings.musicTrack] || AUDIO_TRACKS.acoustic

    if (audio.src !== trackUrl) {
      audio.src = trackUrl
      audio.load()
    }

    audio.volume = Math.max(0, Math.min(1, (settings.musicVolume || 60) / 100))

    if (settings.musicEnabled && settings.isPlaying) {
      audio
        .play()
        .then(() => setAudioBlocked(false))
        .catch(() => setAudioBlocked(true))
    } else {
      audio.pause()
    }
  }, [
    settings.musicEnabled,
    settings.musicTrack,
    settings.customMusicUrl,
    settings.musicVolume,
    settings.isPlaying,
  ])

  // 4. Rotação automática dos slides com base no tempo configurado no Painel
  useEffect(() => {
    if (!settings.isPlaying) return
    const photos = (state?.album?.guestPhotos || []).filter((p) => p.approved)
    if (photos.length <= 1) return

    const speedMs = Math.max(2, settings.speed || 6) * 1000
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length)
      setSlideKey((k) => k + 1)
    }, speedMs)

    return () => clearInterval(timer)
  }, [settings.isPlaying, settings.speed, state?.album?.guestPhotos])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
      setIsFullscreen(true)
    } else {
      document.exitFullscreen().catch(() => {})
      setIsFullscreen(false)
    }
  }

  const handleUnlockAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => setAudioBlocked(false)).catch(() => {})
    }
  }

  if (!mounted || !state) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070605] text-[#D3B47C]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#D3B47C] border-t-transparent" />
          <p className="font-serif text-lg tracking-wider">Iniciando Telão Oficial Dúnia Memories...</p>
        </div>
      </div>
    )
  }

  const { event, album } = state
  const photos = (album.guestPhotos || []).filter((p) => p.approved)
  const currentPhoto: DuniaGuestPhoto | undefined = photos[currentIndex] || photos[0]

  // URL do QR Code
  const uploadUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/evento/fotos`
      : "http://localhost:3000/evento/fotos"

  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=4&color=120F0D&bgcolor=FFFFFF&data=${encodeURIComponent(
    uploadUrl
  )}`

  // Classes de animação baseadas no efeito configurado no painel
  const getEffectClasses = () => {
    switch (settings.transitionEffect) {
      case "fade":
        return "animate-fadeIn transition-opacity duration-1000"
      case "slide":
        return "animate-slideInRight transition-transform duration-700"
      case "zoom":
        return "animate-zoomIn transition-transform duration-1000"
      case "kenburns":
      default:
        return "animate-kenburns transition-transform duration-[7000ms] ease-out scale-105"
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-[#070605] text-[#F3EEE6] select-none">
      {/* Elemento de Áudio Oculto */}
      <audio ref={audioRef} loop preload="auto" />

      {/* AVISO DISCRETO CASO O NAVEGADOR BLOQUEIE AUTOPLAY DE ÁUDIO */}
      {audioBlocked && settings.musicEnabled && (
        <div
          onClick={handleUnlockAudio}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full border border-[#D3B47C] bg-black/85 px-4 py-2 text-xs font-semibold text-[#D3B47C] shadow-2xl cursor-pointer hover:bg-black transition animate-bounce"
        >
          <VolumeX className="h-4 w-4" />
          <span>Clique na tela para ativar o áudio do telão</span>
        </div>
      )}

      {/* TOPO: Logotipo Dúnia e Identificação do Evento */}
      <header className="relative z-30 flex items-center justify-between border-b border-white/10 bg-gradient-to-b from-black/95 via-black/60 to-transparent px-8 py-4">
        <div className="flex items-center gap-4">
          <Image
            src="/assets/logo.png"
            alt="Dúnia City Hall"
            width={160}
            height={48}
            className="h-9 w-auto object-contain"
            priority
          />
          <div className="hidden sm:block h-6 w-[1px] bg-white/20" />
          <div className="hidden sm:block">
            <h1 className="font-serif text-xl font-normal text-white">{event.name}</h1>
            <p className="text-[0.65rem] uppercase tracking-widest text-[#D3B47C]">
              {event.venue}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Indicador de Transmissão & Efeito Ativo */}
          <div className="hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3.5 py-1 text-[0.65rem] text-[#ABA29A]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Transmissão Ativa</span>
            <span>•</span>
            <span className="text-[#D3B47C] uppercase font-bold">
              {settings.transitionEffect} · {settings.speed}s
            </span>
            {settings.musicEnabled && (
              <>
                <span>•</span>
                <span className="text-emerald-300 flex items-center gap-1">
                  <Music className="h-3 w-3" /> Trilha Ativa
                </span>
              </>
            )}
          </div>

          <button
            onClick={toggleFullscreen}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-black/60 text-white hover:border-[#D3B47C] transition"
            title="Alternar Tela Cheia"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* PALCO PRINCIPAL DO TELÃO */}
      <main className="relative flex-1 flex items-center justify-center p-4 sm:p-8">
        {currentPhoto ? (
          <div className="relative w-full h-[76vh] max-w-6xl rounded-3xl overflow-hidden border-2 border-[#D3B47C]/40 bg-black shadow-[0_0_100px_rgba(211,180,124,0.18)]">
            {/* Foto com Transição Dinâmica e SlideKey */}
            <div key={slideKey} className={`relative w-full h-full ${getEffectClasses()}`}>
              <Image
                src={currentPhoto.url}
                alt={currentPhoto.guestName}
                fill
                priority
                sizes="100vw"
                className="object-contain"
              />
            </div>

            {/* Vinheta cênica elegante */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />

            {/* LEGENDA DO CONVIDADO (POSICIONAMENTO DE ACORDO COM O LAYOUT) */}
            <div className="absolute bottom-6 left-6 max-w-lg rounded-2xl border border-white/15 bg-black/80 p-5 backdrop-blur-xl shadow-2xl z-20">
              <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C] flex items-center gap-1.5">
                <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />
                FOTO ENVIADA POR
              </span>
              <h3 className="font-serif text-2xl text-white mt-0.5">
                {currentPhoto.guestName}
              </h3>
              {currentPhoto.message && (
                <p className="mt-2 font-serif text-base text-white/90 italic leading-relaxed">
                  &ldquo;{currentPhoto.message}&rdquo;
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center p-12">
            <Sparkles className="mx-auto h-12 w-12 text-[#D3B47C] opacity-70 mb-4" />
            <h2 className="font-serif text-3xl text-white">Aguardando Fotos dos Convidados</h2>
            <p className="mt-2 text-sm text-[#ABA29A] max-w-md mx-auto">
              Aponte a câmera do seu celular para o QR Code e seja o primeiro a aparecer no telão oficial do Dúnia City Hall!
            </p>
          </div>
        )}

        {/* DISPLAY DO QR CODE (CONFIGURÁVEL: POSIÇÃO E VISIBILIDADE CONTROLADAS PELO PAINEL) */}
        {settings.showQrCode && settings.qrPosition !== "hidden" && (
          <div
            className={`absolute bottom-8 z-30 flex items-center gap-4 rounded-3xl border-2 border-[#D3B47C]/60 bg-[#120F0D]/95 p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-xl transition-all duration-500 ${
              settings.qrPosition === "bottom-left" ? "left-8" : "right-8"
            }`}
          >
            <div className="overflow-hidden rounded-2xl border border-white/20 bg-white p-2">
              <img
                src={qrCodeImageUrl}
                alt="QR Code Álbum ao Vivo"
                width={105}
                height={105}
                className="object-contain"
              />
            </div>
            <div className="max-w-[185px]">
              <span className="rounded bg-[#D3B47C]/20 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-[#D3B47C] block w-fit">
                PARTICIPE DA FESTA
              </span>
              <h4 className="mt-1 font-serif text-base font-normal text-white leading-snug">
                Aponte a câmera e apareça aqui!
              </h4>
              <p className="mt-1 text-[0.65rem] text-[#ABA29A] leading-tight">
                Tire fotos na mesa com seu celular e compartilhe ao vivo.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* RODAPÉ DO TELÃO: LIMPO E DISCRETO */}
      <footer className="relative z-30 flex items-center justify-between border-t border-white/10 bg-gradient-to-t from-black/95 via-black/50 to-transparent px-8 py-3 text-xs text-[#ABA29A]">
        <div className="flex items-center gap-3">
          <span>Dúnia City Hall • Tecnologia Experience OS</span>
          <span>•</span>
          <span className="text-[0.65rem] text-[#D3B47C]">
            Foto {currentIndex + 1} de {photos.length}
          </span>
        </div>

        <div className="text-[0.68rem] text-white/50">
          Controlado em tempo real pelo Painel do Casal
        </div>
      </footer>
    </div>
  )
}
