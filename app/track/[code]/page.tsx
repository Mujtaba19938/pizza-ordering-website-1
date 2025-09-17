"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle, 
  Clock, 
  ChefHat, 
  Truck, 
  MapPin, 
  Phone, 
  Mail,
  ArrowLeft,
  RefreshCw,
  Wifi,
  WifiOff
} from "lucide-react"
import Link from "next/link"
import { Order, OrderStatus } from "@/lib/types/order"
import { useOrderUpdates } from "@/hooks/use-order-updates"
import { MapWithRider } from "@/components/map"
import { useSocket } from "@/contexts/socket-context"

const statusConfig = {
  pending_payment: {
    label: "Pending Payment",
    icon: Clock,
    color: "bg-yellow-100 text-yellow-800",
    description: "Waiting for payment confirmation"
  },
  paid: {
    label: "Paid",
    icon: CheckCircle,
    color: "bg-green-100 text-green-800",
    description: "Payment confirmed, preparing your order"
  },
  preparing: {
    label: "Preparing",
    icon: ChefHat,
    color: "bg-blue-100 text-blue-800",
    description: "Our chefs are preparing your delicious pizza"
  },
  baking: {
    label: "Baking",
    icon: ChefHat,
    color: "bg-orange-100 text-orange-800",
    description: "Your pizza is in the oven"
  },
  out_for_delivery: {
    label: "Out for Delivery",
    icon: Truck,
    color: "bg-purple-100 text-purple-800",
    description: "Your order is on its way"
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle,
    color: "bg-green-100 text-green-800",
    description: "Order delivered successfully"
  }
}

