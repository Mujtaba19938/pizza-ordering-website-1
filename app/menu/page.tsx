"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Plus, Minus, X, Check } from "lucide-react"
import Image from "next/image"
import { useCart } from "@/contexts/cart-context"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"

const menuCategories = [
  {
    title: "SIGNATURE PIZZAS",
    items: [
      {
        id: 1,
        name: "Supreme Deluxe",
        description: "Pepperoni, mushrooms, black olives, bell peppers, Italian sausage",
        price: 28.99,
        image: "/images/carousel-pizza-1.png",
        rating: 4.8,
        popular: true,
      },
      {
        id: 2,
        name: "Margherita Classic",
        description: "Fresh mozzarella, tomatoes, basil, extra virgin olive oil",
        price: 24.99,
        image: "/images/carousel-pizza-2.png",
        rating: 4.9,
        popular: false,
      },
      {
        id: 3,
        name: "Pepperoni Feast",
        description: "Double pepperoni, mozzarella cheese, Italian herbs",
        price: 26.99,
        image: "/images/carousel-pizza-3.png",
        rating: 4.7,
        popular: true,
      },
    ],
  },
  {
    title: "SPECIALTY PIZZAS",
    items: [
      {
        id: 4,
        name: "Hawaiian Paradise",
        description: "Ham, pineapple, mozzarella cheese, tomato sauce",
        price: 25.99,
        image: "/images/hawaiian-pizza.png",
        rating: 4.6,
        popular: false,
      },
      {
        id: 5,
        name: "Meat Lovers",
        description: "Pepperoni, sausage, ham, bacon, ground beef",
        price: 32.99,
        image: "/images/pepperoni-pizza-new.png",
        rating: 4.8,
        popular: true,
      },
      {
        id: 6,
        name: "Veggie Supreme",
        description: "Mushrooms, bell peppers, onions, black olives, tomatoes",
        price: 23.99,
        image: "/images/margherita-pizza.png",
        rating: 4.5,
        popular: false,
      },
    ],
  },
  {
    title: "GOURMET COLLECTION",
    items: [
      {
        id: 7,
        name: "Truffle Mushroom",
        description: "Wild mushrooms, truffle oil, goat cheese, arugula",
        price: 35.99,
        image: "/images/supreme-pizza-new.jpeg",
        rating: 4.9,
        popular: true,
      },
      {
        id: 8,
        name: "BBQ Chicken Ranch",
        description: "Grilled chicken, BBQ sauce, red onions, cilantro, ranch drizzle",
        price: 29.99,
        image: "/images/pepperoni-deluxe.jpeg",
        rating: 4.7,
        popular: false,
      },
    ],
  },
]

const sizeOptions = [
  { name: "Small", price: 0, size: '10"' },
  { name: "Medium", price: 4, size: '12"' },
  { name: "Large", price: 8, size: '14"' },
]

const crustOptions = [
  { name: "Thin Crust", price: 0 },
  { name: "Regular", price: 0 },
  { name: "Stuffed Crust", price: 3 },
]

const toppingsOptions = [
  { name: "Extra Cheese", price: 2 },
  { name: "Mushrooms", price: 1.5 },
  { name: "Black Olives", price: 1.5 },
  { name: "Bell Peppers", price: 1.5 },
  { name: "Pepperoni", price: 2.5 },
  { name: "Italian Sausage", price: 2.5 },
  { name: "Ham", price: 2 },
  { name: "Bacon", price: 2.5 },
]

const drinkOptions = [
  { name: "None", price: 0 },
  { name: "Coca Cola", price: 2.99 },
  { name: "Pepsi", price: 2.99 },
  { name: "Sprite", price: 2.99 },
  { name: "Water", price: 1.99 },
  { name: "Orange Juice", price: 3.49 },
]

