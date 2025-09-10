import { NextRequest, NextResponse } from "next/server"
import { getAllOrders, getOrderById, getOrderByNumber } from "@/lib/order-database"

// GET /api/orders - Get all orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('id')
    const orderNumber = searchParams.get('number')

    if (orderId) {
      const order = await getOrderById(orderId)
      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 })
      }
      return NextResponse.json({ order })
    }

    if (orderNumber) {
      const order = await getOrderByNumber(orderNumber)
      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 })
      }
      return NextResponse.json({ order })
    }

    const orders = await getAllOrders()
    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}