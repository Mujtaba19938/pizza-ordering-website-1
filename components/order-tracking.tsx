"use client"

import { useState, useEffect } from "react"
import { CheckCircle, Clock, ChefHat, Pizza, Truck, Home, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface OrderTrackingProps {
  orderTotal: number
}

const trackingSteps = [
  { id: 1, title: "Order Confirmed", icon: CheckCircle, description: "Your order has been received" },
  { id: 2, title: "Preparing", icon: ChefHat, description: "Our chefs are preparing your pizza" },
  { id: 3, title: "Baking", icon: Pizza, description: "Your pizza is in the oven" },
  { id: 4, title: "Out for Delivery", icon: Truck, description: "Your order is on the way" },
  { id: 5, title: "Delivered", icon: Home, description: "Enjoy your delicious pizza!" },
]

export default function OrderTracking({ orderTotal }: OrderTrackingProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [timeRemaining, setTimeRemaining] = useState(25 * 60) // 25 minutes in seconds
  const [showNotification, setShowNotification] = useState(false)
  const [deliveryBoyPosition, setDeliveryBoyPosition] = useState(0)

  useEffect(() => {
    // Progress through steps automatically
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < 5) {
          const nextStep = prev + 1
          if (nextStep === 4) {
            // Show notification when out for delivery
            setShowNotification(true)
            setTimeout(() => setShowNotification(false), 3000)
          }
          return nextStep
        }
        return prev
      })
    }, 4000) // Progress every 4 seconds for demo

    // Countdown timer
    const timerInterval = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    // Animate delivery boy
    const deliveryInterval = setInterval(() => {
      setDeliveryBoyPosition((prev) => (prev >= 100 ? 0 : prev + 0.5))
    }, 100)

    return () => {
      clearInterval(stepInterval)
      clearInterval(timerInterval)
      clearInterval(deliveryInterval)
    }
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-[#d62828] text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-16 h-16 border-2 border-white rounded-full"></div>
        <div className="absolute top-40 right-20 w-8 h-8 bg-white rounded-full"></div>
        <div className="absolute bottom-32 left-1/4 w-12 h-12 border-2 border-white rotate-45"></div>
        <div className="absolute bottom-20 right-1/3 w-6 h-6 bg-white rounded-full"></div>
      </div>

      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-500">
          <Card className="bg-[#ffbe0b] border-0 shadow-xl">
            <CardContent className="p-4 flex items-center space-x-3">
              <Bell className="w-5 h-5 text-black animate-bounce" />
              <p className="text-black font-bold">Your pizza is now out for delivery! 🍕</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-[#ffbe0b] rounded-full mb-6 animate-pulse">
            <Pizza className="w-12 h-12 text-black animate-spin" style={{ animationDuration: "3s" }} />
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-4">ORDER TRACKING</h1>
          <p className="text-xl md:text-2xl opacity-90">Your delicious pizza is on its way!</p>

          {/* Order Summary */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mt-8 max-w-md mx-auto">
            <p className="text-lg font-bold text-[#ffbe0b] mb-2">Order Total: ${orderTotal.toFixed(2)}</p>
            <div className="flex items-center justify-center space-x-2 text-lg">
              <Clock className="w-5 h-5" />
              <span>Estimated delivery: {formatTime(timeRemaining)}</span>
            </div>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-12 left-0 right-0 h-1 bg-white/20 rounded-full">
              <div
                className="h-full bg-[#ffbe0b] rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
              ></div>
            </div>

            {/* Steps */}
            <div className="grid grid-cols-5 gap-4">
              {trackingSteps.map((step, index) => {
                const isActive = currentStep >= step.id
                const isCurrent = currentStep === step.id
                const Icon = step.icon

                return (
                  <div key={step.id} className="text-center relative">
                    <div
                      className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 transition-all duration-500 ${
                        isActive ? "bg-[#ffbe0b] text-black scale-110" : "bg-white/20 text-white"
                      } ${isCurrent ? "animate-bounce" : ""}`}
                    >
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className={`font-bold text-lg mb-2 ${isActive ? "text-[#ffbe0b]" : "text-white/70"}`}>
                      {step.title}
                    </h3>
                    <p className={`text-sm ${isActive ? "text-white" : "text-white/50"}`}>{step.description}</p>
                    {isActive && (
                      <div className="absolute -top-2 -right-2">
                        <CheckCircle className="w-6 h-6 text-green-400 animate-in zoom-in duration-300" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Animated Delivery Boy */}
        {currentStep >= 4 && (
          <div className="relative h-20 mb-8 overflow-hidden">
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-full"></div>
            <div
              className="absolute bottom-2 transition-all duration-100 ease-linear"
              style={{ left: `${deliveryBoyPosition}%` }}
            >
              <div className="flex items-center space-x-2 bg-[#ffbe0b] px-3 py-2 rounded-full">
                <Truck className="w-6 h-6 text-black" />
                <span className="text-black font-bold text-sm">🍕</span>
              </div>
            </div>
          </div>
        )}

        {/* Live Updates */}
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-sm border-0">
            <CardContent className="p-6">
              <h3 className="text-2xl font-black mb-4 text-center">Live Updates</h3>
              <div className="space-y-3">
                {trackingSteps.slice(0, currentStep).map((step, index) => (
                  <div
                    key={step.id}
                    className="flex items-center space-x-3 animate-in slide-in-from-left duration-500"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <div>
                      <p className="font-bold">{step.title}</p>
                      <p className="text-sm opacity-80">{step.description}</p>
                    </div>
                    <div className="text-xs opacity-60 ml-auto">
                      {new Date(Date.now() - (currentStep - step.id) * 240000).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-12 space-y-4">
          <Button
            className="bg-[#ffbe0b] hover:bg-[#e6a800] text-black font-bold px-8 py-3 transition-all duration-200 hover:scale-105"
            onClick={() => (window.location.href = "/")}
          >
            Continue Shopping
          </Button>
          <p className="text-sm opacity-70">Need help? Call us at (555) 123-PIZZA</p>
        </div>
      </div>
    </div>
  )
}
