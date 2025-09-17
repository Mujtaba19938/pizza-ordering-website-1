"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"

export default function CartPage() {
  const { items, total, itemCount, updateQuantity, removeItem, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />

        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-md mx-auto">
              <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h1 className="text-4xl font-black text-gray-800 mb-4">Your Cart is Empty</h1>
              <p className="text-gray-600 mb-8">Looks like you haven't added any delicious pizzas to your cart yet.</p>
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

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-[#d62828] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl md:text-6xl font-black mb-4">YOUR CART</h1>
              <p className="text-xl md:text-2xl">
                {itemCount} {itemCount === 1 ? "item" : "items"} ready for checkout
              </p>
            </div>
            <div className="hidden md:block">
              <div className="text-right">
                <p className="text-lg opacity-90">Total</p>
                <p className="text-4xl font-black text-[#ffbe0b]">${total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cart Items */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-gray-800">Cart Items</h2>
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white bg-transparent"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Cart
                </Button>
              </div>

              <div className="space-y-4">
                {items.map((item) => (
                  <Card key={`${item.id}-${Math.random()}`} className="overflow-hidden border-0 shadow-lg">
                    <CardContent className="p-0">
                      <div className="flex items-center">
                        {/* Pizza Image */}
                        <div className="relative w-32 h-32 flex-shrink-0">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                              {item.description && <p className="text-gray-600 text-sm mb-3">{item.description}</p>}
                              <p className="text-2xl font-black text-[#d62828]">${item.price.toFixed(2)}</p>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-3 ml-4">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-8 h-8 p-0 border-[#d62828] text-[#d62828] hover:bg-[#d62828] hover:text-white bg-transparent"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-8 text-center font-bold text-lg">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-8 h-8 p-0 border-[#d62828] text-[#d62828] hover:bg-[#d62828] hover:text-white bg-transparent"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Subtotal and Remove */}
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                            <div className="text-lg font-bold text-gray-800">
                              Subtotal:{" "}
                              <span className="text-[#d62828]">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Continue Shopping */}
              <div className="mt-8">
                <Link href="/menu">
                  <Button
                    variant="outline"
                    className="border-[#d62828] text-[#d62828] hover:bg-[#d62828] hover:text-white bg-transparent"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8 border-0 shadow-xl">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-black text-gray-800 mb-6">Order Summary</h3>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal ({itemCount} items)</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Fee</span>
                      <span>$3.99</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax</span>
                      <span>${(total * 0.08).toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between text-xl font-black text-gray-800">
                        <span>Total</span>
                        <span className="text-[#d62828]">${(total + 3.99 + total * 0.08).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <Link href="/checkout">
                    <Button className="w-full bg-[#ffbe0b] hover:bg-[#e6a800] text-black font-bold text-lg py-3 transition-all duration-200 hover:scale-105">
                      Proceed to Checkout
                    </Button>
                  </Link>

                  <div className="mt-4 text-center text-sm text-gray-500">
                    <p>🔒 Secure checkout guaranteed</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
