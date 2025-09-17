"use client"

import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, MapPin, CreditCard, Clock, CheckCircle, Package, ShoppingBag, Wallet } from "lucide-react"
import { useState, useEffect } from "react"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import type { Order } from "@/lib/order-database"

const mockProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "(555) 123-4567",
  address: "123 Pizza Street, Food City, FC 12345",
  memberSince: "January 2024"
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("orders")
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  // Redirect to account page if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/account')
    }
  }, [isAuthenticated, authLoading, router])

  // Fetch orders on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders()
    }
  }, [isAuthenticated])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      const data = await response.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "preparing":
        return "bg-yellow-100 text-yellow-800"
      case "out_for_delivery":
        return "bg-blue-100 text-blue-800"
      case "confirmed":
        return "bg-purple-100 text-purple-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-4 h-4" />
      case "preparing":
        return <Clock className="w-4 h-4" />
      case "out_for_delivery":
        return <Package className="w-4 h-4" />
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />
      case "cancelled":
        return <Clock className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const formatStatus = (status: string) => {
    switch (status) {
      case "delivered":
        return "Delivered"
      case "preparing":
        return "Preparing"
      case "out_for_delivery":
        return "Out for Delivery"
      case "confirmed":
        return "Confirmed"
      case "cancelled":
        return "Cancelled"
      default:
        return status
    }
  }

  const handleReorder = async (order: Order) => {
    try {
      // Clear current cart and add all items from the order
      for (const item of order.items) {
        // Convert order item back to cart format
        const cartItem = {
          pizza: {
            id: item.id,
            name: item.name,
            category: item.category,
            description: '',
            image: '',
            prices: { small: item.unitPrice, medium: item.unitPrice, large: item.unitPrice }
          },
          size: item.size,
          quantity: item.quantity,
          price: item.unitPrice,
          selectedToppings: item.selectedToppings,
          selectedCrust: item.selectedCrust
        }
        
        addToCart(cartItem)
      }

      toast({
        title: "Items Added to Cart!",
        description: `All items from order ${order.orderNumber} have been added to your cart.`,
        className: "border-green-200 bg-green-50 text-green-800",
      })
    } catch (error) {
      console.error('Error reordering:', error)
      toast({
        title: "Error",
        description: "Failed to add items to cart. Please try again.",
        className: "border-red-200 bg-red-50 text-red-800",
      })
    }
  }

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d62828] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#d62828] mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your account and view order history</p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "orders"
                  ? "bg-white text-[#d62828] shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Order History
            </button>
            <button
              onClick={() => setActiveTab("account")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "account"
                  ? "bg-white text-[#d62828] shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Account Info
            </button>
          </div>

          {/* Content */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-900">My Orders</h2>
                <span className="text-gray-600">{orders.length} Orders</span>
              </div>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="text-gray-500">Loading orders...</div>
                </div>
              ) : orders.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Yet</h3>
                    <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
                    <Button asChild className="bg-[#d62828] hover:bg-[#b91c1c]">
                      <a href="/menu">Start Ordering</a>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {orders.map((order) => (
                    <Card key={order.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-gray-600" />
                            <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                          </div>
                          <div className="text-right">
                            <Badge className={`${getStatusColor(order.status)} flex items-center gap-1 w-fit`}>
                              {getStatusIcon(order.status)}
                              {formatStatus(order.status)}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>
                              {new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                              })} {new Date(order.createdAt).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-lg font-semibold text-[#d62828]">
                            <Wallet className="w-5 h-5" />
                            ${order.total.toFixed(2)}
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="space-y-2 mb-4">
                          {order.items.slice(0, 3).map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-gray-700">
                                {item.quantity}x {item.name} ({item.size})
                              </span>
                              <span className="font-medium">${item.totalPrice.toFixed(2)}</span>
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="text-sm text-gray-500">
                              +{order.items.length - 3} more items
                            </div>
                          )}
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div className="flex justify-between items-center">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          {order.status === "delivered" && (
                            <Button 
                              onClick={() => handleReorder(order)}
                              className="bg-[#ffbe0b] hover:bg-[#e6a800] text-black font-semibold"
                              size="sm"
                            >
                              Order Again
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "account" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">Account Information</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Full Name</label>
                      <p className="text-gray-900">{user?.name || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900">{user?.email || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-gray-900">{user?.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Member Since</label>
                      <p className="text-gray-900">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long',
                          day: 'numeric'
                        }) : 'Unknown'}
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex gap-3">
                    <Button variant="outline">Edit Profile</Button>
                    <Button variant="outline">Change Password</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-900 mb-4">{mockProfile.address}</p>
                  <Button variant="outline">Edit Address</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Methods
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">No saved payment methods</p>
                  <Button variant="outline">Add Payment Method</Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
