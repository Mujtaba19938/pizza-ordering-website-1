"use client"

import { Navbar } from "@/components/navbar"
import { ProductCard } from "@/components/product-card"
import { PopupProductCard } from "@/components/popup-product-card"
import { pizzas } from "@/data/pizzas"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const categories = ["All", "Classic", "Meat", "Vegetarian", "Specialty", "Desserts"]

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedPizza, setSelectedPizza] = useState<any>(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const filteredPizzas =
    selectedCategory === "All" ? pizzas : pizzas.filter((pizza) => pizza.category === selectedCategory)

  const handlePizzaClick = (pizza: any) => {
    setSelectedPizza(pizza)
    setIsPopupOpen(true)
  }

  const handleClosePopup = () => {
    setIsPopupOpen(false)
    setSelectedPizza(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[#d62828] mb-4">Our Menu</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our delicious selection of handcrafted pizzas made with the finest ingredients
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <div key={category} className="relative">
              <Button
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
              {category === "Desserts" && (
                <div className="absolute -top-2 -right-2 bg-[#ffbe0b] text-black text-xs font-bold px-2 py-1 rounded-full animate-pump">
                  NEW
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPizzas.map((pizza) => (
            <div key={pizza.id} onClick={() => handlePizzaClick(pizza)} className="cursor-pointer">
              <ProductCard
                id={pizza.id.toString()}
                name={pizza.name}
                price={pizza.prices.medium}
                image={pizza.image}
                description={pizza.description}
              />
            </div>
          ))}
        </div>

        {/* Popup Product Card */}
        {selectedPizza && (
          <PopupProductCard
            pizza={selectedPizza}
            isOpen={isPopupOpen}
            onClose={handleClosePopup}
          />
        )}
      </div>
    </div>
  )
}
