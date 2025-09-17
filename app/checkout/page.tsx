"use client"

import type React from "react"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Wallet, MapPin, Phone, Mail, User, ArrowLeft, CheckCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import OrderTracking from "@/components/order-tracking"

export default function CheckoutPage() {
  const { items, total, itemCount, clearCart } = useCart()
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [showTracking, setShowTracking] = useState(false)
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})
  const [isFormValid, setIsFormValid] = useState(false)

  const deliveryFee = 3.99
  const tax = total * 0.08
  const finalTotal = total + deliveryFee + tax

  // Form validation
  const validateForm = (formData: FormData) => {
    const errors: { [key: string]: string } = {}
    
    // Required fields validation
    const requiredFields = {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email Address',
      phone: 'Phone Number',
      address: 'Street Address',
      city: 'City',
      state: 'State',
      zip: 'ZIP Code'
    }

    // Check required fields
    Object.entries(requiredFields).forEach(([field, label]) => {
      const value = formData.get(field) as string
      if (!value || value.trim() === '') {
        errors[field] = `${label} is required`
      }
    })

    // Email validation
    const email = formData.get('email') as string
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address'
    }

    // Phone validation
    const phone = formData.get('phone') as string
    if (phone && !/^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-\(\)]/g, ''))) {
      errors.phone = 'Please enter a valid phone number'
    }

    // ZIP code validation
    const zip = formData.get('zip') as string
    if (zip && !/^\d{5}(-\d{4})?$/.test(zip)) {
      errors.zip = 'Please enter a valid ZIP code'
    }

    // Card validation if card payment is selected
    if (paymentMethod === 'card') {
      const cardNumber = formData.get('cardNumber') as string
      const expiry = formData.get('expiry') as string
      const cvv = formData.get('cvv') as string

      if (!cardNumber || cardNumber.replace(/\s/g, '').length < 13) {
        errors.cardNumber = 'Please enter a valid card number'
      }
      if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) {
        errors.expiry = 'Please enter a valid expiry date (MM/YY)'
      }
      if (!cvv || !/^\d{3,4}$/.test(cvv)) {
        errors.cvv = 'Please enter a valid CVV'
      }
    }

    return errors
  }

  // Check if form is valid
  useEffect(() => {
    const checkFormValidity = () => {
      const form = document.querySelector('form') as HTMLFormElement
      if (form) {
        const formData = new FormData(form)
        const errors = validateForm(formData)
        setIsFormValid(Object.keys(errors).length === 0)
      }
    }

    // Add event listeners to form fields
    const form = document.querySelector('form')
    if (form) {
      form.addEventListener('input', checkFormValidity)
      form.addEventListener('change', checkFormValidity)
      return () => {
        form.removeEventListener('input', checkFormValidity)
        form.removeEventListener('change', checkFormValidity)
      }
    }
  }, [paymentMethod])

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form before processing
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const errors = validateForm(formData)
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }
    
    setFormErrors({})
    setIsProcessing(true)

    try {
      const customer = {
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        address: formData.get('address') as string,
        city: formData.get('city') as string,
        state: formData.get('state') as string,
        zip: formData.get('zip') as string,
        instructions: formData.get('instructions') as string,
      }

      // Only process card payments through Stripe
      if (paymentMethod === "card") {
        const response = await fetch('/api/checkout/create-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cartItems: items,
            customer,
          }),
        })

        const data = await response.json()

        if (data.url) {
          // Redirect to Stripe Checkout
          window.location.href = data.url
        } else {
          throw new Error(data.error || 'Failed to create checkout session')
        }
      } else {
        // Handle cash on delivery
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setOrderPlaced(true)
        clearCart()
        setIsProcessing(false)

        setTimeout(() => {
          setShowTracking(true)
        }, 3000)
      }
    } catch (error) {
      console.error('Order processing error:', error)
      alert('Failed to process order. Please try again.')
      setIsProcessing(false)
    }
  }

  if (items.length === 0 && !orderPlaced) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-md mx-auto">
              <h1 className="text-4xl font-black text-gray-800 mb-4">No Items to Checkout</h1>
              <p className="text-gray-600 mb-8">Please add some pizzas to your cart first.</p>
              <Link href="/menu">
                <Button className="bg-[#d62828] hover:bg-[#b91c1c] text-white font-bold px-8 py-3">
                  <ArrowLeft className="w-4 h-4 mr-2" />
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

  if (showTracking) {
    return <OrderTracking orderTotal={finalTotal} />
  }

  if (orderPlaced) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-md mx-auto">
              <div className="relative mb-6">
                <CheckCircle className="w-24 h-24 text-green-500 mx-auto animate-bounce" />
                <div className="absolute inset-0 w-24 h-24 mx-auto border-4 border-green-500 rounded-full animate-ping opacity-20"></div>
              </div>
              <h1 className="text-4xl font-black text-gray-800 mb-4 animate-in fade-in duration-500">
                Order Placed Successfully!
              </h1>
              <p className="text-gray-600 mb-8 animate-in fade-in duration-700">
                Thank you for your order! Transitioning to live tracking...
              </p>
              <div className="bg-white p-6 rounded-lg shadow-lg mb-8 animate-in slide-in-from-bottom duration-500">
                <p className="text-lg font-bold text-[#d62828]">Order Total: ${finalTotal.toFixed(2)}</p>
                <p className="text-sm text-gray-600 mt-2">You will receive a confirmation email shortly.</p>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-[#d62828] rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-[#d62828] rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-[#d62828] rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <p className="text-sm text-gray-500 ml-2">Loading order tracking...</p>
              </div>
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

      {/* Hero Section */}
      <section className="bg-[#d62828] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl md:text-6xl font-black mb-4">CHECKOUT</h1>
              <p className="text-xl md:text-2xl">Complete your order</p>
            </div>
            <div className="hidden md:block">
              <div className="text-right">
                <p className="text-lg opacity-90">Total</p>
                <p className="text-4xl font-black text-[#ffbe0b]">${finalTotal.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Checkout Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Form Validation Status */}
          {Object.keys(formErrors).length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <div>
                  <h3 className="text-red-800 font-semibold">Please fix the following errors:</h3>
                  <ul className="text-red-700 text-sm mt-1">
                    {Object.entries(formErrors).map(([field, error]) => (
                      <li key={field}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handlePlaceOrder}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Customer Details & Payment */}
              <div className="lg:col-span-2 space-y-8">
                {/* Customer Information */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-2xl font-black text-gray-800">
                      <div className="flex items-center">
                        <User className="w-6 h-6 mr-3 text-[#d62828]" />
                        Customer Information
                      </div>
                      {Object.keys(formErrors).some(key => ['firstName', 'lastName', 'email', 'phone'].includes(key)) && (
                        <span className="text-red-500 text-sm font-medium">Required fields missing</span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                          First Name *
                        </Label>
                        <Input 
                          id="firstName" 
                          name="firstName" 
                          required 
                          className={`mt-1 focus:ring-2 focus:ring-[#d62828] focus:border-[#d62828] ${formErrors.firstName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}`} 
                          placeholder="John" 
                        />
                        {formErrors.firstName && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                          Last Name *
                        </Label>
                        <Input 
                          id="lastName" 
                          name="lastName" 
                          required 
                          className={`mt-1 focus:ring-2 focus:ring-[#d62828] focus:border-[#d62828] ${formErrors.lastName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}`} 
                          placeholder="Doe" 
                        />
                        {formErrors.lastName && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address *
                      </Label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          required 
                          className={`pl-10 focus:ring-2 focus:ring-[#d62828] focus:border-[#d62828] ${formErrors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}`} 
                          placeholder="john@example.com" 
                        />
                      </div>
                      {formErrors.email && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                        Phone Number *
                      </Label>
                      <div className="relative mt-1">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input 
                          id="phone" 
                          name="phone" 
                          type="tel" 
                          required 
                          className={`pl-10 focus:ring-2 focus:ring-[#d62828] focus:border-[#d62828] ${formErrors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}`} 
                          placeholder="(555) 123-4567" 
                        />
                      </div>
                      {formErrors.phone && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery Address */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-2xl font-black text-gray-800">
                      <div className="flex items-center">
                        <MapPin className="w-6 h-6 mr-3 text-[#d62828]" />
                        Delivery Address
                      </div>
                      {Object.keys(formErrors).some(key => ['address', 'city', 'state', 'zip'].includes(key)) && (
                        <span className="text-red-500 text-sm font-medium">Required fields missing</span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                        Street Address *
                      </Label>
                      <Input 
                        id="address" 
                        name="address" 
                        required 
                        className={`mt-1 focus:ring-2 focus:ring-[#d62828] focus:border-[#d62828] ${formErrors.address ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}`} 
                        placeholder="123 Main Street" 
                      />
                      {formErrors.address && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                          City *
                        </Label>
                        <Input 
                          id="city" 
                          name="city" 
                          required 
                          className={`mt-1 focus:ring-2 focus:ring-[#d62828] focus:border-[#d62828] ${formErrors.city ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}`} 
                          placeholder="New York" 
                        />
                        {formErrors.city && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                          State *
                        </Label>
                        <Input 
                          id="state" 
                          name="state" 
                          required 
                          className={`mt-1 focus:ring-2 focus:ring-[#d62828] focus:border-[#d62828] ${formErrors.state ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}`} 
                          placeholder="NY" 
                        />
                        {formErrors.state && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.state}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="zip" className="text-sm font-medium text-gray-700">
                          ZIP Code *
                        </Label>
                        <Input 
                          id="zip" 
                          name="zip" 
                          required 
                          className={`mt-1 focus:ring-2 focus:ring-[#d62828] focus:border-[#d62828] ${formErrors.zip ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}`} 
                          placeholder="10001" 
                        />
                        {formErrors.zip && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.zip}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="instructions" className="text-sm font-medium text-gray-700">
                        Delivery Instructions (Optional)
                      </Label>
                      <Textarea
                        id="instructions"
                        name="instructions"
                        className="mt-1 focus:ring-2 focus:ring-[#d62828] focus:border-[#d62828] border-gray-300"
                        placeholder="Apartment number, gate code, special instructions..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-2xl font-black text-gray-800">
                      <CreditCard className="w-6 h-6 mr-3 text-[#d62828]" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center cursor-pointer flex-1">
                          <CreditCard className="w-5 h-5 mr-3 text-gray-600" />
                          <div>
                            <p className="font-medium">Credit/Debit Card</p>
                            <p className="text-sm text-gray-500">Pay securely with your card</p>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <RadioGroupItem value="cash" id="cash" />
                        <Label htmlFor="cash" className="flex items-center cursor-pointer flex-1">
                          <Wallet className="w-5 h-5 mr-3 text-gray-600" />
                          <div>
                            <p className="font-medium">Cash on Delivery</p>
                            <p className="text-sm text-gray-500">Pay when your order arrives</p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>

                    {paymentMethod === "card" && (
                      <div className="mt-6 space-y-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <Label htmlFor="cardNumber" className="text-sm font-medium text-gray-700">
                            Card Number *
                          </Label>
                          <Input 
                            id="cardNumber" 
                            name="cardNumber"
                            required 
                            className={`mt-1 focus:ring-2 focus:ring-[#d62828] focus:border-[#d62828] ${formErrors.cardNumber ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}`} 
                            placeholder="1234 5678 9012 3456" 
                          />
                          {formErrors.cardNumber && (
                            <p className="text-red-500 text-xs mt-1">{formErrors.cardNumber}</p>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiry" className="text-sm font-medium text-gray-700">
                              Expiry Date *
                            </Label>
                            <Input 
                              id="expiry" 
                              name="expiry"
                              required 
                              className={`mt-1 focus:ring-2 focus:ring-[#d62828] focus:border-[#d62828] ${formErrors.expiry ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}`} 
                              placeholder="MM/YY" 
                            />
                            {formErrors.expiry && (
                              <p className="text-red-500 text-xs mt-1">{formErrors.expiry}</p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="cvv" className="text-sm font-medium text-gray-700">
                              CVV *
                            </Label>
                            <Input 
                              id="cvv" 
                              name="cvv"
                              required 
                              className={`mt-1 focus:ring-2 focus:ring-[#d62828] focus:border-[#d62828] ${formErrors.cvv ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}`} 
                              placeholder="123" 
                            />
                            {formErrors.cvv && (
                              <p className="text-red-500 text-xs mt-1">{formErrors.cvv}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-8 border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl font-black text-gray-800">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Order Items */}
                    <div className="space-y-4 mb-6">
                      {items.map((item) => (
                        <div key={`${item.id}-${Math.random()}`} className="flex items-center space-x-3">
                          <div className="relative w-12 h-12 flex-shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-medium text-gray-800">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-4" />

                    {/* Order Totals */}
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Subtotal ({itemCount} items)</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Delivery Fee</span>
                        <span>${deliveryFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Tax</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between text-lg font-black text-gray-800">
                        <span>Total</span>
                        <span className="text-[#d62828]">${finalTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Place Order Button */}
                    <Button
                      type="submit"
                      disabled={isProcessing || !isFormValid}
                      className="w-full bg-[#ffbe0b] hover:bg-[#e6a800] text-black font-bold text-lg py-3 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isProcessing ? "Processing..." : !isFormValid ? "Please fill all required fields" : paymentMethod === "card" ? "Pay with Stripe" : "Place Order"}
                    </Button>

                    <div className="mt-4 text-center text-sm text-gray-500">
                      <p>🔒 Your payment information is secure</p>
                    </div>

                    {/* Back to Cart */}
                    <div className="mt-4">
                      <Link href="/cart">
                        <Button
                          variant="outline"
                          className="w-full border-[#d62828] text-[#d62828] hover:bg-[#d62828] hover:text-white bg-transparent"
                        >
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Back to Cart
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  )
}
