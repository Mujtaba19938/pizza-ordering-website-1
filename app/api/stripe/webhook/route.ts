import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { orderDB } from "@/lib/database/orders";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-08-27.basil" });

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature")!;
  const buf = Buffer.from(await req.arrayBuffer());

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;
      
      if (!orderId) {
        console.error("No orderId found in session metadata");
        return NextResponse.json({ error: "No orderId found" }, { status: 400 });
      }

      // Update order status to paid and payment information
      await orderDB.updateOrderStatus(orderId, 'paid', 'Payment completed via Stripe');
      await orderDB.updatePayment(orderId, {
        intentId: session.payment_intent as string,
        status: 'paid'
      });

      console.log("Order marked as paid:", orderId);
    }

    if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata?.orderId;
      
      if (orderId) {
        await orderDB.updateOrderStatus(orderId, 'pending_payment', 'Payment failed');
        await orderDB.updatePayment(orderId, {
          status: 'failed'
        });

        console.log("Order marked as failed:", orderId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (e: any) {
    console.error("Webhook processing error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

