// Order Database System
// This simulates a database for storing orders in real-time

export interface OrderItem {
  id: number
  name: string
  size: "small" | "medium" | "large"
  quantity: number
  unitPrice: number
  totalPrice: number
  selectedToppings: string[]
  selectedCrust?: string
  category: string
}

export interface Order {
  id: string
  orderNumber: string
  customer: {
    name: string
    email: string
    phone: string
    address: string
  }
  items: OrderItem[]
  subtotal: number
  tax: number
  total: number
  status: "pending" | "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled"
  paymentMethod: string
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  createdAt: string
  updatedAt: string
  deliveryAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    instructions?: string
  }
  estimatedDelivery?: string
  actualDelivery?: string
}

// In-memory storage (in production, this would be a real database)
let orders: Order[] = []
let orderCounter = 1

// Generate unique order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `#${timestamp}${random}`
}

// Create a new order
export async function createOrder(orderData: {
  customer: Order['customer']
  items: OrderItem[]
  deliveryAddress: Order['deliveryAddress']
  paymentMethod: string
}): Promise<Order> {
  const orderNumber = generateOrderNumber()
  const subtotal = orderData.items.reduce((sum, item) => sum + item.totalPrice, 0)
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + tax

  const order: Order = {
    id: `order_${Date.now()}_${orderCounter++}`,
    orderNumber,
    customer: orderData.customer,
    items: orderData.items,
    subtotal,
    tax,
    total,
    status: "pending",
    paymentMethod: orderData.paymentMethod,
    paymentStatus: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deliveryAddress: orderData.deliveryAddress,
    estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000).toISOString(), // 45 minutes from now
  }

  orders.push(order)
  
  // Simulate order processing
  setTimeout(() => {
    updateOrderStatus(order.id, "confirmed")
  }, 2000)

  setTimeout(() => {
    updateOrderStatus(order.id, "preparing")
  }, 10000)

  setTimeout(() => {
    updateOrderStatus(order.id, "out_for_delivery")
  }, 20000)

  setTimeout(() => {
    updateOrderStatus(order.id, "delivered")
  }, 30000)

  return order
}

// Get all orders (for profile page)
export async function getAllOrders(): Promise<Order[]> {
  return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// Get order by ID
export async function getOrderById(orderId: string): Promise<Order | null> {
  return orders.find(order => order.id === orderId) || null
}

// Get order by order number
export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  return orders.find(order => order.orderNumber === orderNumber) || null
}

// Update order status
export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<boolean> {
  const order = orders.find(order => order.id === orderId)
  if (order) {
    order.status = status
    order.updatedAt = new Date().toISOString()
    
    if (status === "delivered") {
      order.actualDelivery = new Date().toISOString()
    }
    
    return true
  }
  return false
}

// Update payment status
export async function updatePaymentStatus(orderId: string, paymentStatus: Order['paymentStatus']): Promise<boolean> {
  const order = orders.find(order => order.id === orderId)
  if (order) {
    order.paymentStatus = paymentStatus
    order.updatedAt = new Date().toISOString()
    return true
  }
  return false
}

// Reorder functionality - get items from a previous order
export async function getReorderItems(orderId: string): Promise<OrderItem[] | null> {
  const order = await getOrderById(orderId)
  return order ? order.items : null
}

// Get orders by status
export async function getOrdersByStatus(status: Order['status']): Promise<Order[]> {
  return orders.filter(order => order.status === status)
}

// Get recent orders (last 10)
export async function getRecentOrders(limit: number = 10): Promise<Order[]> {
  return orders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
}

// Search orders
export async function searchOrders(query: string): Promise<Order[]> {
  const lowercaseQuery = query.toLowerCase()
  return orders.filter(order => 
    order.orderNumber.toLowerCase().includes(lowercaseQuery) ||
    order.customer.name.toLowerCase().includes(lowercaseQuery) ||
    order.customer.email.toLowerCase().includes(lowercaseQuery)
  )
}

// Get order statistics
export async function getOrderStats(): Promise<{
  totalOrders: number
  totalRevenue: number
  averageOrderValue: number
  ordersByStatus: Record<string, number>
}> {
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
  
  const ordersByStatus = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    totalOrders,
    totalRevenue,
    averageOrderValue,
    ordersByStatus
  }
}

// Clear all orders (for testing)
export async function clearAllOrders(): Promise<void> {
  orders = []
  orderCounter = 1
}
