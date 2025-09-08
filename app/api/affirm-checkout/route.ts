import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = "USD" } = await request.json()

    // Mock Affirm checkout - always returns success
    const mockAffirmResponse = {
      id: `AFFIRM_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      status: "authorized",
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      checkout_token: `checkout_${Math.random().toString(36).substr(2, 16)}`,
      redirect_url: `https://sandbox.affirm.com/checkout/${Math.random().toString(36).substr(2, 16)}`,
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      affirm: mockAffirmResponse,
    })
  } catch (error) {
    console.error("Error processing Affirm checkout:", error)
    return NextResponse.json({ success: false, error: "Failed to process Affirm checkout" }, { status: 500 })
  }
}
