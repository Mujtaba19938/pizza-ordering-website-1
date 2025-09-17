"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Package, Clock } from "lucide-react"

export function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get("session_id")
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (sessionId) {
      fetchOrderDetails(sessionId)
    } else {
      setLoading(false)
    }
  }, [sessionId])

  const fetchOrderDetails = async (sessionId: string) => {
    try {
      // Optional: Fetch session details from Stripe for receipt
      console.log("[v0] Fetching order details for session:", sessionId)
      // For now, just show success without fetching details
      setLoading(false)
    } catch (error) {
      console.error("[v0] Error fetching order details:", error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Processing your order...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your order. We've received your payment and your delicious pizza is being prepared.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              What's Next?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 text-left">
              <Clock className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold">Estimated Delivery Time</h3>
                <p className="text-sm text-muted-foreground">25-35 minutes</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              You'll receive an email confirmation shortly with your order details and tracking information.
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Button onClick={() => router.push("/track/ABC123")} className="w-full bg-primary hover:bg-primary/90">
            Track Your Order
          </Button>
          <Button variant="outline" onClick={() => router.push("/menu")} className="w-full">
            Order More Pizza
          </Button>
        </div>
      </div>
    </div>
  )
}
