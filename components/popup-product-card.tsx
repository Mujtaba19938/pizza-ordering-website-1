"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Minus, Plus, X, Check } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import type { Pizza } from "@/contexts/cart-context"

interface PopupProductCardProps {
  pizza: Pizza
  isOpen: boolean
  onClose: () => void
}

const sizeOptions = [
  { id: "small", label: 'Small (10")', price: 0 },
  { id: "medium", label: 'Medium (12")', price: 3 },
  { id: "large", label: 'Large (14")', price: 6 },
]

const crustOptions = [
  { id: "thin", label: "Thin Crust", price: 0 },
  { id: "thick", label: "Thick Crust", price: 1 },
  { id: "stuffed", label: "Stuffed Crust", price: 2 },
]

const toppingOptions = [
  { id: "extra-cheese", label: "Extra Cheese", price: 1.5 },
  { id: "pepperoni", label: "Pepperoni", price: 2 },
  { id: "mushrooms", label: "Mushrooms", price: 1 },
  { id: "olives", label: "Black Olives", price: 1 },
  { id: "bell-peppers", label: "Bell Peppers", price: 1 },
  { id: "onions", label: "Red Onions", price: 1 },
  { id: "sausage", label: "Italian Sausage", price: 2.5 },
  { id: "bacon", label: "Bacon", price: 2 },
]

export function PopupProductCard({ pizza, isOpen, onClose }: PopupProductCardProps) {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [selectedSize, setSelectedSize] = useState<"small" | "medium" | "large">("medium")
  const [selectedCrust, setSelectedCrust] = useState("thin")
  const [selectedToppings, setSelectedToppings] = useState<string[]>([])
  const [quantity, setQuantity] = useState(1)
  const [isVisible, setIsVisible] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      // Small delay to ensure the element is rendered before animation
      setTimeout(() => setIsVisible(true), 10)
    } else {
      setIsVisible(false)
      // Delay unmounting to allow closing animation
      setTimeout(() => setShouldRender(false), 300)
    }
  }, [isOpen])

  if (!shouldRender) return null

  const calculatePrice = () => {
    const basePrice = pizza.prices?.medium || pizza.price || 0
    const sizePrice = sizeOptions.find((s) => s.id === selectedSize)?.price || 0
    const crustPrice = crustOptions.find((c) => c.id === selectedCrust)?.price || 0
    const toppingsPrice = selectedToppings.reduce((total, toppingId) => {
      const topping = toppingOptions.find((t) => t.id === toppingId)
      return total + (topping?.price || 0)
    }, 0)
    return (basePrice + sizePrice + crustPrice + toppingsPrice) * quantity
  }

  const handleToppingChange = (toppingId: string, checked: boolean) => {
    if (checked) {
      setSelectedToppings([...selectedToppings, toppingId])
    } else {
      setSelectedToppings(selectedToppings.filter((id) => id !== toppingId))
    }
  }

  const handleAddToCart = () => {
    const sizeKey = selectedSize as "small" | "medium" | "large"
    const selectedToppingsList = selectedToppings
      .map((id) => toppingOptions.find((t) => t.id === id)?.label)
      .filter(Boolean) as string[]

    for (let i = 0; i < quantity; i++) {
      addToCart({
        pizza,
        size: sizeKey,
        selectedToppings: selectedToppingsList,
        selectedCrust: crustOptions.find((c) => c.id === selectedCrust)?.label,
      })
    }

    // Show success toast notification
    toast({
      title: (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold">Pizza Added to Cart!</span>
        </div>
      ),
      description: `${quantity} x ${pizza.name} (${sizeKey}) has been added to your cart.`,
      className: "border-green-200 bg-green-50 text-green-800",
    })

    onClose()
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
      isVisible ? 'animate-modal-fade-in' : ''
    }`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm ${
          isVisible ? 'animate-modal-fade-in' : ''
        }`}
        onClick={onClose}
      />
      
      {/* Popup Card */}
      <div className={`relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto ${
        isVisible ? 'animate-modal-slide-up' : ''
      }`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid lg:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="relative aspect-square lg:aspect-auto lg:h-[500px]">
            <Image
              src={pizza.image || "/placeholder.svg"}
              alt={pizza.name}
              fill
              className="object-cover rounded-l-2xl"
            />
            <Badge className="absolute top-4 left-4 bg-[#d62828] text-white">
              {pizza.category}
            </Badge>
          </div>

          {/* Content Section */}
          <div className="p-8 space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{pizza.name}</h2>
              <p className="text-gray-600 mb-4">
                {pizza.description || `Delicious ${pizza.name} made with fresh ingredients.`}
              </p>
              <div className="text-2xl font-bold text-[#d62828]">${calculatePrice().toFixed(2)}</div>
            </div>

            {/* Size Selection */}
            <div>
              <Label className="text-lg font-semibold mb-3 block">Size</Label>
              <div className="grid grid-cols-3 gap-3">
                {sizeOptions.map((size) => {
                  const active = selectedSize === size.id
                  return (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => setSelectedSize(size.id as "small" | "medium" | "large")}
                      className={`rounded-2xl border px-4 py-3 text-left transition-all bg-white/50 hover:bg-white/70 backdrop-blur-sm ${
                        active ? 'border-[#d62828] ring-2 ring-[#d62828]/40 shadow-md' : 'border-black/10'
                      }`}
                    >
                      <div className="font-semibold text-sm">{size.label}</div>
                      {size.price > 0 && (
                        <div className="text-xs text-muted-foreground">(+${size.price.toFixed(2)})</div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Crust Selection */}
            <div>
              <Label className="text-lg font-semibold mb-3 block">Crust</Label>
              <div className="grid grid-cols-3 gap-3">
                {crustOptions.map((crust) => {
                  const active = selectedCrust === crust.id
                  return (
                    <button
                      key={crust.id}
                      type="button"
                      onClick={() => setSelectedCrust(crust.id)}
                      className={`rounded-2xl border px-4 py-3 text-left transition-all bg-white/50 hover:bg-white/70 backdrop-blur-sm ${
                        active ? 'border-[#d62828] ring-2 ring-[#d62828]/40 shadow-md' : 'border-black/10'
                      }`}
                    >
                      <div className="font-semibold text-sm">{crust.label}</div>
                      {crust.price > 0 && (
                        <div className="text-xs text-muted-foreground">(+${crust.price.toFixed(2)})</div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Toppings Selection */}
            <div>
              <Label className="text-lg font-semibold mb-3 block">Extra Toppings</Label>
              <div className="flex flex-wrap gap-2">
                {toppingOptions.map((topping) => {
                  const checked = selectedToppings.includes(topping.id)
                  return (
                    <button
                      key={topping.id}
                      type="button"
                      onClick={() => handleToppingChange(topping.id, !checked)}
                      className={`rounded-full border px-3 py-2 text-sm transition-all bg-white/60 hover:bg-white/75 backdrop-blur-sm ${
                        checked ? 'border-[#d62828] ring-2 ring-[#d62828]/40 text-[#b91c1c] shadow' : 'border-black/10'
                      }`}
                    >
                      {topping.label} (+${topping.price.toFixed(2)})
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div>
                <Label className="text-lg font-semibold mb-3 block">Quantity</Label>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-10 h-10"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full bg-[#d62828] hover:bg-[#b91c1c] text-white py-4 text-lg font-semibold rounded-full"
                size="lg"
              >
                Add to Cart - ${calculatePrice().toFixed(2)}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
