import { NextRequest, NextResponse } from "next/server";
import { orderDB } from "@/lib/database/orders";
import { OrderStatus } from "@/lib/types/order";

// Helper function to emit socket events
async function emitOrderUpdate(orderId: string, order: any) {
  try {
    // Get the global Socket.io instance
    const io = (global as any).io;
    
    if (io) {
      // Emit to order room
      io.to(`order-${orderId}`).emit('status:update', order);
      
      // Emit to tracking room
      io.to(`track-${order.trackingCode}`).emit('status:update', order);
      
      console.log(`Emitted order update for ${orderId}:`, order.status);
    } else {
      console.log('Socket.io not available, order update logged:', order.status);
    }
  } catch (error) {
    console.error("Error emitting order update:", error);
  }
}

// POST /api/orders/[id]/status - Update order status (secure, for admin)
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    const { status, notes, riderId } = await req.json();

    // Validate status
    const validStatuses: OrderStatus[] = [
      'pending_payment', 'paid', 'preparing', 'baking', 'out_for_delivery', 'delivered'
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ 
        error: "Invalid status. Must be one of: " + validStatuses.join(', ') 
      }, { status: 400 });
    }

    // Update order status
    const updatedOrder = await orderDB.updateOrderStatus(orderId, status, notes);

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // If riderId is provided, assign rider
    if (riderId) {
      await orderDB.assignRider(orderId, riderId);
    }

    // Emit real-time update
    await emitOrderUpdate(orderId, updatedOrder);

    return NextResponse.json({ 
      message: "Order status updated successfully",
      order: updatedOrder 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error updating order status:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
