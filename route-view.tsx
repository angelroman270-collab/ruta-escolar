"use client"

import { useState, useCallback } from "react"
import { useApp } from "@/lib/app-context"
import { useGpsTracking } from "@/hooks/use-gps-tracking"
import { DynamicMap } from "./dynamic-map"
import {
  Navigation,
  Copy,
  Check,
  Share2,
  Satellite,
  Radio,
  MapPin,
  Gauge,
} from "lucide-react"

export function GpsView() {
  const { van, flash } = useApp()
  const routeId = van === "A" ? "A" : "B"
  const { isTracking, position, error, startTracking, stopTracking } =
    useGpsTracking(routeId)
  const [copied, setCopied] = useState(false)

  const trackingUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/seguimiento?ruta=${routeId}`
      : ""

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(trackingUrl)
      setCopied(true)
      flash("Link copiado", "ok")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      flash("No se pudo copiar", "err")
    }
  }, [trackingUrl, flash])

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: `Seguimiento Furgon ${routeId}`,
        text: `Sigue la ruta del furgon ${routeId} en tiempo real:`,
        url: trackingUrl,
      })
    } else {
      handleCopy()
    }
  }, [routeId, trackingUrl, handleCopy])

  const handleShareWhatsApp = useCallback(() => {
    const msg = encodeURIComponent(
      `Sigue la ruta del Furgon ${routeId} en tiempo real: ${trackingUrl}`
    )
    window.open(`https://wa.me/?text=${msg}`, "_blank")
  }, [routeId, trackingUrl])

  const speedKmh = position?.speed
    ? Math.round(position.speed * 3.6)
    : 0

  return (
    <div className="flex flex-col gap-3 px-4 pt-3 pb-4">
      {/* Status card */}
      <div
        className="rounded-xl px-4 py-3 flex items-center gap-3"
        style={{
          background: isTracking
            ? "rgba(34,197,94,0.12)"
            : "rgba(148,163,184,0.1)",
          border: `1.5px solid ${isTracking ? "var(--green)" : "var(--border-color)"}`,
        }}
      >
        <div
          className="relative flex items-center justify-center"
          style={{ width: 40, height: 40 }}
        >
          <Satellite
            className="h-5 w-5"
            style={{ color: isTracking ? "var(--green)" : "var(--gray)" }}
          />
          {isTracking && (
            <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-[var(--green)] animate-pulse" />
          )}
        </div>
        <div className="flex-1">
          <div
            className="font-bold text-sm"
            style={{ color: isTracking ? "var(--green)" : "var(--gray)" }}
          >
            {isTracking ? "GPS ACTIVO" : "GPS APAGADO"}
          </div>
          <div className="text-[11px] text-[var(--gray)]">
            {isTracking
              ? `Ruta ${routeId} transmitiendo en vivo`
              : `Activa para compartir tu ubicacion en Ruta ${routeId}`}
          </div>
        </div>
        <Radio
          className="h-5 w-5"
          style={{
            color: isTracking ? "var(--green)" : "var(--gray)",
            opacity: isTracking ? 1 : 0.4,
          }}
        />
      </div>

      {/* Error display */}
      {error && (
        <div className="rounded-xl bg-[rgba(239,68,68,0.12)] border border-[var(--red)] px-4 py-2.5 text-sm text-[var(--red)] font-medium">
          {error}
        </div>
      )}

      {/* Start/Stop button */}
      <button
        onClick={isTracking ? stopTracking : startTracking}
        className="w-full rounded-xl py-4 text-base font-extrabold active:scale-[0.97] transition-transform flex items-center justify-center gap-2"
        style={{
          background: isTracking ? "var(--red)" : "var(--green)",
          color: "#fff",
        }}
      >
        <Navigation
          className="h-5 w-5"
          style={{
            transform: isTracking ? "none" : "rotate(45deg)",
          }}
        />
        {isTracking
          ? "DETENER GPS"
          : `ACTIVAR GPS - RUTA ${routeId}`}
      </button>

      {/* Map */}
      <div
        className="rounded-xl overflow-hidden border border-[var(--border-color)]"
        style={{ height: "260px" }}
      >
        <DynamicMap
          position={position}
          isActive={isTracking}
          height="260px"
        />
      </div>

      {/* Position info */}
      {isTracking && position && (
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] px-3 py-2.5 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[var(--yellow)]" />
            <div>
              <div className="text-[10px] text-[var(--gray)]">Posicion</div>
              <div className="text-xs font-mono font-bold text-[var(--foreground)]">
                {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] px-3 py-2.5 flex items-center gap-2">
            <Gauge className="h-4 w-4 text-[var(--blue)]" />
            <div>
              <div className="text-[10px] text-[var(--gray)]">Velocidad</div>
              <div className="text-xs font-mono font-bold text-[var(--foreground)]">
                {speedKmh} km/h
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share section */}
      <div className="rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] px-4 py-3">
        <div className="text-sm font-bold text-[var(--foreground)] mb-2">
          Compartir con apoderados
        </div>
        <div className="text-[11px] text-[var(--gray)] mb-3">
          Comparte este link para que los apoderados vean la ubicacion del furgon
          en tiempo real.
        </div>
        <div className="flex items-center gap-1.5 rounded-lg bg-[var(--navy3)] px-3 py-2 mb-3">
          <span className="flex-1 text-xs font-mono text-[var(--gray)] truncate">
            {trackingUrl || "..."}
          </span>
          <button
            onClick={handleCopy}
            className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-lg bg-[var(--navy2)] active:scale-95 transition-transform"
          >
            {copied ? (
              <Check className="h-4 w-4 text-[var(--green)]" />
            ) : (
              <Copy className="h-4 w-4 text-[var(--gray)]" />
            )}
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleShareWhatsApp}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-bold active:scale-[0.97] transition-transform"
            style={{
              background: "rgba(34,197,94,0.15)",
              border: "2px solid var(--green)",
              color: "var(--green)",
            }}
          >
            Enviar por WhatsApp
          </button>
          <button
            onClick={handleShare}
            className="flex items-center justify-center rounded-xl px-4 py-3 active:scale-[0.97] transition-transform"
            style={{
              background: "rgba(59,130,246,0.15)",
              border: "2px solid var(--blue)",
              color: "var(--blue)",
            }}
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
