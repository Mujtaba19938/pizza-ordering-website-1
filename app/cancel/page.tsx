import Link from "next/link"
import { Button } from "@/components/ui/button"
import { headers } from "next/headers"

export const revalidate = 0 // Force revalidation on every request

export default function CancelPage() {
  // Force fresh content on every load
  const headersList = headers()
  const timestamp = Date.now()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Canceled</h1>
          <p className="text-gray-600">Please try again.</p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Your order was not processed. Your cart items are still saved and ready for checkout.
          </p>

          <div className="flex flex-col gap-3">
            <Button asChild className="bg-pizza-red hover:bg-pizza-red/90">
              <Link href="/cart">Return to Cart</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/menu">Continue Shopping</Link>
            </Button>
          </div>
        </div>
        
        {/* Hidden timestamp to prevent caching */}
        <div style={{ display: 'none' }}>{timestamp}</div>
      </div>
    </div>
  )
}
