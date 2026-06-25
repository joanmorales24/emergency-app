'use client'

import { useEffect, useState, useRef } from 'react'
import { Report } from '@/lib/supabase'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface MapViewProps {
  reports: Report[]
  onReportClick?: (report: Report) => void
}

export function MapView({ reports, onReportClick }: MapViewProps) {
  const [mounted, setMounted] = useState(false)
  const mapRef = useRef<L.Map | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !containerRef.current) return

    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current).setView(
        [reports.length > 0 && reports[0] ? reports[0].latitude : 8.76,
         reports.length > 0 && reports[0] ? reports[0].longitude : -70.19],
        8
      )

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current)
    } else if (reports.length > 0 && reports[0]) {
      mapRef.current.setView([reports[0].latitude, reports[0].longitude], 8)
    }

    reports.forEach((report) => {
      L.marker([report.latitude, report.longitude])
        .bindPopup(`
          <div class="text-sm">
            <p class="font-bold text-base">${report.name}</p>
            <p class="text-xs text-gray-600">${report.age_approximate} años</p>
            <p class="text-xs mt-1">
              <span class="px-2 py-1 rounded text-white text-xs font-semibold ${
                report.status === 'alive' ? 'bg-green-600' :
                report.status === 'missing' ? 'bg-red-600' :
                'bg-blue-600'
              }">
                ${report.status === 'alive' ? 'CON VIDA' :
                  report.status === 'missing' ? 'DESAPARECIDO/A' :
                  'ENCONTRADO/A'}
              </span>
            </p>
          </div>
        `)
        .on('click', () => onReportClick?.(report))
        .addTo(mapRef.current!)
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [mounted, reports, onReportClick])

  if (!mounted) {
    return <div className="w-full h-full bg-gray-200 animate-pulse" />
  }

  return <div ref={containerRef} className="w-full h-full" />
}

