import { type NextRequest, NextResponse } from "next/server"

interface Order {
  id: string
  items: Array<{
    pizza: {
      id: number
      name: string
      description: string
      image: string
    }
    size: string
    quantity: number
    price: number
  }>
  billingInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
  }
  paymentMethod: string
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  status: "confirmed" | "preparing" | "baking" | "delivery" | "delivered"
  createdAt: string
  estimatedDelivery: string
}

const orders: Order[] = []

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Orders API POST called")
    const orderData = await request.json()
    console.log("[v0] Order data received:", orderData)

    const newOrder: Order = {
      id: `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      ...orderData,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 25 * 60 * 1000).toISOString(), // 25 minutes from now
    }

    console.log("[v0] Created new order:", newOrder)
    orders.push(newOrder)
    console.log("[v0] Orders array now has", orders.length, "orders")

    return NextResponse.json({
      success: true,
      order: newOrder,
    })
  } catch (error) {
    console.error("[v0] Error creating order:", error)
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Orders API GET called")
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("id")

    if (orderId) {
      const order = orders.find((o) => o.id === orderId)
      if (!order) {
        return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
      }
      return NextResponse.json({ success: true, order })
    }

    return NextResponse.json({ success: true, orders })
  } catch (error) {
    console.error("[v0] Error fetching orders:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 })
  }
}
