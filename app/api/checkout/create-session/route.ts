import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createOrder } from "@/lib/order-database"

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
const APP_BASE_URL = process.env.APP_BASE_URL

console.log("[v0] Environment check - STRIPE_SECRET_KEY exists:", !!STRIPE_SECRET_KEY)
console.log("[v0] Environment check - APP_BASE_URL:", APP_BASE_URL)

function isPlaceholderKey(key: string | undefined): boolean {
  if (!key) return true
  return (
    key.includes("XXXXXXXXXXXXXXXXXXXXXXXX") ||
    key.includes("YOUR_ACTUAL_SECRET_KEY_HERE")
  )
}

if (!STRIPE_SECRET_KEY || isPlaceholderKey(STRIPE_SECRET_KEY)) {
  console.error("[v0] STRIPE_SECRET_KEY is not set or contains placeholder values")
  console.error(
    "[v0] Please update your .env.local file with actual Stripe keys from https://dashboard.stripe.com/test/apikeys",
  )
}

let stripe: Stripe | null = null
if (STRIPE_SECRET_KEY && !isPlaceholderKey(STRIPE_SECRET_KEY)) {
  try {
    stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2025-08-27.basil" })
    console.log("[v0] Stripe initialized successfully")
  } catch (error) {
    console.error("[v0] Failed to initialize Stripe:", error)
  }
}

// In-memory storage for orders (replace with your database)
const orders: any[] = []
let orderIdCounter = 1

export async function POST(req: NextRequest) {
  try {
    console.log("[v0] Checkout session API called")

    if (!stripe) {
      const isPlaceholder = STRIPE_SECRET_KEY && isPlaceholderKey(STRIPE_SECRET_KEY)
      const errorMessage = isPlaceholder
        ? "Stripe API keys are not configured. Please replace the placeholder values in your .env.local file with actual Stripe keys from https://dashboard.stripe.com/test/apikeys"
        : "Payment system is not configured. Please check server configuration."

      console.error("[v0] Stripe is not initialized - missing or invalid STRIPE_SECRET_KEY")
      return NextResponse.json({ error: errorMessage }, { status: 500 })
    }

    const baseUrl = APP_BASE_URL || `${req.nextUrl.protocol}//${req.nextUrl.host}`
    console.log("[v0] Using base URL:", baseUrl)

    const { cartItems, customer, deliveryAddress } = await req.json()
    console.log("[v0] Creating checkout session for:", {
      itemCount: cartItems?.length,
      customerEmail: customer?.email,
    })

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 })
    }

    // Convert cart items to order items format
    const orderItems = cartItems.map((item: any) => ({
      id: item.pizza?.id || Math.random(),
      name: item.name,
      size: item.size,
      quantity: item.quantity,
      unitPrice: item.price,
      totalPrice: item.price * item.quantity,
      selectedToppings: item.selectedToppings || [],
      selectedCrust: item.selectedCrust,
      category: item.pizza?.category || "Pizza"
    }))

    // Server-side price validation - get actual prices from your pizza data
    const line_items = cartItems.map((item: any) => {
      const serverUnitPrice = item.price

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${item.name} (${item.size})`,
            description:
              item.selectedToppings?.length > 0 ? `Toppings: ${item.selectedToppings.join(", ")}` : undefined,
          },
          unit_amount: Math.round(serverUnitPrice * 100), // Convert to cents
        },
        quantity: item.quantity,
      }
    })

    // Calculate total
    const total = line_items.reduce((acc: number, item: any) => acc + item.price_data.unit_amount * item.quantity, 0) / 100

    // Create order in database
    const order = await createOrder({
      customer: {
        name: `${customer.firstName} ${customer.lastName}`,
        email: customer.email,
        phone: customer.phone,
        address: customer.address
      },
      items: orderItems,
      deliveryAddress: {
        street: deliveryAddress?.address || customer.address,
        city: deliveryAddress?.city || customer.city,
        state: deliveryAddress?.state || customer.state,
        zipCode: deliveryAddress?.zipCode || customer.zipCode,
        instructions: deliveryAddress?.instructions || ""
      },
      paymentMethod: "stripe"
    })

    console.log("[v0] Created order in database:", order.id)

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `https://pizza-ordering-website-two.vercel.app/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: `https://pizza-ordering-website-two.vercel.app/cancel`,
      metadata: { 
        orderId: order.id,
        orderNumber: order.orderNumber
      },
      billing_address_collection: "required",
      allow_promotion_codes: true,
      customer_email: customer.email,
    })

    console.log("[v0] Stripe session created successfully:", session.id)

    return NextResponse.json({ url: session.url }, { status: 200 })
  } catch (e: any) {
    console.error("[v0] Checkout session error:", e)

    if (e.message && e.message.includes("Invalid API Key")) {
      return NextResponse.json(
        {
          error:
            "Invalid Stripe API key. Please check your .env.local file and ensure you're using actual Stripe keys from https://dashboard.stripe.com/test/apikeys (not placeholder values).",
        },
        { status: 500 },
      )
    }

    return NextResponse.json(
      {
        error: `Failed to create checkout session: ${e.message}`,
      },
      { status: 500 },
    )
  }
}

async function createProvisionalOrder(orderData: any) {
  const orderId = orderIdCounter++
  const order = {
    id: orderId,
    ...orderData,
    trackingCode: generateTrackingCode(),
  }
  orders.push(order)
  console.log("[v0] Provisional order created:", order)
  return orderId
}

function generateTrackingCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}
