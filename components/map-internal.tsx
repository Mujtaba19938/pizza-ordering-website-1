"use client"

import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface MapProps {
  center: [number, number]
  zoom?: number
  className?: string
  children?: React.ReactNode
}

interface RiderMarkerProps {
  position: [number, number]
  heading?: number
  isRider?: boolean
}

// Custom rider marker component
function RiderMarker({ position, heading, isRider = false }: RiderMarkerProps) {
  const map = useMap()
  const markerRef = useRef<L.Marker>(null)

  useEffect(() => {
    if (markerRef.current && heading !== undefined) {
      // Create custom icon with heading
      const icon = L.divIcon({
        html: `
          <div style="
            width: 30px;
            height: 30px;
            background-color: ${isRider ? '#d62828' : '#10b981'};
            border: 3px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            transform: rotate(${heading}deg);
          ">
            <div style="
              width: 0;
              height: 0;
              border-left: 6px solid transparent;
              border-right: 6px solid transparent;
              border-bottom: 12px solid white;
              margin-top: -3px;
            "></div>
          </div>
        `,
        className: 'custom-rider-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      })

      markerRef.current.setIcon(icon)
    }
  }, [heading, isRider])

  return (
    <Marker ref={markerRef} position={position}>
      <Popup>
        {isRider ? 'Your delivery rider' : 'Delivery location'}
      </Popup>
    </Marker>
  )
}

// Map component with rider location updates
export function MapWithRider({ 
  center, 
  riderPosition, 
  heading 
}: { 
  center: [number, number]
  riderPosition?: [number, number]
  heading?: number
}) {
  const map = useMap()

  useEffect(() => {
    if (riderPosition) {
      map.setView(riderPosition, 15)
    }
  }, [riderPosition, map])

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Delivery location marker */}
      <Marker position={center}>
        <Popup>
          <div className="text-center">
            <h3 className="font-bold text-[#d62828]">Delivery Address</h3>
            <p>Your order will be delivered here</p>
          </div>
        </Popup>
      </Marker>

      {/* Rider marker */}
      {riderPosition && (
        <RiderMarker 
          position={riderPosition} 
          heading={heading}
          isRider={true}
        />
      )}
    </>
  )
}

export default function Map({ center, zoom = 13, className = "h-96 w-full" }: MapProps) {
  return (
    <div className={className}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  )
}
