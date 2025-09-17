import { NextRequest, NextResponse } from "next/server";
import { orderDB } from "@/lib/database/orders";

// GET /api/track/[code] - Get order by tracking code (public)
export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const trackingCode = params.code;
    const order = await orderDB.getOrderByTrackingCode(trackingCode);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching order by tracking code:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
