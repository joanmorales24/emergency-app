'use client'

import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

interface SetViewOnClickProps {
  center: [number, number]
}

export function SetViewOnClick({ center }: SetViewOnClickProps) {
  const map = useMap()

  useEffect(() => {
    map.setView(center, map.getZoom())
  }, [center, map])

  return null
}
