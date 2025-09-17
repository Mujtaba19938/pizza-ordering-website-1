"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  CheckCircle, 
  Clock, 
  ChefHat, 
  Truck, 
  RefreshCw,
  Eye,
  ArrowLeft,
  Wifi,
  WifiOff
} from "lucide-react"
import Link from "next/link"
import { Order, OrderStatus } from "@/lib/types/order"
import { Rider } from "@/lib/types/rider"
import { useSocket } from "@/contexts/socket-context"

const statusConfig = {
  pending_payment: { label: "Pending Payment", color: "bg-yellow-100 text-yellow-800" },
  paid: { label: "Paid", color: "bg-green-100 text-green-800" },
  preparing: { label: "Preparing", color: "bg-blue-100 text-blue-800" },
  baking: { label: "Baking", color: "bg-orange-100 text-orange-800" },
  out_for_delivery: { label: "Out for Delivery", color: "bg-purple-100 text-purple-800" },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-800" }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [riders, setRiders] = useState<Rider[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const { isConnected } = useSocket()

  useEffect(() => {
    fetchOrders()
    fetchRiders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/orders')
      const data = await response.json()
      
      if (response.ok) {
        setOrders(data.orders)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRiders = async () => {
    try {
      const response = await fetch('/api/rider?status=online')
      const data = await response.json()
      
      if (response.ok) {
        setRiders(data.riders)
      }
    } catch (error) {
      console.error('Error fetching riders:', error)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      setUpdating(orderId)
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        // Refresh orders list
        await fetchOrders()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Failed to update order status')
    } finally {
      setUpdating(null)
    }
  }

  const assignRider = async (orderId: string, riderId: string) => {
    try {
      setUpdating(orderId)
      const response = await fetch(`/api/orders/${orderId}/assign-rider`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ riderId })
      })

      if (response.ok) {
        // Refresh orders and riders
        await fetchOrders()
        await fetchRiders()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error assigning rider:', error)
      alert('Failed to assign rider')
    } finally {
      setUpdating(null)
    }
  }

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending_payment': return <Clock className="w-4 h-4" />
      case 'paid': return <CheckCircle className="w-4 h-4" />
      case 'preparing': return <ChefHat className="w-4 h-4" />
      case 'baking': return <ChefHat className="w-4 h-4" />
      case 'out_for_delivery': return <Truck className="w-4 h-4" />
      case 'delivered': return <CheckCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d62828] mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-gray-800">Loading Orders...</h1>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <section className="bg-[#d62828] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl md:text-6xl font-black mb-4">ADMIN ORDERS</h1>
              <p className="text-xl md:text-2xl">Manage order status and tracking</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Connection Status */}
              <div className="flex items-center space-x-2 text-sm">
                {isConnected ? (
                  <>
                    <Wifi className="w-4 h-4 text-green-400" />
                    <span className="text-green-400">Live Updates</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400">Offline</span>
                  </>
                )}
              </div>
              
              <Button 
                onClick={fetchOrders}
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-[#d62828]"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Link href="/">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#d62828]">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Site
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Orders List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">No Orders Found</h2>
              <p className="text-gray-600 mb-8">Orders will appear here once customers place them.</p>
              <Link href="/menu">
                <Button className="bg-[#d62828] hover:bg-[#b91c1c] text-white font-bold px-8 py-3">
                  Go to Menu
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const statusInfo = statusConfig[order.status]
                return (
                  <Card key={order.id} className="border-0 shadow-lg">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-xl font-bold text-gray-800">
                            Order #{order.id}
                          </CardTitle>
                          <p className="text-gray-600">
                            {order.customer.name} • {order.customer.email}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge className={`${statusInfo.color} flex items-center space-x-1`}>
                            {getStatusIcon(order.status)}
                            <span>{statusInfo.label}</span>
                          </Badge>
                          <Link href={`/track/${order.trackingCode}`} target="_blank">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              View Tracking
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Order Items */}
                        <div>
                          <h4 className="font-bold text-gray-800 mb-2">Items</h4>
                          <div className="space-y-1">
                            {order.items.map((item, index) => (
                              <div key={index} className="text-sm">
                                <span className="font-medium">{item.name}</span>
                                <span className="text-gray-500 ml-2">x{item.quantity}</span>
                                <div className="text-gray-500 text-xs">
                                  {item.size} • {item.crust}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Customer Info */}
                        <div>
                          <h4 className="font-bold text-gray-800 mb-2">Customer</h4>
                          <div className="text-sm space-y-1">
                            <p>{order.customer.name}</p>
                            <p className="text-gray-600">{order.customer.phone}</p>
                            <p className="text-gray-600">
                              {order.customer.address.street}, {order.customer.address.city}
                            </p>
                          </div>
                        </div>

                        {/* Status Update */}
                        <div>
                          <h4 className="font-bold text-gray-800 mb-2">Update Status</h4>
                          <div className="space-y-2">
                            <Select
                              value={order.status}
                              onValueChange={(value) => updateOrderStatus(order.id, value as OrderStatus)}
                              disabled={updating === order.id}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(statusConfig).map(([status, config]) => (
                                  <SelectItem key={status} value={status}>
                                    {config.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            
                            {/* Rider Assignment */}
                            {order.status === 'preparing' && (
                              <div className="mt-3">
                                <h5 className="font-medium text-gray-800 mb-2">Assign Rider</h5>
                                <Select
                                  onValueChange={(riderId) => assignRider(order.id, riderId)}
                                  disabled={updating === order.id || riders.length === 0}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder={riders.length === 0 ? "No riders online" : "Select rider"} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {riders.map((rider) => (
                                      <SelectItem key={rider.id} value={rider.id}>
                                        {rider.name} ({rider.email})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}

                            <div className="text-sm text-gray-600">
                              <p>Total: <span className="font-bold">${order.total.toFixed(2)}</span></p>
                              <p>Tracking: <span className="font-bold">{order.trackingCode}</span></p>
                              {order.assignedRiderId && (
                                <p>Rider: <span className="font-bold text-[#d62828]">Assigned</span></p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
