"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { pizzas } from "@/data/pizzas"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import { Plus, Check } from "lucide-react"

interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string
  description?: string
  onClick?: () => void
  showDrinks?: boolean
}

export function ProductCard({ id, name, price, image, description, onClick, showDrinks = false }: ProductCardProps) {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [selectedDrinks, setSelectedDrinks] = useState<{[key: string]: number}>({})

  // Get drinks from the pizzas data
  const drinks = pizzas.filter(pizza => pizza.category === "Drinks")

  const handleDrinkAdd = (drinkId: number, drinkName: string) => {
    setSelectedDrinks(prev => ({
      ...prev,
      [drinkId]: (prev[drinkId] || 0) + 1
    }))

    // Add drink to cart
    const drink = pizzas.find(p => p.id === drinkId)
    if (drink) {
      addToCart({
        pizza: drink,
        size: "medium",
        selectedToppings: [],
        selectedCrust: undefined,
      })

      toast({
        title: (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">Drink Added to Cart!</span>
          </div>
        ),
        description: `${drinkName} has been added to your cart.`,
        className: "border-green-200 bg-green-50 text-green-800",
      })
    }
  }

  return (
    <Card className="group overflow-hidden rounded-2xl border-0 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 py-0">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>
          {description && <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>}
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-[#d62828]">${price.toFixed(2)}</span>
            {onClick ? (
              <Button 
                onClick={onClick}
                className="bg-[#d62828] hover:bg-[#b91c1c] text-white px-6 py-2 rounded-full transition-colors duration-200"
              >
                View Details
              </Button>
            ) : (
              <Link href={`/products/${id}`}>
                <Button className="bg-[#d62828] hover:bg-[#b91c1c] text-white px-6 py-2 rounded-full transition-colors duration-200">
                  View Details
                </Button>
              </Link>
            )}
          </div>

          {/* Drinks Section */}
          {showDrinks && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-2xl">🥤</span>
                Cold Drinks
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {drinks.map((drink) => (
                  <div key={drink.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{drink.name}</p>
                      <p className="text-xs text-gray-500">${drink.prices.medium}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleDrinkAdd(drink.id, drink.name)}
                      className="h-8 w-8 p-0 bg-[#d62828] hover:bg-[#b91c1c] text-white rounded-full"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
