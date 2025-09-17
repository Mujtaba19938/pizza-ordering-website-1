import { NextRequest, NextResponse } from "next/server";
import { orderDB } from "@/lib/database/orders";
import { riderDB } from "@/lib/database/riders";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    const { riderId } = await req.json();

    // Check if order exists
    const order = await orderDB.getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if rider exists and is online
    const rider = await riderDB.getRiderById(riderId);
    if (!rider) {
      return NextResponse.json({ error: "Rider not found" }, { status: 404 });
    }

    if (rider.status !== 'online') {
      return NextResponse.json({ error: "Rider is not online" }, { status: 400 });
    }

    // Assign rider to order
    const assignment = await riderDB.assignRiderToOrder(riderId, orderId);
    if (!assignment) {
      return NextResponse.json({ error: "Failed to assign rider" }, { status: 500 });
    }

    // Update order status to out_for_delivery
    await orderDB.updateOrderStatus(orderId, 'out_for_delivery', `Assigned to rider ${rider.name}`);

    // Get the global Socket.io instance and notify rider
    const io = (global as any).io;
    if (io) {
      io.to(`rider-${riderId}`).emit('order:assigned', {
        orderId,
        order: await orderDB.getOrderById(orderId)
      });
      
      // Also emit to order and tracking rooms
      io.to(`order-${orderId}`).emit('status:update', order);
      io.to(`track-${order.trackingCode}`).emit('status:update', order);
    }

    return NextResponse.json({ 
      message: "Rider assigned successfully",
      assignment,
      order: await orderDB.getOrderById(orderId)
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error assigning rider:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
