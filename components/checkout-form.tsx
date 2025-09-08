"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CreditCard } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useRouter } from "next/navigation"
import Link from "next/link"

type PaymentMethod = "stripe" | "paypal" | "affirm"

export function CheckoutForm() {
  const { state, dispatch } = useCart()
  const router = useRouter()
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("stripe")
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const [billingInfo, setBillingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  })

  const subtotal = state.total
  const discount = promoApplied ? subtotal * 0.1 : 0
  const tax = (subtotal - discount) * 0.08
  const shipping = 3.99
  const total = subtotal - discount + tax + shipping

  const handlePromoCode = () => {
    if (promoCode.toLowerCase() === "pizza10") {
      setPromoApplied(true)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      console.log("[v0] Starting checkout process with:", { selectedPayment, total })

      // Prepare cart items for Stripe
      const cartItems = state.items.map((item) => ({
        name: item.pizza.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        selectedToppings: item.selectedToppings || [],
      }))

      // Prepare customer data
      const customer = {
        firstName: billingInfo.firstName,
        lastName: billingInfo.lastName,
        email: billingInfo.email,
        phone: billingInfo.phone,
        address: billingInfo.address,
        city: billingInfo.city,
        state: billingInfo.state,
        zipCode: billingInfo.zipCode,
      }

      // Create Stripe Checkout Session
      const response = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems,
          customer,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session")
      }

      console.log("[v0] Checkout session created, redirecting to:", data.url)

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch (error) {
      console.error("Checkout error:", error)
      alert("There was an error processing your order. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (state.items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-[#d62828] mb-4">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8">Add some items to your cart before checkout</p>
        <Link href="/menu">
          <Button className="bg-[#d62828] text-white hover:bg-[#b91c1c]">Browse Menu</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Billing Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#d62828]">Billing Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={billingInfo.firstName}
                    onChange={(e) => setBillingInfo({ ...billingInfo, firstName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={billingInfo.lastName}
                    onChange={(e) => setBillingInfo({ ...billingInfo, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={billingInfo.email}
                  onChange={(e) => setBillingInfo({ ...billingInfo, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={billingInfo.phone}
                  onChange={(e) => setBillingInfo({ ...billingInfo, phone: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={billingInfo.address}
                  onChange={(e) => setBillingInfo({ ...billingInfo, address: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={billingInfo.city}
                    onChange={(e) => setBillingInfo({ ...billingInfo, city: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={billingInfo.state}
                    onChange={(e) => setBillingInfo({ ...billingInfo, state: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={billingInfo.zipCode}
                    onChange={(e) => setBillingInfo({ ...billingInfo, zipCode: e.target.value })}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#d62828]">Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center gap-3 mb-2">
                  <CreditCard className="h-5 w-5 text-[#d62828]" />
                  <span className="font-medium">Secure Payment with Stripe</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  You'll be redirected to Stripe's secure checkout to complete your payment. We accept all major credit
                  cards, Apple Pay, Google Pay, and more.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Promo Code */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#d62828]">Promo Code & Rewards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter promo code (try: PIZZA10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={promoApplied}
                />
                <Button
                  type="button"
                  onClick={handlePromoCode}
                  disabled={promoApplied}
                  className="bg-[#ffbe0b] text-black hover:bg-[#e6a800]"
                >
                  Apply
                </Button>
              </div>
              {promoApplied && (
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800">PIZZA10 Applied</Badge>
                  <span className="text-sm text-green-600">10% discount applied!</span>
                </div>
              )}
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Gift Cards & Rewards:</strong> Feature coming soon! Earn points with every order.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-[#d62828]">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Items */}
              <div className="space-y-3">
                {state.items.map((item, index) => (
                  <div key={`${item.pizza.id}-${item.size}-${index}`} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium">{item.pizza.name}</p>
                      <p className="text-muted-foreground">
                        {item.size.charAt(0).toUpperCase() + item.size.slice(1)} × {item.quantity}
                      </p>
                    </div>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Pricing Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount (PIZZA10)</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <div className="p-6 pt-0">
              <form onSubmit={handleSubmit}>
                <Button
                  type="submit"
                  className="w-full bg-[#d62828] text-white hover:bg-[#b91c1c] font-semibold"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Redirecting to Stripe..." : `Pay Now - $${total.toFixed(2)}`}
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
