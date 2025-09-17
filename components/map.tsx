"use client"

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import the entire map component to avoid SSR issues
const MapWithRider = dynamic(() => import('./map-internal').then(mod => mod.MapWithRider), { 
  ssr: false,
  loading: () => <div className="h-96 w-full bg-gray-200 rounded-lg flex items-center justify-center">Loading map...</div>
})

const Map = dynamic(() => import('./map-internal').then(mod => mod.default), { 
  ssr: false,
  loading: () => <div className="h-96 w-full bg-gray-200 rounded-lg flex items-center justify-center">Loading map...</div>
})

export { Map, MapWithRider }
