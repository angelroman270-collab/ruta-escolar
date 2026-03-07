"use client"

import { useEffect, useRef } from "react"
import type { GpsPosition } from "@/hooks/use-gps-tracking"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Santiago default center
const SANTIAGO_CENTER: [number, number] = [-33.4489, -70.6693]

// Custom bus icon as SVG data URI
const busIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40">
  <circle cx="20" cy="20" r="18" fill="%23f5c518" stroke="%230a1628" stroke-width="3"/>
  <text x="20" y="26" text-anchor="middle" font-size="20" fill="%230a1628">🚐</text>
</svg>`

const busIcon = L.icon({
  iconUrl: `data:image/svg+xml,${encodeURIComponent(busIconSvg)}`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
})

interface TrackingMapProps {
  position: GpsPosition | null
  isActive: boolean
  height?: string
  showPulse?: boolean
}

export function TrackingMap({
  position,
  isActive,
  height = "100%",
  showPulse = true,
}: TrackingMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const pulseRef = useRef<L.CircleMarker | null>(null)

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const map = L.map(mapContainerRef.current, {
      center: SANTIAGO_CENTER,
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
    })

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map)

    // Add zoom control to bottom right
    L.control.zoom({ position: "bottomright" }).addTo(map)

    // Add small attribution
    L.control
      .attribution({ position: "bottomleft", prefix: false })
      .addAttribution("OSM")
      .addTo(map)

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
      markerRef.current = null
      pulseRef.current = null
    }
  }, [])

  // Update marker position
  useEffect(() => {
    if (!mapRef.current) return

    if (position && isActive) {
      const latlng: [number, number] = [position.lat, position.lng]

      if (markerRef.current) {
        markerRef.current.setLatLng(latlng)
      } else {
        markerRef.current = L.marker(latlng, { icon: busIcon })
          .addTo(mapRef.current)
          .bindPopup("Furgon escolar")
      }

      // Pulse circle
      if (showPulse) {
        if (pulseRef.current) {
          pulseRef.current.setLatLng(latlng)
        } else {
          pulseRef.current = L.circleMarker(latlng, {
            radius: 25,
            color: "#f5c518",
            fillColor: "#f5c518",
            fillOpacity: 0.15,
            weight: 2,
            opacity: 0.4,
          }).addTo(mapRef.current)
        }
      }

      mapRef.current.setView(latlng, Math.max(mapRef.current.getZoom(), 15), {
        animate: true,
        duration: 1,
      })
    } else {
      // No active position - remove marker
      if (markerRef.current) {
        markerRef.current.remove()
        markerRef.current = null
      }
      if (pulseRef.current) {
        pulseRef.current.remove()
        pulseRef.current = null
      }
    }
  }, [position, isActive, showPulse])

  return (
    <div
      ref={mapContainerRef}
      style={{ height, width: "100%", borderRadius: "12px", overflow: "hidden" }}
    />
  )
}
