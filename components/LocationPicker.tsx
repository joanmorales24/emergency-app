'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void
}

export function LocationPicker({ onLocationSelect }: LocationPickerProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const container = document.getElementById('location-picker-map')
    if (!container || mapRef.current) return

    mapRef.current = L.map(container).setView([8.76, -70.19], 7)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(mapRef.current)

    mapRef.current.on('click', (e) => {
      const { lat, lng } = e.latlng

      if (markerRef.current) {
        mapRef.current!.removeLayer(markerRef.current)
      }

      markerRef.current = L.marker([lat, lng])
        .addTo(mapRef.current!)
        .bindPopup(`<p class="font-bold">Ubicación seleccionada</p>`)
        .openPopup()

      onLocationSelect(lat, lng)
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [mounted, onLocationSelect])

  if (!mounted) {
    return <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg" />
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-600 font-semibold">
        📍 Haz click en el mapa para seleccionar la ubicación
      </p>
      <div
        id="location-picker-map"
        className="w-full h-64 rounded-lg border-2 border-gray-300"
      />
    </div>
  )
}
