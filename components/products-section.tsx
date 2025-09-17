"use client"

import Image from "next/image"
import { Star, Plus, ArrowRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/contexts/cart-context"
import { useState } from "react"
import { useRouter } from "next/navigation"

const products = [
  {
    id: 1,
    name: "Margherita Pizza",
    rating: 4.8,
    reviews: 144,
    price: 20.15,
    image: "/images/margherita-pizza.png",
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    rating: 4.7,
    reviews: 126,
    price: 22.5,
    image: "/images/pepperoni-pizza-new.png",
  },
  {
    id: 3,
    name: "Supreme Pizza",
    rating: 4.9,
    reviews: 189,
    price: 28.0,
    image: "/images/supreme-pizza-new.jpeg",
  },
  {
    id: 4,
    name: "Hawaiian Pizza",
    rating: 4.6,
    reviews: 98,
    price: 24.85,
    image: "/images/hawaiian-pizza.png",
  },
  {
    id: 5,
    name: "Pepperoni Deluxe",
    rating: 4.8,
    reviews: 152,
    price: 26.5,
    image: "/images/pepperoni-deluxe.jpeg",
  },
  {
    id: 6,
    name: "Margherita Deluxe",
    rating: 4.7,
    reviews: 134,
    price: 23.85,
    image: "/images/margherita-deluxe.png",
  },
  {
    id: 7,
    name: "Pizza With Creamy Sauce",
    rating: 4.6,
    reviews: 98,
    price: 25.85,
    image: "/images/pepperoni-pizza.png",
  },
  {
    id: 8,
    name: "Classic Supreme",
    rating: 4.8,
    reviews: 167,
    price: 29.0,
    image: "/images/supreme-pizza.png",
  },
]

export default function ProductsSection() {
  const { addItem } = useCart()
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({})
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleAddToCart = (product: any) => {
    const quantity = quantities[product.id] || 1
    
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: `${product.id}-${Date.now()}-${i}`,
        name: product.name,
        price: product.price,
        image: product.image,
        description: `Delicious ${product.name} with premium ingredients`,
        customizations: {
          size: "Medium",
          crust: "Regular",
          toppings: [],
          drink: "None",
        },
      })
    }

    setQuantities((prev) => ({ ...prev, [product.id]: 1 }))
  }

  const updateQuantity = (productId: number, change: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + change),
    }))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/menu?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-[#d62828] font-semibold mb-2 uppercase tracking-wide">BEST SELLING DISHES</p>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase">EXPLORE OUR PRODUCTS</h2>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-12">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for your favorite pizza..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg border-2 border-gray-300 focus:border-[#d62828] focus:ring-2 focus:ring-[#d62828] rounded-lg"
              />
            </div>
            <Button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#d62828] hover:bg-[#b91c1c] text-white px-6 py-2 rounded-md"
            >
              Search
            </Button>
          </form>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 && searchQuery ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">No results found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any products matching "{searchQuery}". Try searching for something else.
              </p>
              <Button 
                onClick={() => setSearchQuery("")}
                className="bg-[#d62828] hover:bg-[#b91c1c] text-white"
              >
                Clear Search
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="aspect-square relative bg-gray-100">
                <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-bold text-gray-900 mb-2">{product.name}</h3>
                <div className="flex items-center justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">({product.reviews})</span>
                </div>
                <p className="text-[#d62828] font-bold text-lg mb-4">${product.price.toFixed(2)}</p>
                
                {/* Quantity Controls and Add to Cart Button */}
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-8 h-8 p-0 border-[#d62828] text-[#d62828] hover:bg-[#d62828] hover:text-white"
                    onClick={() => updateQuantity(product.id, -1)}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center font-bold">{quantities[product.id] || 1}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-8 h-8 p-0 border-[#d62828] text-[#d62828] hover:bg-[#d62828] hover:text-white"
                    onClick={() => updateQuantity(product.id, 1)}
                  >
                    +
                  </Button>
                </div>
                
                <Button
                  className="w-full bg-[#ffbe0b] hover:bg-[#e6a800] text-black font-bold transition-all duration-200 hover:scale-105 active:scale-95"
                  onClick={() => handleAddToCart(product)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  ADD TO CART
                </Button>
              </div>
            </div>
          ))}
          </div>
        )}
        
        {/* View Full Menu Button */}
        <div className="text-center mt-12">
          <Button
            className="bg-[#d62828] hover:bg-[#b91c1c] text-white font-bold px-8 py-4 text-lg transition-all duration-200 hover:scale-105 active:scale-95"
            onClick={() => router.push('/menu')}
          >
            VIEW FULL MENU
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}