export default function MenuPage() {
  const { addItem } = useCart()
  const searchParams = useSearchParams()
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({})
  const [expandedCard, setExpandedCard] = useState<number | null>(null)
  const [selectedSize, setSelectedSize] = useState<{ [key: number]: number }>({})
  const [selectedCrust, setSelectedCrust] = useState<{ [key: number]: number }>({})
  const [selectedToppings, setSelectedToppings] = useState<{ [key: number]: number[] }>({})
  const [selectedDrink, setSelectedDrink] = useState<{ [key: number]: number }>({})
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string | null>(null)

  // Handle category filtering and search from URL parameters
  useEffect(() => {
    const category = searchParams?.get('category')
    const search = searchParams?.get('search')
    
    if (category) {
      setActiveCategory(category)
    } else {
      setActiveCategory(null)
    }
    
    if (search) {
      setSearchQuery(search)
    } else {
      setSearchQuery(null)
    }
  }, [searchParams])

  // Filter categories based on active category and search
  const getFilteredCategories = () => {
    let filteredCategories = menuCategories

    // Apply category filter
    if (activeCategory) {
      const categoryMap: { [key: string]: string } = {
        'signature': 'SIGNATURE PIZZAS',
        'specialty': 'SPECIALTY PIZZAS', 
        'gourmet': 'GOURMET COLLECTION',
        'meat': 'SPECIALTY PIZZAS', // Meat Lovers is in Specialty Pizzas
        'veggie': 'SPECIALTY PIZZAS' // Veggie Supreme is in Specialty Pizzas
      }

      const targetTitle = categoryMap[activeCategory]
      if (targetTitle) {
        filteredCategories = menuCategories.filter(category => category.title === targetTitle)
      }
    }

    // Apply search filter
    if (searchQuery) {
      filteredCategories = filteredCategories.map(category => ({
        ...category,
        items: category.items.filter(item => 
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.items.length > 0)
    }

    return filteredCategories
  }

  // Filter items within categories for specific types (only when not searching)
  const getFilteredItems = (category: { items: any[] }) => {
    // If we're searching, items are already filtered in getFilteredCategories
    if (searchQuery) return category.items

    if (!activeCategory) return category.items

    if (activeCategory === 'meat') {
      return category.items.filter((item: any) => 
        item.name.toLowerCase().includes('meat') || 
        item.description.toLowerCase().includes('meat') ||
        item.name.toLowerCase().includes('pepperoni') ||
        item.name.toLowerCase().includes('sausage') ||
        item.name.toLowerCase().includes('bacon')
      )
    }

    if (activeCategory === 'veggie') {
      return category.items.filter((item: any) => 
        item.name.toLowerCase().includes('veggie') || 
        item.description.toLowerCase().includes('vegetable') ||
        item.name.toLowerCase().includes('margherita') ||
        item.description.toLowerCase().includes('mushroom')
      )
    }

    return category.items
  }

  const closeExpandedCard = () => {
    setExpandedCard(null)
  }

  const updateQuantity = (itemId: number, change: number) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(1, (prev[itemId] || 1) + change),
    }))
  }

  const calculatePrice = (basePrice: number, itemId: number) => {
    const sizePrice = sizeOptions[selectedSize[itemId] || 1]?.price || 0
    const crustPrice = crustOptions[selectedCrust[itemId] || 1]?.price || 0
    const toppingsPrice = (selectedToppings[itemId] || []).reduce(
      (sum, toppingIndex) => sum + toppingsOptions[toppingIndex].price,
      0,
    )
    const drinkPrice = drinkOptions[selectedDrink[itemId] || 0]?.price || 0

    return basePrice + sizePrice + crustPrice + toppingsPrice + drinkPrice
  }

  const handleAddToCart = (item: any) => {
    const quantity = quantities[item.id] || 1
    const finalPrice = calculatePrice(item.price, item.id)

    const customizations = {
      size: sizeOptions[selectedSize[item.id] || 1]?.name || "Medium",
      crust: crustOptions[selectedCrust[item.id] || 1]?.name || "Regular",
      toppings: (selectedToppings[item.id] || []).map((index) => toppingsOptions[index].name),
      drink: drinkOptions[selectedDrink[item.id] || 0]?.name || "None",
    }

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: `${item.id}-${Date.now()}-${i}`,
        name: item.name,
        price: finalPrice,
        image: item.image,
        description: item.description,
        customizations,
      })
    }

    setQuantities((prev) => ({ ...prev, [item.id]: 1 }))
    setExpandedCard(null)
  }

  const toggleTopping = (itemId: number, toppingIndex: number) => {
    setSelectedToppings((prev) => {
      const current = prev[itemId] || []
      const isSelected = current.includes(toppingIndex)

      return {
        ...prev,
        [itemId]: isSelected ? current.filter((i) => i !== toppingIndex) : [...current, toppingIndex],
      }
    })
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Backdrop overlay for expanded card */}
      {expandedCard && (
        <div
          className="fixed inset-0 bg-black/50 z-[90] transition-opacity duration-300"
          onClick={closeExpandedCard}
        />
      )}

      {/* Hero Section */}
      <section className="bg-[#d62828] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-4">OUR MENU</h1>
          <p className="text-xl md:text-2xl mb-8">Discover our delicious selection of handcrafted pizzas</p>
          <div className="flex justify-center items-center space-x-4">
            <div className="w-16 h-1 bg-[#ffbe0b]"></div>
            <span className="text-[#ffbe0b] font-bold">FRESH • AUTHENTIC • DELICIOUS</span>
            <div className="w-16 h-1 bg-[#ffbe0b]"></div>
          </div>
        </div>
      </section>

      {/* Menu Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Search Results Display */}
          {searchQuery && (
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Search Results for "{searchQuery}"
              </h2>
              <p className="text-gray-600">
                Found {getFilteredCategories().reduce((total, category) => total + category.items.length, 0)} items
              </p>
            </div>
          )}

          {/* Category Filter Display */}
          {activeCategory && !searchQuery && (
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {activeCategory === 'meat' ? 'Meat Lovers' : 
                 activeCategory === 'veggie' ? 'Vegetarian Options' :
                 activeCategory === 'signature' ? 'Signature Pizzas' :
                 activeCategory === 'specialty' ? 'Specialty Pizzas' :
                 activeCategory === 'gourmet' ? 'Gourmet Collection' : ''}
              </h2>
              <p className="text-gray-600">Showing filtered results</p>
            </div>
          )}

          {getFilteredCategories().length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {searchQuery ? 'No results found' : 'No items available'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery 
                    ? `We couldn't find any items matching "${searchQuery}". Try searching for something else.`
                    : 'There are no items available in this category at the moment.'
                  }
                </p>
                {searchQuery && (
                  <Button 
                    onClick={() => window.history.back()}
                    className="bg-[#d62828] hover:bg-[#b91c1c] text-white"
                  >
                    Back to Menu
                  </Button>
                )}
              </div>
            </div>
          ) : (
            getFilteredCategories().map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-16">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-black text-gray-800 mb-4">{category.title}</h2>
                <div className="w-24 h-1 bg-[#d62828] mx-auto"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFilteredItems(category).map((item) => (
                  <Card
                    key={item.id}
                    className={`group transition-all duration-500 border-0 overflow-hidden cursor-pointer ${
                      expandedCard === item.id
                        ? "fixed inset-4 z-[100] bg-white shadow-2xl rounded-2xl max-w-4xl mx-auto my-8 h-auto max-h-[90vh] overflow-y-auto"
                        : "hover:shadow-2xl hover:scale-105"
                    }`}
                    onClick={() => expandedCard !== item.id && setExpandedCard(item.id)}
                  >
                    {expandedCard === item.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white rounded-full w-10 h-10 p-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          setExpandedCard(null)
                        }}
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    )}

                    <div className="relative">
                      {item.popular && (
                        <div className="absolute top-4 left-4 z-10 bg-[#d62828] text-white px-3 py-1 rounded-full text-sm font-bold">
                          POPULAR
                        </div>
                      )}
                      <div className={`relative overflow-hidden aspect-square ${expandedCard === item.id ? "max-h-64" : ""}`}>
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className={`object-cover transition-transform duration-300 ${
                            expandedCard !== item.id ? "group-hover:scale-110" : ""
                          }`}
                        />
                      </div>
                    </div>

                    <CardContent className={`${expandedCard === item.id ? "p-8" : "p-4"}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`font-bold text-gray-800 ${expandedCard === item.id ? "text-3xl" : "text-xl"}`}>
                          {item.name}
                        </h3>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-[#ffbe0b] text-[#ffbe0b]" />
                          <span className="text-sm font-medium text-gray-600">{item.rating}</span>
                        </div>
                      </div>

                      <p
                        className={`text-gray-600 mb-4 leading-relaxed ${
                          expandedCard === item.id ? "text-base mb-8" : "text-sm mb-4"
                        }`}
                      >
                        {item.description}
                      </p>

                      {expandedCard === item.id && (
                        <div className="space-y-8 mb-8 relative z-[110] pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                          {/* Size Selection */}
                          <div>
                            <h4 className="text-lg font-bold text-gray-800 mb-4">Choose Size</h4>
                            <div className="grid grid-cols-3 gap-3">
                              {sizeOptions.map((size, index) => (
                                <button
                                  key={index}
                                  className={`p-4 rounded-lg border-2 transition-all duration-200 relative z-[120] pointer-events-auto ${
                                    (selectedSize[item.id] || 1) === index
                                      ? "border-[#d62828] bg-[#d62828]/10 text-[#d62828]"
                                      : "border-gray-200 hover:border-[#d62828]/50"
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedSize((prev) => ({ ...prev, [item.id]: index }))
                                  }}
                                >
                                  <div className="font-bold">{size.name}</div>
                                  <div className="text-sm text-gray-600">{size.size}</div>
                                  {size.price > 0 && <div className="text-sm text-[#d62828]">+${size.price}</div>}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Crust Selection */}
                          <div>
                            <h4 className="text-lg font-bold text-gray-800 mb-4">Choose Crust</h4>
                            <div className="grid grid-cols-3 gap-3">
                              {crustOptions.map((crust, index) => (
                                <button
                                  key={index}
                                  className={`p-4 rounded-lg border-2 transition-all duration-200 relative z-[120] pointer-events-auto ${
                                    (selectedCrust[item.id] || 1) === index
                                      ? "border-[#d62828] bg-[#d62828]/10 text-[#d62828]"
                                      : "border-gray-200 hover:border-[#d62828]/50"
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedCrust((prev) => ({ ...prev, [item.id]: index }))
                                  }}
                                >
                                  <div className="font-bold">{crust.name}</div>
                                  {crust.price > 0 && <div className="text-sm text-[#d62828]">+${crust.price}</div>}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Toppings Selection */}
                          <div>
                            <h4 className="text-lg font-bold text-gray-800 mb-4">Extra Toppings</h4>
                            <div className="grid grid-cols-2 gap-3">
                              {toppingsOptions.map((topping, index) => (
                                <button
                                  key={index}
                                  className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center justify-between relative z-[120] pointer-events-auto ${
                                    (selectedToppings[item.id] || []).includes(index)
                                      ? "border-[#d62828] bg-[#d62828]/10 text-[#d62828]"
                                      : "border-gray-200 hover:border-[#d62828]/50"
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleTopping(item.id, index)
                                  }}
                                >
                                  <div>
                                    <div className="font-medium">{topping.name}</div>
                                    <div className="text-sm text-[#d62828]">+${topping.price}</div>
                                  </div>
                                  {(selectedToppings[item.id] || []).includes(index) && (
                                    <Check className="w-5 h-5 text-[#d62828]" />
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Drinks Selection */}
                          <div>
                            <h4 className="text-lg font-bold text-gray-800 mb-4">Add a Drink</h4>
                            <div className="grid grid-cols-2 gap-3">
                              {drinkOptions.map((drink, index) => (
                                <button
                                  key={index}
                                  className={`p-3 rounded-lg border-2 transition-all duration-200 relative z-[120] pointer-events-auto ${
                                    (selectedDrink[item.id] || 0) === index
                                      ? "border-[#d62828] bg-[#d62828]/10 text-[#d62828]"
                                      : "border-gray-200 hover:border-[#d62828]/50"
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedDrink((prev) => ({ ...prev, [item.id]: index }))
                                  }}
                                >
                                  <div className="font-medium">{drink.name}</div>
                                  {drink.price > 0 && <div className="text-sm text-[#d62828]">+${drink.price}</div>}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span
                          className={`font-black text-[#d62828] ${expandedCard === item.id ? "text-3xl" : "text-2xl"}`}
                        >
                          ${expandedCard === item.id ? calculatePrice(item.price, item.id).toFixed(2) : item.price}
                        </span>

                        <div className="flex items-center space-x-2">
                          {expandedCard === item.id && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-10 h-10 p-0 border-[#d62828] text-[#d62828] hover:bg-[#d62828] hover:text-white bg-transparent transition-all duration-200"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  updateQuantity(item.id, -1)
                                }}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-10 text-center font-bold text-lg">{quantities[item.id] || 1}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-10 h-10 p-0 border-[#d62828] text-[#d62828] hover:bg-[#d62828] hover:text-white bg-transparent transition-all duration-200"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  updateQuantity(item.id, 1)
                                }}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </>
                          )}

                          {expandedCard !== item.id ? (
                            <Button
                              className="bg-[#ffbe0b] hover:bg-[#e6a800] text-black font-bold transition-all duration-200 hover:scale-105 active:scale-95"
                              onClick={(e) => {
                                e.stopPropagation()
                                setExpandedCard(item.id)
                              }}
                            >
                              CUSTOMIZE
                            </Button>
                          ) : (
                            <Button
                              className="bg-[#ffbe0b] hover:bg-[#e6a800] text-black font-bold text-lg px-8 py-3 transition-all duration-200 hover:scale-105 active:scale-95"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleAddToCart(item)
                              }}
                            >
                              ADD TO CART - $
                              {(calculatePrice(item.price, item.id) * (quantities[item.id] || 1)).toFixed(2)}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-[#d62828] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-black mb-4">READY TO ORDER?</h2>
          <p className="text-xl mb-8">Get your favorite pizza delivered hot and fresh to your door</p>
          <Button className="bg-[#ffbe0b] hover:bg-[#e6a800] text-black font-bold text-lg px-8 py-3">
            START YOUR ORDER
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  )
}
