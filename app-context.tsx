"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export interface GpsPosition {
  lat: number
  lng: number
  speed: number | null
  heading: number | null
  timestamp: number
}

export function useGpsTracking(routeId: string) {
  const [isTracking, setIsTracking] = useState(false)
  const [position, setPosition] = useState<GpsPosition | null>(null)
  const [error, setError] = useState<string | null>(null)
  const watchIdRef = useRef<number | null>(null)
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>["channel"]> | null>(null)
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null)

  // Get or create supabase client
  const getSupabase = useCallback(() => {
    if (!supabaseRef.current) {
      supabaseRef.current = createClient()
    }
    return supabaseRef.current
  }, [])

  // Start broadcasting GPS position
  const startTracking = useCallback(async () => {
    if (!navigator.geolocation) {
      setError("Tu navegador no soporta GPS")
      return
    }

    setError(null)
    const supabase = getSupabase()
    const channelName = `gps-route-${routeId}`

    // Mark route as active in DB
    try {
      await supabase
        .from("active_routes")
        .update({ is_active: true, started_at: new Date().toISOString() })
        .eq("route_id", routeId)
    } catch {
      // Table may not exist yet, continue with broadcast only
    }

    // Create Realtime channel
    const channel = supabase.channel(channelName, {
      config: { broadcast: { self: true } },
    })

    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        // Start geolocation watch
        const id = navigator.geolocation.watchPosition(
          (pos) => {
            const gpsData: GpsPosition = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              speed: pos.coords.speed,
              heading: pos.coords.heading,
              timestamp: Date.now(),
            }
            setPosition(gpsData)

            // Broadcast to all listeners
            channel.send({
              type: "broadcast",
              event: "location",
              payload: gpsData,
            })
          },
          (err) => {
            setError(
              err.code === 1
                ? "Activa los permisos de ubicacion"
                : err.code === 2
                ? "GPS no disponible"
                : "Error obteniendo ubicacion"
            )
          },
          {
            enableHighAccuracy: true,
            maximumAge: 3000,
            timeout: 10000,
          }
        )
        watchIdRef.current = id
        setIsTracking(true)
      }
    })

    channelRef.current = channel
  }, [routeId, getSupabase])

  // Stop broadcasting
  const stopTracking = useCallback(async () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }

    const supabase = getSupabase()

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
      channelRef.current = null
    }

    // Mark route as inactive
    try {
      await supabase
        .from("active_routes")
        .update({ is_active: false })
        .eq("route_id", routeId)
    } catch {
      // ignore
    }

    setIsTracking(false)
    setPosition(null)
  }, [routeId, getSupabase])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
      if (channelRef.current && supabaseRef.current) {
        supabaseRef.current.removeChannel(channelRef.current)
      }
    }
  }, [])

  return {
    isTracking,
    position,
    error,
    startTracking,
    stopTracking,
  }
}
