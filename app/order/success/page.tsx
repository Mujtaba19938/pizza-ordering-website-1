"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, MapPin, Clock, CreditCard, ArrowRight } from "lucide-react"
import Link from "next/link"

interface OrderDetails {
  id: string
  status: string
  total: number
  items: any[]
  customer: {
    name: string
    email: string
    phone: string
  }
  trackingCode: string
  estimatedDelivery: string
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (sessionId) {
      // In a real app, you would fetch order details from your database
      // using the session_id to look up the order
      fetchOrderDetails(sessionId)
    } else {
      setLoading(false)
    }
  }, [sessionId])

  const fetchOrderDetails = async (sessionId: string) => {
    try {
      // For now, we'll simulate fetching order details
      // In a real app, you would create an endpoint to fetch order by session ID
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock order details for demonstration
      // In production, this would fetch from the database using the session ID
      setOrderDetails({
        id: "ORD-" + Date.now(),
        status: "paid",
        total: 45.99,
        items: [
          { name: "Supreme Deluxe", quantity: 1, price: 28.99 },
          { name: "Margherita Classic", quantity: 1, price: 16.99 }
        ],
        customer: {
          name: "John Doe",
          email: "john@example.com",
          phone: "(555) 123-4567"
        },
        trackingCode: "TRK" + Math.random().toString(36).substr(2, 8).toUpperCase(),
        estimatedDelivery: "30-45 minutes"
      })
    } catch (error) {
      console.error("Error fetching order details:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-md mx-auto">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d62828] mx-auto mb-4"></div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Loading Order Details...</h1>
              <p className="text-gray-600">Please wait while we fetch your order information.</p>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  if (!orderDetails) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-md mx-auto">
              <h1 className="text-4xl font-black text-gray-800 mb-4">Order Not Found</h1>
              <p className="text-gray-600 mb-8">We couldn't find your order details.</p>
              <Link href="/menu">
                <Button className="bg-[#d62828] hover:bg-[#b91c1c] text-white font-bold px-8 py-3">
                  Browse Our Menu
                </Button>
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Success Hero Section */}
      <section className="bg-[#d62828] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="relative mb-6">
            <CheckCircle className="w-24 h-24 text-green-400 mx-auto animate-bounce" />
            <div className="absolute inset-0 w-24 h-24 mx-auto border-4 border-green-400 rounded-full animate-ping opacity-20"></div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4">ORDER CONFIRMED!</h1>
          <p className="text-xl md:text-2xl mb-8">Thank you for your order. We're preparing your delicious pizza!</p>
          <div className="flex justify-center items-center space-x-4">
            <div className="w-16 h-1 bg-[#ffbe0b]"></div>
            <span className="text-[#ffbe0b] font-bold">FRESH • HOT • DELIVERED</span>
            <div className="w-16 h-1 bg-[#ffbe0b]"></div>
          </div>
        </div>
      </section>

      {/* Order Details */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Order Summary */}
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-black text-gray-800 flex items-center">
                    <CreditCard className="w-6 h-6 mr-3 text-[#d62828]" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID</span>
                      <span className="font-bold">{orderDetails.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tracking Code</span>
                      <span className="font-bold text-[#d62828]">{orderDetails.trackingCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status</span>
                      <span className="font-bold text-green-600 capitalize">{orderDetails.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total</span>
                      <span className="font-bold text-2xl text-[#d62828]">${orderDetails.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-bold text-gray-800">Items Ordered:</h4>
                    {orderDetails.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.name} x{item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Information */}
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-black text-gray-800 flex items-center">
                    <MapPin className="w-6 h-6 mr-3 text-[#d62828]" />
                    Delivery Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">Customer Details</h4>
                      <p className="text-gray-600">{orderDetails.customer.name}</p>
                      <p className="text-gray-600">{orderDetails.customer.email}</p>
                      <p className="text-gray-600">{orderDetails.customer.phone}</p>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-[#d62828]/10 rounded-lg">
                      <Clock className="w-6 h-6 text-[#d62828]" />
                      <div>
                        <p className="font-bold text-gray-800">Estimated Delivery</p>
                        <p className="text-[#d62828] font-bold text-lg">{orderDetails.estimatedDelivery}</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Link href={`/track/${orderDetails.trackingCode}`}>
                        <Button className="w-full bg-[#ffbe0b] hover:bg-[#e6a800] text-black font-bold text-lg py-3 transition-all duration-200 hover:scale-105">
                          Track Your Order
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="mt-12 text-center space-y-4">
              <p className="text-gray-600 mb-6">
                You will receive a confirmation email shortly with your order details and tracking information.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/menu">
                  <Button variant="outline" className="border-[#d62828] text-[#d62828] hover:bg-[#d62828] hover:text-white px-8 py-3">
                    Order More Pizza
                  </Button>
                </Link>
                <Link href="/">
                  <Button className="bg-[#d62828] hover:bg-[#b91c1c] text-white font-bold px-8 py-3">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
