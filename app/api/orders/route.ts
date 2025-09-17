import { NextRequest, NextResponse } from "next/server";
import { orderDB } from "@/lib/database/orders";

// GET /api/orders - Get all orders (secure, for admin)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let orders;
    if (status) {
      orders = await orderDB.getOrdersByStatus(status as any);
    } else {
      orders = await orderDB.getAllOrders();
    }

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
