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

  // Filter out drinks from the main product grid and filter by category
  const filteredPizzas = pizzas
    .filter((pizza) => pizza.category !== "Drinks")
    .filter((pizza) => selectedCategory === "All" || pizza.category === selectedCategory)

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
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#d62828] mb-2 sm:mb-4 inline-block px-4 sm:px-6 md:px-8 py-2 bg-white shadow-lg" style={{ borderRadius: '9999px' }}>
            Our Menu
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-4 sm:mt-6 px-4">
            Discover our delicious selection of handcrafted pizzas made with the finest ingredients
          </p>
        </div>

        {/* Category Filter - Pill Navigation */}
        <div className="flex flex-wrap justify-center mb-8 sm:mb-12 px-2">
          <div className="bg-gray-100 p-0.5 sm:p-1 rounded-full inline-flex gap-0.5 sm:gap-1 overflow-x-auto w-full sm:w-auto">
            {categories.map((category) => (
              <div key={category} className="relative flex-shrink-0">
                <button
                  onClick={() => setSelectedCategory(category)}
                  className={`pill-nav-button px-2 sm:px-3 md:px-4 lg:px-5 py-1.5 sm:py-2 md:py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    selectedCategory === category
                      ? "bg-[#d62828] text-white shadow-md transform scale-105"
                      : "text-gray-600 hover:text-[#d62828] hover:bg-white hover:shadow-sm"
                  }`}
                  style={{
                    borderRadius: '9999px',
                    border: 'none',
                    outline: 'none'
                  }}
                >
                  {category}
                </button>
                {category === "Desserts" && (
                  <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-[#ffbe0b] text-black text-xs font-bold px-1 sm:px-1.5 py-0.5 sm:py-1 rounded-full animate-pump">
                    NEW
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {filteredPizzas.map((pizza) => (
            <ProductCard
              key={pizza.id}
              id={pizza.id.toString()}
              name={pizza.name}
              price={pizza.prices.medium}
              image={pizza.image}
              description={pizza.description}
              onClick={() => handlePizzaClick(pizza)}
            />
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
