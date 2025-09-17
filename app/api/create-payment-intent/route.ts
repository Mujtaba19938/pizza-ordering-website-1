import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = "usd" } = await request.json()

    // Mock Stripe PaymentIntent creation
    // In production, you would use the actual Stripe SDK:
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: Math.round(amount * 100), // Convert to cents
    //   currency,
    //   metadata: { integration_check: 'accept_a_payment' },
    // });

    const mockPaymentIntent = {
      id: `pi_${Math.random().toString(36).substr(2, 9)}`,
      client_secret: `pi_${Math.random().toString(36).substr(2, 9)}_secret_${Math.random().toString(36).substr(2, 9)}`,
      amount: Math.round(amount * 100),
      currency,
      status: "requires_payment_method",
    }

    return NextResponse.json({
      success: true,
      paymentIntent: mockPaymentIntent,
    })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json({ success: false, error: "Failed to create payment intent" }, { status: 500 })
  }
}