export default function TrackOrderPage() {
  const params = useParams()
  const trackingCode = params.code as string
  const [error, setError] = useState<string | null>(null)
  const [riderPosition, setRiderPosition] = useState<[number, number] | null>(null)
  const [riderHeading, setRiderHeading] = useState<number | undefined>(undefined)
  const { socket } = useSocket()

  // Use real-time order updates
  const { order, loading, isConnected } = useOrderUpdates({
    trackingCode,
    onStatusUpdate: (updatedOrder) => {
      console.log('Order status updated:', updatedOrder.status)
    }
  })

  // Listen for rider location updates
  useEffect(() => {
    if (!socket || !order) return

    const handleRiderLocation = (data: {
      riderId: string
      orderId: string
      lat: number
      lng: number
      heading?: number
      speed?: number
    }) => {
      if (data.orderId === order.id) {
        setRiderPosition([data.lat, data.lng])
        setRiderHeading(data.heading)
        console.log('Rider location update:', data)
      }
    }

    socket.on('rider:location', handleRiderLocation)

    return () => {
      socket.off('rider:location', handleRiderLocation)
    }
  }, [socket, order])

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/track/${trackingCode}`)
      const data = await response.json()

      if (response.ok) {
        setError(null)
      } else {
        setError(data.error || 'Order not found')
      }
    } catch (err) {
      console.error('Error fetching order:', err)
      setError('Failed to fetch order details')
    }
  }

  const getStatusProgress = (status: OrderStatus) => {
    const statuses: OrderStatus[] = ['pending_payment', 'paid', 'preparing', 'baking', 'out_for_delivery', 'delivered']
    const currentIndex = statuses.indexOf(status)
    return ((currentIndex + 1) / statuses.length) * 100
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

  if (error || !order) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-md mx-auto">
              <h1 className="text-4xl font-black text-gray-800 mb-4">Order Not Found</h1>
              <p className="text-gray-600 mb-8">
                {error || "We couldn't find an order with that tracking code."}
              </p>
              <div className="space-y-4">
                <Button 
                  onClick={fetchOrderDetails}
                  className="bg-[#d62828] hover:bg-[#b91c1c] text-white font-bold px-8 py-3"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <div>
                  <Link href="/menu">
                    <Button variant="outline" className="border-[#d62828] text-[#d62828] hover:bg-[#d62828] hover:text-white">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Menu
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

  const currentStatus = statusConfig[order.status]
  const StatusIcon = currentStatus.icon
  const progress = getStatusProgress(order.status)

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-[#d62828] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-4">TRACK YOUR ORDER</h1>
          <p className="text-xl md:text-2xl mb-8">Order #{order.id}</p>
          <div className="flex justify-center items-center space-x-4">
            <div className="w-16 h-1 bg-[#ffbe0b]"></div>
            <span className="text-[#ffbe0b] font-bold">FRESH • HOT • DELIVERED</span>
            <div className="w-16 h-1 bg-[#ffbe0b]"></div>
          </div>
        </div>
      </section>

      {/* Order Tracking */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Map Section - Show when order is out for delivery */}
            {order && (order.status === 'out_for_delivery' || order.status === 'delivered') && (
              <div className="mb-8">
                <Card className="border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl font-black text-gray-800 flex items-center">
                      <MapPin className="w-6 h-6 mr-3 text-[#d62828]" />
                      Live Delivery Tracking
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96 w-full">
                      <MapWithRider
                        center={[
                          parseFloat(order.customer.address.lat || '40.7128'), 
                          parseFloat(order.customer.address.lng || '-74.0060')
                        ]}
                        riderPosition={riderPosition || undefined}
                        heading={riderHeading}
                      />
                    </div>
                    {riderPosition ? (
                      <div className="mt-4 p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-2 text-green-800">
                          <Truck className="w-5 h-5" />
                          <span className="font-medium">Rider is on the way!</span>
                        </div>
                        <p className="text-sm text-green-600 mt-1">
                          Your delivery rider is currently at the location shown on the map.
                        </p>
                      </div>
                    ) : (
                      <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                        <div className="flex items-center space-x-2 text-yellow-800">
                          <Clock className="w-5 h-5" />
                          <span className="font-medium">Waiting for rider location...</span>
                        </div>
                        <p className="text-sm text-yellow-600 mt-1">
                          Location updates will appear when your rider starts tracking.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Order Status */}
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-black text-gray-800 flex items-center">
                    <StatusIcon className="w-6 h-6 mr-3 text-[#d62828]" />
                    Order Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Current Status */}
                    <div className="text-center">
                      <Badge className={`${currentStatus.color} text-lg px-4 py-2 mb-2`}>
                        {currentStatus.label}
                      </Badge>
                      <p className="text-gray-600">{currentStatus.description}</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-[#d62828] h-3 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Status Timeline */}
                    <div className="space-y-3">
                      {Object.entries(statusConfig).map(([status, config]) => {
                        const isActive = order.status === status
                        const isCompleted = getStatusProgress(status as OrderStatus) <= progress
                        const Icon = config.icon
                        
                        return (
                          <div 
                            key={status}
                            className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                              isActive ? 'bg-[#d62828]/10 border-2 border-[#d62828]' : 
                              isCompleted ? 'bg-green-50' : 'bg-gray-50'
                            }`}
                          >
                            <Icon className={`w-5 h-5 ${
                              isCompleted ? 'text-green-600' : 
                              isActive ? 'text-[#d62828]' : 'text-gray-400'
                            }`} />
                            <div className="flex-1">
                              <p className={`font-medium ${
                                isCompleted ? 'text-green-800' : 
                                isActive ? 'text-[#d62828]' : 'text-gray-600'
                              }`}>
                                {config.label}
                              </p>
                              <p className="text-sm text-gray-500">{config.description}</p>
                            </div>
                            {isCompleted && <CheckCircle className="w-5 h-5 text-green-600" />}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Details */}
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-black text-gray-800">Order Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Order Info */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order ID</span>
                        <span className="font-bold">{order.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tracking Code</span>
                        <span className="font-bold text-[#d62828]">{order.trackingCode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total</span>
                        <span className="font-bold text-2xl text-[#d62828]">${order.total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div>
                      <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        Delivery Information
                      </h4>
                      <div className="space-y-1 text-sm">
                        <p className="font-medium">{order.customer.name}</p>
                        <p className="text-gray-600">{order.customer.address.street}</p>
                        <p className="text-gray-600">
                          {order.customer.address.city}, {order.customer.address.state} {order.customer.address.zip}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{order.customer.phone}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{order.customer.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h4 className="font-bold text-gray-800 mb-3">Items Ordered</h4>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <div>
                              <span className="font-medium">{item.name}</span>
                              <div className="text-gray-500 text-xs">
                                {item.size} • {item.crust}
                                {item.toppings.length > 0 && ` • ${item.toppings.join(', ')}`}
                              </div>
                            </div>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Connection Status & Refresh Button */}
                    <div className="pt-4 space-y-3">
                      {/* Connection Status */}
                      <div className="flex items-center justify-center space-x-2 text-sm">
                        {isConnected ? (
                          <>
                            <Wifi className="w-4 h-4 text-green-600" />
                            <span className="text-green-600">Live Updates Active</span>
                          </>
                        ) : (
                          <>
                            <WifiOff className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-500">Offline - Manual Refresh</span>
                          </>
                        )}
                      </div>
                      
                      <Button 
                        onClick={fetchOrderDetails}
                        variant="outline" 
                        className="w-full border-[#d62828] text-[#d62828] hover:bg-[#d62828] hover:text-white"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh Status
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="mt-12 text-center space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/menu">
                  <Button className="bg-[#d62828] hover:bg-[#b91c1c] text-white font-bold px-8 py-3">
                    Order More Pizza
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="border-[#d62828] text-[#d62828] hover:bg-[#d62828] hover:text-white px-8 py-3">
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
