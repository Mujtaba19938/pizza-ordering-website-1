"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Minus, Plus, Trash2 } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import Link from "next/link"

export function CartContent() {
  const { state, dispatch } = useCart()

  const updateQuantity = (pizzaId: number, size: "small" | "medium" | "large", quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { pizzaId, size, quantity } })
  }

  const removeItem = (pizzaId: number, size: "small" | "medium" | "large") => {
    dispatch({ type: "REMOVE_FROM_CART", payload: { pizzaId, size } })
  }

  if (state.items.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16">
        <div className="text-4xl sm:text-6xl mb-4">🍕</div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#d62828] mb-4">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">Add some delicious pizzas to get started!</p>
        <Link href="/menu">
          <Button className="bg-[#d62828] text-white hover:bg-[#b91c1c] text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3">Browse Menu</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          {state.items.map((item, index) => (
            <Card key={`${item.pizza.id}-${item.size}-${index}`} className="p-3 sm:p-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <img
                  src={item.pizza.image || "/placeholder.svg"}
                  alt={item.pizza.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#d62828] text-sm sm:text-base line-clamp-2">{item.pizza.name}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-2">{item.pizza.description}</p>
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                    <span className="text-sm font-medium">
                      Size: {item.size.charAt(0).toUpperCase() + item.size.slice(1)}
                    </span>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm font-bold">${item.price}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.pizza.id, item.size, item.quantity - 1)}
                      className="h-7 w-7 sm:h-8 sm:w-8"
                    >
                      <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <span className="w-6 sm:w-8 text-center font-semibold text-sm sm:text-base">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.pizza.id, item.size, item.quantity + 1)}
                      className="h-7 w-7 sm:h-8 sm:w-8"
                    >
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>

                  <div className="text-center sm:text-right">
                    <p className="font-bold text-base sm:text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.pizza.id, item.size)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 w-7 sm:h-8 sm:w-8 p-0"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-[#d62828]">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${state.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${(state.total * 0.08).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>$3.99</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${(state.total + state.total * 0.08 + 3.99).toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Link href="/checkout" className="w-full">
                <Button className="w-full bg-[#d62828] text-white hover:bg-[#b91c1c] font-semibold">
                  Proceed to Checkout
                </Button>
              </Link>
              <Link href="/menu" className="w-full">
                <Button
                  variant="outline"
                  className="w-full border-[#d62828] text-[#d62828] hover:bg-[#d62828] hover:text-white bg-transparent"
                >
                  Continue Shopping
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
