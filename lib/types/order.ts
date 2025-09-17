export interface OrderItem {
  id: string
  name: string
  size: string
  crust: string
  toppings: string[]
  quantity: number
  price: number
  image?: string
  description?: string
}

export interface Customer {
  name: string
  email: string
  phone: string
  address: {
    street: string
    city: string
    state: string
    zip: string
    instructions?: string
    lat?: string
    lng?: string
  }
}

export interface Payment {
  provider: 'stripe' | 'cash'
  intentId?: string
  amount: number
  currency: string
  status: 'pending' | 'paid' | 'failed'
}

export type OrderStatus = 
  | 'pending_payment' 
  | 'paid' 
  | 'preparing' 
  | 'baking' 
  | 'out_for_delivery' 
  | 'delivered'

export interface Order {
  id: string
  status: OrderStatus
  customer: Customer
  items: OrderItem[]
  total: number
  payment: Payment
  trackingCode: string
  assignedRiderId?: string
  timestamps: {
    createdAt: Date
    updatedAt: Date
  }
  metadata?: {
    sessionId?: string
    notes?: string
  }
}

export interface OrderUpdate {
  orderId: string
  status: OrderStatus
  timestamp: Date
  notes?: string
  riderId?: string
}

// For the simple in-memory database we'll use for now
export interface OrderDatabase {
  orders: Map<string, Order>
  trackingCodes: Map<string, string> // trackingCode -> orderId
}
