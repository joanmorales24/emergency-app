'use client'

import { useEffect, useState } from 'react'
import { Report } from '@/lib/supabase'
import dynamic from 'next/dynamic'

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)

interface MapViewProps {
  reports: Report[]
  onReportClick?: (report: Report) => void
}

export function MapView({ reports, onReportClick }: MapViewProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-full h-full bg-gray-200 animate-pulse" />
  }

  const center = reports.length > 0 && reports[0]
    ? ([reports[0].latitude, reports[0].longitude] as const)
    : ([8.76, -70.19] as const)

  return (
    <MapContainer center={center as any} zoom={8} className="w-full h-full" scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {reports.map((report) => (
        <Marker
          key={report.id}
          position={[report.latitude, report.longitude]}
          eventHandlers={{
            click: () => onReportClick?.(report),
          }}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-bold text-base">{report.name}</p>
              <p className="text-xs text-gray-600">
                {report.age_approximate} años
              </p>
              <p className="text-xs mt-1">
                <span className={`px-2 py-1 rounded text-white text-xs font-semibold ${
                  report.status === 'alive' ? 'bg-green-600' :
                  report.status === 'missing' ? 'bg-red-600' :
                  'bg-blue-600'
                }`}>
                  {report.status === 'alive' ? 'CON VIDA' :
                   report.status === 'missing' ? 'DESAPARECIDO/A' :
                   'ENCONTRADO/A'}
                </span>
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
