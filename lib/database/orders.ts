import { Order, OrderDatabase, OrderStatus, OrderItem, Customer, Payment } from '../types/order'

// Simple in-memory database for development
// In production, this would be replaced with a real database like PostgreSQL, MongoDB, etc.
class OrderDatabaseManager {
  private db: OrderDatabase = {
    orders: new Map(),
    trackingCodes: new Map()
  }

  // Generate a unique tracking code
  private generateTrackingCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = 'TRK'
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  // Create a new order
  async createOrder(orderData: {
    customer: Customer
    items: OrderItem[]
    total: number
    payment: Payment
    status?: OrderStatus
    metadata?: any
  }): Promise<Order> {
    const orderId = `ORD-${Date.now()}`
    const trackingCode = this.generateTrackingCode()
    const now = new Date()

    const order: Order = {
      id: orderId,
      status: orderData.status || 'pending_payment',
      customer: orderData.customer,
      items: orderData.items,
      total: orderData.total,
      payment: orderData.payment,
      trackingCode,
      timestamps: {
        createdAt: now,
        updatedAt: now
      },
      metadata: orderData.metadata
    }

    this.db.orders.set(orderId, order)
    this.db.trackingCodes.set(trackingCode, orderId)

    console.log('Created order:', { orderId, trackingCode, status: order.status })
    return order
  }

  // Get order by ID
  async getOrderById(orderId: string): Promise<Order | null> {
    return this.db.orders.get(orderId) || null
  }

  // Get order by tracking code
  async getOrderByTrackingCode(trackingCode: string): Promise<Order | null> {
    const orderId = this.db.trackingCodes.get(trackingCode)
    if (!orderId) return null
    return this.getOrderById(orderId)
  }

  // Update order status
  async updateOrderStatus(orderId: string, status: OrderStatus, notes?: string): Promise<Order | null> {
    const order = this.db.orders.get(orderId)
    if (!order) return null

    order.status = status
    order.timestamps.updatedAt = new Date()
    if (notes) {
      order.metadata = { ...order.metadata, notes }
    }

    this.db.orders.set(orderId, order)
    console.log('Updated order status:', { orderId, status, notes })
    return order
  }

  // Assign rider to order
  async assignRider(orderId: string, riderId: string): Promise<Order | null> {
    const order = this.db.orders.get(orderId)
    if (!order) return null

    order.assignedRiderId = riderId
    order.timestamps.updatedAt = new Date()

    this.db.orders.set(orderId, order)
    console.log('Assigned rider to order:', { orderId, riderId })
    return order
  }

  // Get all orders (for admin)
  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.db.orders.values())
  }

  // Get orders by status
  async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    return Array.from(this.db.orders.values()).filter(order => order.status === status)
  }

  // Update payment information
  async updatePayment(orderId: string, paymentData: Partial<Payment>): Promise<Order | null> {
    const order = this.db.orders.get(orderId)
    if (!order) return null

    order.payment = { ...order.payment, ...paymentData }
    order.timestamps.updatedAt = new Date()

    this.db.orders.set(orderId, order)
    console.log('Updated payment for order:', { orderId, payment: order.payment })
    return order
  }
}

// Export singleton instance
export const orderDB = new OrderDatabaseManager()
