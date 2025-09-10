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
          <h1 className="text-5xl font-bold text-[#d62828] mb-4 inline-block px-8 py-2 bg-white shadow-lg" style={{ borderRadius: '9999px' }}>
            Our Menu
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-6">
            Discover our delicious selection of handcrafted pizzas made with the finest ingredients
          </p>
        </div>

        {/* Category Filter - Pill Navigation */}
        <div className="flex flex-wrap justify-center mb-12">
          <div className="bg-gray-100 p-1 rounded-full inline-flex gap-1">
            {categories.map((category) => (
              <div key={category} className="relative">
                <button
                  onClick={() => setSelectedCategory(category)}
                  className={`pill-nav-button px-6 py-3 text-sm font-semibold ${
                    selectedCategory === category
                      ? "bg-[#d62828] text-white shadow-lg transform scale-105"
                      : "text-gray-600 hover:text-[#d62828] hover:bg-white hover:shadow-md"
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
                  <div className="absolute -top-1 -right-1 bg-[#ffbe0b] text-black text-xs font-bold px-2 py-1 rounded-full animate-pump">
                    NEW
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
