import { Rider, RiderLocation, RiderAssignment } from '../types/rider'

class RiderDatabaseManager {
  private riders: Map<string, Rider> = new Map()
  private assignments: Map<string, RiderAssignment> = new Map()
  private locations: Map<string, RiderLocation[]> = new Map()

  // Create a new rider
  async createRider(riderData: {
    name: string
    email: string
    phone: string
  }): Promise<Rider> {
    const riderId = `RIDER-${Date.now()}`
    const now = new Date()

    const rider: Rider = {
      id: riderId,
      name: riderData.name,
      email: riderData.email,
      phone: riderData.phone,
      status: 'offline',
      timestamps: {
        createdAt: now,
        updatedAt: now,
        lastSeen: now
      }
    }

    this.riders.set(riderId, rider)
    console.log('Created rider:', riderId)
    return rider
  }

  // Get rider by ID
  async getRiderById(riderId: string): Promise<Rider | null> {
    return this.riders.get(riderId) || null
  }

  // Get all riders
  async getAllRiders(): Promise<Rider[]> {
    return Array.from(this.riders.values())
  }

  // Get online riders
  async getOnlineRiders(): Promise<Rider[]> {
    return Array.from(this.riders.values()).filter(rider => rider.status === 'online')
  }

  // Update rider status
  async updateRiderStatus(riderId: string, status: 'offline' | 'online' | 'busy'): Promise<Rider | null> {
    const rider = this.riders.get(riderId)
    if (!rider) return null

    rider.status = status
    rider.timestamps.updatedAt = new Date()
    rider.timestamps.lastSeen = new Date()

    this.riders.set(riderId, rider)
    console.log('Updated rider status:', { riderId, status })
    return rider
  }

  // Update rider location
  async updateRiderLocation(locationData: RiderLocation): Promise<void> {
    const rider = this.riders.get(locationData.riderId)
    if (!rider) return

    // Update rider's current location
    rider.currentLocation = {
      lat: locationData.lat,
      lng: locationData.lng,
      heading: locationData.heading,
      speed: locationData.speed,
      timestamp: locationData.timestamp
    }
    rider.timestamps.lastSeen = locationData.timestamp

    this.riders.set(locationData.riderId, rider)

    // Store location history
    const locations = this.locations.get(locationData.riderId) || []
    locations.push(locationData)
    
    // Keep only last 100 locations
    if (locations.length > 100) {
      locations.splice(0, locations.length - 100)
    }
    
    this.locations.set(locationData.riderId, locations)

    console.log('Updated rider location:', { 
      riderId: locationData.riderId, 
      lat: locationData.lat, 
      lng: locationData.lng 
    })
  }

  // Assign rider to order
  async assignRiderToOrder(riderId: string, orderId: string): Promise<RiderAssignment | null> {
    const rider = this.riders.get(riderId)
    if (!rider) return null

    const assignment: RiderAssignment = {
      riderId,
      orderId,
      assignedAt: new Date(),
      status: 'assigned'
    }

    this.assignments.set(orderId, assignment)
    rider.assignedOrderId = orderId
    rider.status = 'busy'
    rider.timestamps.updatedAt = new Date()

    this.riders.set(riderId, rider)
    console.log('Assigned rider to order:', { riderId, orderId })
    return assignment
  }

  // Get rider assignment
  async getRiderAssignment(orderId: string): Promise<RiderAssignment | null> {
    return this.assignments.get(orderId) || null
  }

  // Update assignment status
  async updateAssignmentStatus(orderId: string, status: 'assigned' | 'accepted' | 'picked_up' | 'delivered'): Promise<RiderAssignment | null> {
    const assignment = this.assignments.get(orderId)
    if (!assignment) return null

    assignment.status = status
    this.assignments.set(orderId, assignment)

    console.log('Updated assignment status:', { orderId, status })
    return assignment
  }

  // Get rider location history
  async getRiderLocationHistory(riderId: string): Promise<RiderLocation[]> {
    return this.locations.get(riderId) || []
  }

  // Get rider's current assignment
  async getRiderCurrentAssignment(riderId: string): Promise<RiderAssignment | null> {
    const rider = this.riders.get(riderId)
    if (!rider || !rider.assignedOrderId) return null

    return this.assignments.get(rider.assignedOrderId) || null
  }
}

// Export singleton instance
export const riderDB = new RiderDatabaseManager()
