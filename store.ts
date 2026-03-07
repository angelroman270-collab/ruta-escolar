"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { GpsPosition } from "./use-gps-tracking"

interface RouteStatus {
  is_active: boolean
  started_at: string | null
}

export function useGpsListener(routeId: string) {
  const [position, setPosition] = useState<GpsPosition | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>["channel"]> | null>(null)
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null)

  const getSupabase = useCallback(() => {
    if (!supabaseRef.current) {
      supabaseRef.current = createClient()
    }
    return supabaseRef.current
  }, [])

  // Check if route is active
  const checkRouteActive = useCallback(async () => {
    const supabase = getSupabase()
    try {
      const { data } = await supabase
        .from("active_routes")
        .select("is_active, started_at")
        .eq("route_id", routeId)
        .single()
      if (data) {
        setIsActive((data as RouteStatus).is_active)
      }
    } catch {
      // ignore
    }
  }, [routeId, getSupabase])

  // Subscribe to GPS broadcasts
  const subscribe = useCallback(() => {
    const supabase = getSupabase()
    const channelName = `gps-route-${routeId}`

    const channel = supabase.channel(channelName)

    channel
      .on("broadcast", { event: "location" }, (payload) => {
        const gps = payload.payload as GpsPosition
        setPosition(gps)
        setIsActive(true)
      })
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED")
      })

    channelRef.current = channel
  }, [routeId, getSupabase])

  // Also listen for DB changes on active_routes
  const subscribeToStatus = useCallback(() => {
    const supabase = getSupabase()

    const statusChannel = supabase
      .channel(`route-status-${routeId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "active_routes",
          filter: `route_id=eq.${routeId}`,
        },
        (payload) => {
          const newRecord = payload.new as RouteStatus
          setIsActive(newRecord.is_active)
          if (!newRecord.is_active) {
            setPosition(null)
          }
        }
      )
      .subscribe()

    return statusChannel
  }, [routeId, getSupabase])

  useEffect(() => {
    checkRouteActive()
    subscribe()
    const statusChannel = subscribeToStatus()

    // Poll route status every 30s as fallback
    const interval = setInterval(checkRouteActive, 30000)

    return () => {
      clearInterval(interval)
      const supabase = getSupabase()
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
      supabase.removeChannel(statusChannel)
    }
  }, [checkRouteActive, subscribe, subscribeToStatus, getSupabase])

  return {
    position,
    isActive,
    isConnected,
  }
}
