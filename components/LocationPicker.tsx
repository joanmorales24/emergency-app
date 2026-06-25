'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void
}

export function LocationPicker({ onLocationSelect }: LocationPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !containerRef.current) return

    // Evitar re-inicialización
    if (mapRef.current) return

    try {
      // Inicializar mapa
      mapRef.current = L.map(containerRef.current).setView([8.76, -70.19], 7)

      // Agregar tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapRef.current)

      // Hacer el mapa interactivo
      const map = mapRef.current
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng

        // Remover marker anterior
        if (markerRef.current) {
          map.removeLayer(markerRef.current)
        }

        // Agregar nuevo marker
        markerRef.current = L.marker([lat, lng], {
          draggable: false,
        })
          .addTo(map)
          .bindPopup(`<div style="padding: 8px;"><strong>Ubicación</strong><br/>${lat.toFixed(4)}, ${lng.toFixed(4)}</div>`)
          .openPopup()

        // Llamar callback
        onLocationSelect(lat, lng)
      })
    } catch (error) {
      console.error('Error inicializando mapa:', error)
    }

    // Cleanup
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
    <div className="space-y-3">
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
        <p className="text-sm text-yellow-800 font-semibold">
          👆 Toca o haz click en el mapa donde está la persona
        </p>
      </div>
      <div
        ref={containerRef}
        className="w-full h-72 rounded-lg border-2 border-gray-300 bg-gray-100"
        style={{ minHeight: '288px' }}
      />
    </div>
  )
}
