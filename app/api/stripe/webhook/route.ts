import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

let stripe: Stripe | null = null
let webhookSecret: string | null = null

if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" })
  webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  console.log("[v0] Stripe webhook initialized successfully")
} else {
  console.warn("[v0] Stripe webhook not initialized - missing environment variables")
}

// In-memory storage (should match the one in create-session)
const orders: any[] = []

export async function POST(req: NextRequest) {
  if (!stripe || !webhookSecret) {
    console.error("[v0] Stripe webhook not configured - missing environment variables")
    return NextResponse.json({ error: "Webhook not configured - missing environment variables" }, { status: 500 })
  }

  const sig = req.headers.get("stripe-signature")!
  const buf = Buffer.from(await req.arrayBuffer())

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret)
    console.log("[v0] Webhook event received:", event.type)
  } catch (err: any) {
    console.error("[v0] Webhook signature verification failed:", err.message)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session
      const orderId = session.metadata?.orderId

      console.log("[v0] Payment completed for order:", orderId)

      await markOrderPaid({
        orderId,
        paymentIntentId: session.payment_intent,
        customerEmail: session.customer_details?.email,
        amountTotal: session.amount_total,
      })
    }

    if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log("[v0] Payment failed:", paymentIntent.id)
      // Handle payment failure if needed
    }

    return NextResponse.json({ received: true })
  } catch (e: any) {
    console.error("[v0] Webhook processing error:", e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

async function markOrderPaid(data: any) {
  const { orderId, paymentIntentId, customerEmail, amountTotal } = data

  // Find and update the order
  const orderIndex = orders.findIndex((order) => order.id === Number.parseInt(orderId))
  if (orderIndex !== -1) {
    orders[orderIndex] = {
      ...orders[orderIndex],
      status: "paid",
      payment: {
        provider: "stripe",
        intentId: paymentIntentId,
        amount: amountTotal,
        currency: "usd",
      },
      customerEmail,
      updatedAt: new Date().toISOString(),
    }

    console.log("[v0] Order marked as paid:", orders[orderIndex])

    // TODO: Trigger any post-payment actions (email, notifications, etc.)
  } else {
    console.error("[v0] Order not found for payment:", orderId)
  }
}
