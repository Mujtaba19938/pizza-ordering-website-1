"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  MapPin, 
  Navigation, 
  Clock, 
  User, 
  Phone, 
  Mail,
  Power,
  PowerOff,
  CheckCircle,
  AlertCircle,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"
import { useSocket } from "@/contexts/socket-context"
import { Rider, RiderLocation } from "@/lib/types/rider"
import { Order } from "@/lib/types/order"

export default function RiderPage() {
  const router = useRouter()
  const { socket, isConnected } = useSocket()
  const [rider, setRider] = useState<Rider | null>(null)
  const [isOnline, setIsOnline] = useState(false)
  const [isTracking, setIsTracking] = useState(false)
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  })

  // Mock rider login (in production, this would be proper authentication)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // For demo purposes, create a rider with the email
      const response = await fetch('/api/rider/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      })

      if (response.ok) {
        const data = await response.json()
        setRider(data.rider)
        setError(null)
      } else {
        const error = await response.json()
        setError(error.error)
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    }
  }

  // Toggle online/offline status
  const toggleOnlineStatus = async () => {
    if (!rider) return

    try {
      const newStatus = isOnline ? 'offline' : 'online'
      const response = await fetch(`/api/rider/${rider.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        setIsOnline(!isOnline)
        if (socket) {
          socket.emit('join-rider', rider.id)
        }
      }
    } catch (err) {
      console.error('Error updating status:', err)
    }
  }

  // Start/stop location tracking
  const toggleLocationTracking = () => {
    if (!isTracking) {
      startLocationTracking()
    } else {
      stopLocationTracking()
    }
  }

  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.')
      return
    }

    setIsTracking(true)
    setError(null)

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        setLocation(newLocation)

        // Send location to server
        if (socket && rider) {
          const locationData: RiderLocation = {
            riderId: rider.id,
            orderId: rider.assignedOrderId,
            lat: newLocation.lat,
            lng: newLocation.lng,
            heading: position.coords.heading || undefined,
            speed: position.coords.speed || undefined,
            timestamp: new Date()
          }

          socket.emit('rider-location', locationData)
        }
      },
      (error) => {
        console.error('Geolocation error:', error)
        setError('Unable to get your location. Please check permissions.')
        setIsTracking(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    )

    // Store watch ID for cleanup
    ;(window as any).locationWatchId = watchId
  }

  const stopLocationTracking = () => {
    setIsTracking(false)
    if ((window as any).locationWatchId) {
      navigator.geolocation.clearWatch((window as any).locationWatchId)
      delete (window as any).locationWatchId
    }
  }

  // Listen for order assignments
  useEffect(() => {
    if (!socket || !rider) return

    const handleOrderAssignment = (data: { orderId: string; order: Order }) => {
      setCurrentOrder(data.order)
      console.log('Received order assignment:', data)
    }

    socket.on('order:assigned', handleOrderAssignment)
    socket.emit('join-rider', rider.id)

    return () => {
      socket.off('order:assigned', handleOrderAssignment)
    }
  }, [socket, rider])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopLocationTracking()
    }
  }, [])

  if (!rider) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-black text-gray-800 text-center">
                    Rider Login
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        required
                        placeholder="rider@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        required
                        placeholder="Enter password"
                      />
                    </div>
                    {error && (
                      <div className="text-red-600 text-sm text-center">{error}</div>
                    )}
                    <Button type="submit" className="w-full bg-[#d62828] hover:bg-[#b91c1c] text-white">
                      Login
                    </Button>
                  </form>
                  <div className="mt-4 text-center">
                    <Link href="/">
                      <Button variant="outline" className="border-[#d62828] text-[#d62828]">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Site
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
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
      
      {/* Header */}
      <section className="bg-[#d62828] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl md:text-6xl font-black mb-4">RIDER APP</h1>
              <p className="text-xl md:text-2xl">Welcome, {rider.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Connection Status */}
              <div className="flex items-center space-x-2 text-sm">
                {isConnected ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-400">Connected</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-red-400">Disconnected</span>
                  </>
                )}
              </div>
              
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

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Rider Status */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-black text-gray-800 flex items-center">
                  <User className="w-6 h-6 mr-3 text-[#d62828]" />
                  Rider Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Online/Offline Toggle */}
                  <div className="text-center">
                    <Button
                      onClick={toggleOnlineStatus}
                      className={`w-full text-lg py-3 ${
                        isOnline 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'bg-gray-600 hover:bg-gray-700 text-white'
                      }`}
                    >
                      {isOnline ? (
                        <>
                          <Power className="w-5 h-5 mr-2" />
                          Go Offline
                        </>
                      ) : (
                        <>
                          <PowerOff className="w-5 h-5 mr-2" />
                          Go Online
                        </>
                      )}
                    </Button>
                    <p className="text-sm text-gray-600 mt-2">
                      {isOnline ? 'You are online and available for orders' : 'You are offline'}
                    </p>
                  </div>

                  {/* Location Tracking */}
                  <div className="text-center">
                    <Button
                      onClick={toggleLocationTracking}
                      disabled={!isOnline}
                      className={`w-full text-lg py-3 ${
                        isTracking 
                          ? 'bg-red-600 hover:bg-red-700 text-white' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {isTracking ? (
                        <>
                          <MapPin className="w-5 h-5 mr-2" />
                          Stop Tracking
                        </>
                      ) : (
                        <>
                          <Navigation className="w-5 h-5 mr-2" />
                          Start Tracking
                        </>
                      )}
                    </Button>
                    <p className="text-sm text-gray-600 mt-2">
                      {isTracking ? 'Location tracking active' : 'Location tracking stopped'}
                    </p>
                  </div>

                  {/* Current Location */}
                  {location && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-800 mb-2">Current Location</h4>
                      <div className="text-sm text-gray-600">
                        <p>Lat: {location.lat.toFixed(6)}</p>
                        <p>Lng: {location.lng.toFixed(6)}</p>
                      </div>
                    </div>
                  )}

                  {/* Rider Info */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-gray-800">Rider Information</h4>
                    <div className="text-sm space-y-1">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{rider.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{rider.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{rider.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Order */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-black text-gray-800 flex items-center">
                  <Clock className="w-6 h-6 mr-3 text-[#d62828]" />
                  Current Order
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentOrder ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">Order #{currentOrder.id}</span>
                      <Badge className="bg-[#d62828] text-white">
                        {currentOrder.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">Customer</h4>
                      <p className="text-sm">{currentOrder.customer.name}</p>
                      <p className="text-sm text-gray-600">{currentOrder.customer.phone}</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">Delivery Address</h4>
                      <p className="text-sm">
                        {currentOrder.customer.address.street}
                      </p>
                      <p className="text-sm text-gray-600">
                        {currentOrder.customer.address.city}, {currentOrder.customer.address.state} {currentOrder.customer.address.zip}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">Order Items</h4>
                      <div className="space-y-1">
                        {currentOrder.items.map((item, index) => (
                          <div key={index} className="text-sm">
                            <span className="font-medium">{item.name}</span>
                            <span className="text-gray-500 ml-2">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button className="w-full bg-[#ffbe0b] hover:bg-[#e6a800] text-black font-bold">
                        View Full Order Details
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-600 mb-2">No Active Order</h3>
                    <p className="text-gray-500">
                      {isOnline ? 'Waiting for order assignment...' : 'Go online to receive orders'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2 text-red-800">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Error:</span>
                <span>{error}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
