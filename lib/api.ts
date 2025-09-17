// API utility functions for client-side requests

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export async function createPaymentIntent(amount: number, currency = "usd"): Promise<ApiResponse> {
  try {
    console.log("[v0] Creating payment intent for amount:", amount)
    const response = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, currency }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Payment intent API error:", response.status, errorText)
      return { success: false, error: `API Error: ${response.status} - ${errorText}` }
    }

    const result = await response.json()
    console.log("[v0] Payment intent result:", result)
    return result
  } catch (error) {
    console.error("[v0] Payment intent network error:", error)
    return { success: false, error: `Network error: ${error instanceof Error ? error.message : "Unknown error"}` }
  }
}

export async function createPayPalOrder(amount: number, currency = "USD"): Promise<ApiResponse> {
  try {
    console.log("[v0] Creating PayPal order for amount:", amount)
    const response = await fetch("/api/create-paypal-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, currency }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] PayPal API error:", response.status, errorText)
      return { success: false, error: `API Error: ${response.status} - ${errorText}` }
    }

    const result = await response.json()
    console.log("[v0] PayPal order result:", result)
    return result
  } catch (error) {
    console.error("[v0] PayPal network error:", error)
    return { success: false, error: `Network error: ${error instanceof Error ? error.message : "Unknown error"}` }
  }
}

export async function capturePayPalOrder(orderId: string): Promise<ApiResponse> {
  try {
    const response = await fetch("/api/capture-paypal-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: "Network error" }
  }
}

export async function processAffirmCheckout(amount: number, currency = "USD"): Promise<ApiResponse> {
  try {
    console.log("[v0] Processing Affirm checkout for amount:", amount)
    const response = await fetch("/api/affirm-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, currency }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Affirm API error:", response.status, errorText)
      return { success: false, error: `API Error: ${response.status} - ${errorText}` }
    }

    const result = await response.json()
    console.log("[v0] Affirm checkout result:", result)
    return result
  } catch (error) {
    console.error("[v0] Affirm network error:", error)
    return { success: false, error: `Network error: ${error instanceof Error ? error.message : "Unknown error"}` }
  }
}

export async function createOrder(orderData: any): Promise<ApiResponse> {
  try {
    console.log("[v0] Creating order with data:", orderData)
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Orders API error:", response.status, errorText)
      return { success: false, error: `API Error: ${response.status} - ${errorText}` }
    }

    const result = await response.json()
    console.log("[v0] Order creation result:", result)
    return result
  } catch (error) {
    console.error("[v0] Order creation network error:", error)
    return { success: false, error: `Network error: ${error instanceof Error ? error.message : "Unknown error"}` }
  }
}

export async function getOrder(orderId: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`/api/orders?id=${orderId}`)
    return await response.json()
  } catch (error) {
    return { success: false, error: "Network error" }
  }
}

export async function updateOrderStatus(orderId: string, status: string): Promise<ApiResponse> {
  try {
    const response = await fetch(`/api/orders/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    return await response.json()
  } catch (error) {
    return { success: false, error: "Network error" }
  }
}

export async function getMenu(): Promise<ApiResponse> {
  try {
    const response = await fetch("/api/menu")
    return await response.json()
  } catch (error) {
    return { success: false, error: "Network error" }
  }
}
