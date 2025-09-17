import Link from "next/link"
import { Button } from "@/components/ui/button"
import { headers } from "next/headers"

export const revalidate = 0 // Force revalidation on every request

export default function SuccessPage() {
  // Force fresh content on every load
  const headersList = headers()
  const timestamp = Date.now()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">✅</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">Your pizza order is confirmed.</p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            You'll receive an email confirmation shortly with your order details and tracking information.
          </p>

          <div className="flex flex-col gap-3">
            <Button asChild className="bg-pizza-red hover:bg-pizza-red/90">
              <Link href="/order-tracking">Track Your Order</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/menu">Order More Pizza</Link>
            </Button>
          </div>
        </div>
        
        {/* Hidden timestamp to prevent caching */}
        <div style={{ display: 'none' }}>{timestamp}</div>
      </div>
    </div>
  )
}
