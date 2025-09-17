export interface Rider {
  id: string
  name: string
  email: string
  phone: string
  status: 'offline' | 'online' | 'busy'
  currentLocation?: {
    lat: number
    lng: number
    heading?: number
    speed?: number
    timestamp: Date
  }
  assignedOrderId?: string
  timestamps: {
    createdAt: Date
    updatedAt: Date
    lastSeen: Date
  }
}

export interface RiderLocation {
  riderId: string
  orderId?: string
  lat: number
  lng: number
  heading?: number
  speed?: number
  timestamp: Date
}

export interface RiderAssignment {
  riderId: string
  orderId: string
  assignedAt: Date
  status: 'assigned' | 'accepted' | 'picked_up' | 'delivered'
}
