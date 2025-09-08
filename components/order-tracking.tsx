"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, ChefHat, Truck, Home, Bell, Pizza } from "lucide-react"
import Link from "next/link"

type OrderStatus = "confirmed" | "preparing" | "baking" | "delivery" | "delivered"

const orderSteps = [
  {
    id: "confirmed",
    label: "Order Confirmed",
    icon: CheckCircle,
    description: "We've received your order",
    color: "text-green-600",
  },
  {
    id: "preparing",
    label: "Preparing",
    icon: ChefHat,
    description: "Our chefs are preparing your pizza",
    color: "text-blue-600",
  },
  { id: "baking", label: "Baking", icon: Pizza, description: "Your pizza is in the oven", color: "text-orange-600" },
  {
    id: "delivery",
    label: "Out for Delivery",
    icon: Truck,
    description: "Your order is on the way",
    color: "text-purple-600",
  },
  {
    id: "delivered",
    label: "Delivered",
    icon: Home,
    description: "Enjoy your delicious pizza!",
    color: "text-green-600",
  },
]

export function OrderTracking() {
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>("confirmed")
  const [timeRemaining, setTimeRemaining] = useState(25 * 60) // 25 minutes in seconds
  const [showSuccess, setShowSuccess] = useState(true)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [pizzaRotation, setPizzaRotation] = useState(0)

  useEffect(() => {
    // Pizza rotation animation
    const rotationInterval = setInterval(() => {
      setPizzaRotation((prev) => (prev + 1) % 360)
    }, 50)

    // Simulate order progression
    const progressOrder = () => {
      const statusOrder: OrderStatus[] = ["confirmed", "preparing", "baking", "delivery", "delivered"]
      let currentIndex = 0

      const interval = setInterval(() => {
        if (currentIndex < statusOrder.length - 1) {
          currentIndex++
          const newStatus = statusOrder[currentIndex]
          setCurrentStatus(newStatus)

          // Show notification for status changes
          const messages = {
            preparing: "Your pizza is now being prepared by our chefs!",
            baking: "Your pizza is now baking in our wood-fired oven!",
            delivery: "Your pizza is out for delivery!",
            delivered: "Your pizza has been delivered! Enjoy!",
          }

          if (messages[newStatus as keyof typeof messages]) {
            setNotificationMessage(messages[newStatus as keyof typeof messages])
            setShowNotification(true)
            setTimeout(() => setShowNotification(false), 4000)
          }
        } else {
          clearInterval(interval)
        }
      }, 5000) // Progress every 5 seconds for demo

      return interval
    }

    const timer = setTimeout(() => {
      setShowSuccess(false)
      progressOrder()
    }, 3000)

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => {
      clearTimeout(timer)
      clearInterval(countdownInterval)
      clearInterval(rotationInterval)
    }
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getCurrentStepIndex = () => {
    return orderSteps.findIndex((step) => step.id === currentStatus)
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-[#d62828] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <div className="text-4xl opacity-20">🍕</div>
            </div>
          ))}
        </div>

        <div className="text-center text-white z-10">
          <div className="animate-bounce mb-8">
            <div className="w-32 h-32 bg-[#ffbe0b] rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
              <CheckCircle className="w-16 h-16 text-[#d62828] animate-pulse" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 animate-fade-in">Order Placed Successfully!</h1>
          <p className="text-xl mb-8 animate-fade-in-delay">Thank you for your order. Transitioning to tracking...</p>
          <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#d62828] py-12 px-6 relative">
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <Card className="bg-[#ffbe0b] border-none shadow-2xl max-w-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="bg-[#d62828] p-2 rounded-full animate-pulse">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-[#d62828]">Order Update</p>
                <p className="text-sm text-[#d62828]/80">{notificationMessage}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 text-white">
          <h1 className="text-5xl font-bold mb-4">Order Tracking</h1>
          <p className="text-xl mb-6">Your delicious pizza is on its way!</p>
          <div className="bg-[#ffbe0b] text-black px-6 py-3 rounded-full inline-block font-bold text-lg shadow-lg">
            <Clock className="inline w-5 h-5 mr-2" />
            Estimated delivery: {formatTime(timeRemaining)}
          </div>
        </div>

        <Card className="mb-8 relative overflow-hidden">
          <CardHeader>
            <CardTitle className="text-[#d62828] text-center">Order Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-8 left-0 right-0 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-gradient-to-r from-[#d62828] to-[#ffbe0b] rounded-full transition-all duration-1000 ease-in-out shadow-lg"
                  style={{ width: `${(getCurrentStepIndex() / (orderSteps.length - 1)) * 100}%` }}
                />
              </div>

              {/* Central Pizza Icon */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <div
                  className="w-16 h-16 bg-[#ffbe0b] rounded-full flex items-center justify-center shadow-xl border-4 border-white"
                  style={{ transform: `rotate(${pizzaRotation}deg)` }}
                >
                  <Pizza className="w-8 h-8 text-[#d62828]" />
                </div>
              </div>

              {/* Steps */}
              <div className="relative flex justify-between pt-16">
                {orderSteps.map((step, index) => {
                  const isActive = index <= getCurrentStepIndex()
                  const isCurrent = step.id === currentStatus
                  const Icon = step.icon

                  return (
                    <div key={step.id} className="flex flex-col items-center">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-500 shadow-lg ${
                          isActive ? "bg-[#ffbe0b] text-[#d62828] scale-110 shadow-xl" : "bg-gray-200 text-gray-400"
                        } ${isCurrent ? "animate-bounce" : ""}`}
                      >
                        <Icon className="w-8 h-8" />
                      </div>
                      <div className="text-center">
                        <p className={`font-semibold ${isActive ? "text-[#d62828]" : "text-gray-400"}`}>{step.label}</p>
                        <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 overflow-hidden">
          <CardContent className="p-8">
            <div className="relative h-24 bg-gradient-to-r from-[#d62828] via-[#ffbe0b] to-[#d62828] rounded-lg overflow-hidden">
              {/* Road lines */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/30 transform -translate-y-1/2"></div>
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/30 transform -translate-y-1/2 mt-2"></div>

              {/* Delivery truck */}
              <div
                className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-2000 ease-linear"
                style={{ left: `${(getCurrentStepIndex() / (orderSteps.length - 1)) * 85}%` }}
              >
                <div className="bg-white p-3 rounded-full shadow-xl animate-bounce">
                  <Truck className="w-6 h-6 text-[#d62828]" />
                </div>
              </div>

              {/* Moving background elements */}
              <div className="absolute inset-0 opacity-20">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-white rounded-full animate-pulse"
                    style={{
                      left: `${20 + i * 30}%`,
                      top: `${30 + (i % 2) * 40}%`,
                      animationDelay: `${i * 0.5}s`,
                    }}
                  />
                ))}
              </div>
            </div>
            <p className="text-center mt-4 text-muted-foreground font-medium">
              {currentStatus === "delivered" ? "🎉 Your pizza has arrived! 🎉" : "🚚 Your order is on its way"}
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-[#d62828] flex items-center gap-2">
              Order Details
              <div
                className={`w-3 h-3 rounded-full animate-pulse ${
                  currentStatus === "delivered" ? "bg-green-500" : "bg-[#ffbe0b]"
                }`}
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Order #12345</h3>
                <p className="text-muted-foreground">Placed on {new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Current Status</h3>
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${orderSteps.find((s) => s.id === currentStatus)?.color}`}>
                    {orderSteps.find((s) => s.id === currentStatus)?.label}
                  </span>
                  {currentStatus !== "delivered" && (
                    <div className="animate-spin w-4 h-4 border-2 border-[#ffbe0b] border-t-transparent rounded-full" />
                  )}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Delivery Address</h3>
                <p className="text-muted-foreground">
                  123 Main Street
                  <br />
                  Anytown, ST 12345
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="text-center space-y-4">
          <Link href="/menu">
            <Button className="bg-[#ffbe0b] text-black hover:bg-[#e6a800] mr-4 shadow-lg hover:shadow-xl transition-all hover:scale-105">
              Order Again
            </Button>
          </Link>
          <Link href="/">
            <Button
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-[#d62828] bg-transparent shadow-lg hover:shadow-xl transition-all"
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
