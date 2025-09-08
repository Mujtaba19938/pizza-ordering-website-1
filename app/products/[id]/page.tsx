"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Navbar } from "@/components/navbar"
import { Minus, Plus, ArrowLeft } from "lucide-react"
import { pizzas } from "@/data/pizzas"
import { useCart } from "@/contexts/cart-context"

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

export default function ProductDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const [pizza, setPizza] = useState<any>(null)
  const [selectedSize, setSelectedSize] = useState("medium")
  const [selectedCrust, setSelectedCrust] = useState("thin")
  const [selectedToppings, setSelectedToppings] = useState<string[]>([])
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const pizzaId = Number.parseInt(params.id as string, 10)
    console.log("[v0] Looking for pizza with ID:", pizzaId, "from params:", params.id)

    const foundPizza = pizzas.find((p) => p.id === pizzaId)
    console.log("[v0] Found pizza:", foundPizza)

    if (foundPizza) {
      setPizza(foundPizza)
    }
  }, [params.id])

  if (!pizza) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Pizza not found</h1>
            <Button onClick={() => router.back()} className="mt-4">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const calculatePrice = () => {
    const basePrice = pizza.prices?.medium || pizza.price || 0

    // Add size price
    const sizePrice = sizeOptions.find((s) => s.id === selectedSize)?.price || 0

    // Add crust price
    const crustPrice = crustOptions.find((c) => c.id === selectedCrust)?.price || 0

    // Add toppings price
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

    console.log("[v0] Adding to cart with:", {
      pizza,
      size: sizeKey,
      selectedToppings: selectedToppingsList,
      selectedCrust: crustOptions.find((c) => c.id === selectedCrust)?.label,
    })

    // Add each quantity as separate dispatch calls
    for (let i = 0; i < quantity; i++) {
      addToCart({
        pizza,
        size: sizeKey,
        selectedToppings: selectedToppingsList,
        selectedCrust: crustOptions.find((c) => c.id === selectedCrust)?.label,
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 py-12">
        <Button onClick={() => router.back()} variant="ghost" className="mb-6 text-[#d62828] hover:text-[#b91c1c]">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Menu
        </Button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden">
            <Image src={pizza.image || "/placeholder.svg"} alt={pizza.name} fill className="object-cover" />
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{pizza.name}</h1>
              <p className="text-lg text-gray-600 mb-6">
                {pizza.description ||
                  `Delicious ${pizza.name} pizza made with fresh ingredients and our signature sauce.`}
              </p>
              <div className="text-3xl font-bold text-[#d62828]">${calculatePrice().toFixed(2)}</div>
            </div>

            {/* Size Selection */}
            <Card>
              <CardContent className="p-6">
                <Label className="text-lg font-semibold mb-4 block">Size</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {sizeOptions.map((size) => {
                    const active = selectedSize === size.id
                    return (
                      <button
                        key={size.id}
                        type="button"
                        onClick={() => setSelectedSize(size.id)}
                        className={`rounded-2xl border px-4 py-4 text-left transition-all bg-white/50 dark:bg-white/5 hover:bg-white/70 dark:hover:bg-white/10 backdrop-blur-sm ${
                          active ? 'border-[#d62828] ring-2 ring-[#d62828]/40 shadow-md' : 'border-black/10 dark:border-white/10'
                        }`}
                      >
                        <div className="font-semibold">{size.label}</div>
                        {size.price > 0 && (
                          <div className="text-sm text-muted-foreground">(+${size.price.toFixed(2)})</div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Crust Selection */}
            <Card>
              <CardContent className="p-6">
                <Label className="text-lg font-semibold mb-4 block">Crust</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {crustOptions.map((crust) => {
                    const active = selectedCrust === crust.id
                    return (
                      <button
                        key={crust.id}
                        type="button"
                        onClick={() => setSelectedCrust(crust.id)}
                        className={`rounded-2xl border px-4 py-4 text-left transition-all bg-white/50 dark:bg-white/5 hover:bg-white/70 dark:hover:bg-white/10 backdrop-blur-sm ${
                          active ? 'border-[#d62828] ring-2 ring-[#d62828]/40 shadow-md' : 'border-black/10 dark:border-white/10'
                        }`}
                      >
                        <div className="font-semibold">{crust.label}</div>
                        {crust.price > 0 && (
                          <div className="text-sm text-muted-foreground">(+${crust.price.toFixed(2)})</div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Toppings Selection */}
            <Card>
              <CardContent className="p-6">
                <Label className="text-lg font-semibold mb-4 block">Extra Toppings</Label>
                <div className="flex flex-wrap gap-3">
                  {toppingOptions.map((topping) => {
                    const checked = selectedToppings.includes(topping.id)
                    return (
                      <button
                        key={topping.id}
                        type="button"
                        onClick={() => handleToppingChange(topping.id, !checked)}
                        className={`rounded-full border px-4 py-2 text-sm transition-all bg-white/60 dark:bg-white/5 hover:bg-white/75 dark:hover:bg-white/10 backdrop-blur-sm ${
                          checked ? 'border-[#d62828] ring-2 ring-[#d62828]/40 text-[#b91c1c] shadow' : 'border-black/10 dark:border-white/10'
                        }`}
                        aria-pressed={checked}
                      >
                        {topping.label} (+${topping.price.toFixed(2)})
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quantity and Add to Cart */}
            <div className="space-y-6">
              <div>
                <Label className="text-lg font-semibold mb-4 block">Quantity</Label>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                  <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
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
