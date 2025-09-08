import { type NextRequest, NextResponse } from "next/server"
import { writeFile, readFile } from "fs/promises"
import path from "path"

const ORDERS_FILE = path.join(process.cwd(), "data", "orders.json")

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json()
    const orderId = params.id

    const data = await readFile(ORDERS_FILE, "utf-8")
    const orders = JSON.parse(data)

    const orderIndex = orders.findIndex((order: any) => order.id === orderId)
    if (orderIndex === -1) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    orders[orderIndex].status = status
    orders[orderIndex].updatedAt = new Date().toISOString()

    await writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2))

    return NextResponse.json({
      success: true,
      order: orders[orderIndex],
    })
  } catch (error) {
    console.error("Error updating order status:", error)
    return NextResponse.json({ success: false, error: "Failed to update order status" }, { status: 500 })
  }
}
