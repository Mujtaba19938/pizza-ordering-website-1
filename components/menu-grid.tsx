"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Plus, Minus, Check } from "lucide-react"
import { pizzas } from "@/data/pizzas"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import type { Pizza } from "@/contexts/cart-context"

const categories = ["All", "Classic", "Meat", "Vegetarian", "Specialty"]

export function MenuGrid() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedSizes, setSelectedSizes] = useState<{ [key: number]: "small" | "medium" | "large" }>({})
  const [selectedToppings, setSelectedToppings] = useState<{ [key: number]: string[] }>({})
  const [selectedCrusts, setSelectedCrusts] = useState<{ [key: number]: string }>({})
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({})
  const { dispatch } = useCart()
  const { toast } = useToast()

  // Filter out drinks from the main product grid and filter by category
  const filteredPizzas = pizzas
    .filter((pizza) => pizza.category !== "Drinks")
    .filter((pizza) => selectedCategory === "All" || pizza.category === selectedCategory)

  const handleSizeSelect = (pizzaId: number, size: "small" | "medium" | "large") => {
    setSelectedSizes((prev) => ({ ...prev, [pizzaId]: size }))
  }

  const handleToppingToggle = (pizzaId: number, topping: string) => {
    setSelectedToppings((prev) => {
      const current = prev[pizzaId] || []
      const updated = current.includes(topping) ? current.filter((t) => t !== topping) : [...current, topping]
      return { ...prev, [pizzaId]: updated }
    })
  }

  const handleCrustSelect = (pizzaId: number, crust: string) => {
    setSelectedCrusts((prev) => ({ ...prev, [pizzaId]: crust }))
  }

  const handleQuantityChange = (pizzaId: number, change: number) => {
    setQuantities((prev) => {
      const current = prev[pizzaId] || 1
      const newQuantity = Math.max(1, current + change)
      return { ...prev, [pizzaId]: newQuantity }
    })
  }

  const handleAddToCart = (pizza: Pizza) => {
    const size = selectedSizes[pizza.id] || "medium"
    const toppings = selectedToppings[pizza.id] || []
    const crust = selectedCrusts[pizza.id] || pizza.crustOptions?.[0]
    const quantity = quantities[pizza.id] || 1

    for (let i = 0; i < quantity; i++) {
      dispatch({
        type: "ADD_TO_CART",
        payload: {
          pizza,
          size,
          selectedToppings: toppings,
          selectedCrust: crust,
        },
      })
    }

    // Show success toast notification
    const getItemType = (category: string) => {
      switch (category) {
        case "Desserts":
          return "Dessert"
        case "Drinks":
          return "Drink"
        default:
          return "Pizza"
      }
    }

    toast({
      title: (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold">{getItemType(pizza.category)} Added to Cart!</span>
        </div>
      ),
      description: `${quantity} x ${pizza.name} (${size}) has been added to your cart.`,
      className: "border-green-200 bg-green-50 text-green-800",
    })
  }

  const calculatePrice = (pizza: Pizza, pizzaId: number) => {
    const size = selectedSizes[pizzaId] || "medium"
    const toppings = selectedToppings[pizzaId] || []
    const basePrice = pizza.prices[size]
    const toppingsPrice = toppings.length * 2
    return basePrice + toppingsPrice
  }

  return (
    <div>
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className={
              selectedCategory === category
                ? "bg-[#d62828] text-white hover:bg-[#b91c1c]"
                : "border-[#d62828] text-[#d62828] hover:bg-[#d62828] hover:text-white"
            }
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Pizza Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPizzas.map((pizza) => {
          const selectedSize = selectedSizes[pizza.id] || "medium"
          const price = calculatePrice(pizza, pizza.id)
          const quantity = quantities[pizza.id] || 1

          return (
            <Card key={pizza.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={pizza.image || "/placeholder.svg"}
                    alt={pizza.name}
                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <Badge className="absolute top-4 left-4 bg-[#d62828] text-white">{pizza.category}</Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-[#d62828] mb-2">{pizza.name}</h3>
                  <p className="text-muted-foreground mb-2 leading-relaxed">{pizza.description}</p>

                  {/* Base Toppings */}
                  {pizza.toppings && (
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Includes:</span> {pizza.toppings.join(", ")}
                    </div>
                  )}
                </div>

                <Separator />

                {/* Size Selection */}
                <div>
                  <Label className="font-semibold mb-2 block">Size:</Label>
                  <div className="flex gap-2">
                    {(["small", "medium", "large"] as const).map((size) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleSizeSelect(pizza.id, size)}
                        className={
                          selectedSize === size
                            ? "bg-[#ffbe0b] text-black hover:bg-[#e6a800]"
                            : "border-[#ffbe0b] text-[#ffbe0b] hover:bg-[#ffbe0b] hover:text-black"
                        }
                      >
                        {size.charAt(0).toUpperCase() + size.slice(1)} (${pizza.prices[size]})
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Crust Selection */}
                {pizza.crustOptions && (
                  <div>
                    <Label className="font-semibold mb-2 block">Crust:</Label>
                    <RadioGroup
                      value={selectedCrusts[pizza.id] || pizza.crustOptions[0]}
                      onValueChange={(value) => handleCrustSelect(pizza.id, value)}
                      className="flex flex-wrap gap-4"
                    >
                      {pizza.crustOptions.map((crust) => (
                        <div key={crust} className="flex items-center space-x-2">
                          <RadioGroupItem value={crust} id={`${pizza.id}-${crust}`} />
                          <Label htmlFor={`${pizza.id}-${crust}`} className="text-sm">
                            {crust}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                {/* Extra Toppings */}
                {pizza.availableToppings && (
                  <div>
                    <Label className="font-semibold mb-2 block">Extra Toppings (+$2 each):</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {pizza.availableToppings.map((topping) => (
                        <div key={topping} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${pizza.id}-${topping}`}
                            checked={(selectedToppings[pizza.id] || []).includes(topping)}
                            onCheckedChange={() => handleToppingToggle(pizza.id, topping)}
                          />
                          <Label htmlFor={`${pizza.id}-${topping}`} className="text-sm">
                            {topping}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Quantity Selection */}
                <div className="flex items-center justify-between">
                  <Label className="font-semibold">Quantity:</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 bg-transparent"
                      onClick={() => handleQuantityChange(pizza.id, -1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 bg-transparent"
                      onClick={() => handleQuantityChange(pizza.id, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Price Display */}
                <div className="text-center">
                  <span className="text-2xl font-bold text-[#d62828]">${(price * quantity).toFixed(2)}</span>
                  {quantity > 1 && <div className="text-sm text-muted-foreground">${price.toFixed(2)} each</div>}
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <Button
                  className="w-full bg-[#ffbe0b] text-black hover:bg-[#e6a800] font-semibold transition-all hover:scale-105"
                  onClick={() => handleAddToCart(pizza)}
                >
                  Add {quantity} to Cart - ${(price * quantity).toFixed(2)}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
