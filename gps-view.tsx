"use client"

import dynamic from "next/dynamic"
import type { GpsPosition } from "@/hooks/use-gps-tracking"

const TrackingMap = dynamic(
  () => import("./tracking-map").then((mod) => mod.TrackingMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center rounded-xl bg-[var(--navy3)]" style={{ height: "100%" }}>
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 rounded-full border-2 border-[var(--yellow)] border-t-transparent animate-spin" />
          <span className="text-xs text-[var(--gray)]">Cargando mapa...</span>
        </div>
      </div>
    ),
  }
)

interface DynamicMapProps {
  position: GpsPosition | null
  isActive: boolean
  height?: string
  showPulse?: boolean
}

export function DynamicMap(props: DynamicMapProps) {
  return <TrackingMap {...props} />
}
