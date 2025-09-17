"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Percent, Gift, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const deals = [
  {
    id: 1,
    title: "Family Feast Deal",
    description: "2 Large Pizzas + 2 Sides + 2 Drinks",
    originalPrice: 89.98,
    discountedPrice: 69.99,
    discount: 22,
    image: "/images/carousel-pizza-1.png",
    validUntil: "2024-12-31",
    popular: true,
  },
  {
    id: 2,
    title: "Meat Lovers Special",
    description: "Any Large Meat Lovers Pizza + Free Side",
    originalPrice: 35.99,
    discountedPrice: 29.99,
    discount: 17,
    image: "/images/pepperoni-pizza-new.png",
    validUntil: "2024-12-31",
    popular: false,
  },
  {
    id: 3,
    title: "Student Discount",
    description: "20% off any order with valid student ID",
    originalPrice: 0,
    discountedPrice: 0,
    discount: 20,
    image: "/images/margherita-pizza.png",
    validUntil: "2024-12-31",
    popular: true,
  },
  {
    id: 4,
    title: "Happy Hour",
    description: "50% off all drinks from 3-5 PM",
    originalPrice: 0,
    discountedPrice: 0,
    discount: 50,
    image: "/images/hawaiian-pizza.png",
    validUntil: "2024-12-31",
    popular: false,
  },
  {
    id: 5,
    title: "Weekend Special",
    description: "Buy 2 Get 1 Free on all pizzas",
    originalPrice: 0,
    discountedPrice: 0,
    discount: 33,
    image: "/images/supreme-pizza-new.jpeg",
    validUntil: "2024-12-31",
    popular: true,
  },
  {
    id: 6,
    title: "First Order Bonus",
    description: "Free delivery on your first order",
    originalPrice: 3.99,
    discountedPrice: 0,
    discount: 100,
    image: "/images/pepperoni-deluxe.jpeg",
    validUntil: "2024-12-31",
    popular: false,
  },
]

export default function DealsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-[#d62828] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-4">DEALS & SPECIALS</h1>
          <p className="text-xl md:text-2xl mb-8">Save big on your favorite pizzas with our amazing deals</p>
          <div className="flex justify-center items-center space-x-4">
            <div className="w-16 h-1 bg-[#ffbe0b]"></div>
            <span className="text-[#ffbe0b] font-bold">SAVE • ENJOY • REPEAT</span>
            <div className="w-16 h-1 bg-[#ffbe0b]"></div>
          </div>
        </div>
      </section>

      {/* Deals Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {deals.map((deal) => (
              <Card key={deal.id} className="group transition-all duration-300 hover:shadow-xl hover:scale-105 border-0 overflow-hidden">
                <div className="relative">
                  {deal.popular && (
                    <Badge className="absolute top-4 left-4 z-10 bg-[#d62828] text-white px-3 py-1 rounded-full text-sm font-bold">
                      POPULAR
                    </Badge>
                  )}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={deal.image || "/placeholder.svg"}
                      alt={deal.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-[#ffbe0b] text-black font-bold text-lg px-3 py-1">
                        {deal.discount}% OFF
                      </Badge>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{deal.title}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-[#ffbe0b] text-[#ffbe0b]" />
                      <span className="text-sm font-medium text-gray-600">4.8</span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 leading-relaxed">{deal.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    {deal.originalPrice > 0 ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-black text-[#d62828]">
                          ${deal.discountedPrice.toFixed(2)}
                        </span>
                        <span className="text-lg text-gray-500 line-through">
                          ${deal.originalPrice.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <div className="text-2xl font-black text-[#d62828]">
                        {deal.discount}% OFF
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Valid until {new Date(deal.validUntil).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <Button className="w-full bg-[#ffbe0b] hover:bg-[#e6a800] text-black font-bold transition-all duration-200 hover:scale-105 active:scale-95">
                    <Gift className="w-4 h-4 mr-2" />
                    Claim Deal
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers Banner */}
      <section className="bg-gradient-to-r from-[#d62828] to-[#b91c1c] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-black mb-4">MORE SAVINGS AWAIT!</h2>
          <p className="text-xl mb-8">Sign up for our newsletter and get exclusive deals delivered to your inbox</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#ffbe0b]"
            />
            <Button className="bg-[#ffbe0b] hover:bg-[#e6a800] text-black font-bold px-8 py-3">
              <Zap className="w-4 h-4 mr-2" />
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Terms & Conditions */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Terms & Conditions</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                • All deals are valid for a limited time only and subject to availability
              </p>
              <p>
                • Discounts cannot be combined with other offers unless specified
              </p>
              <p>
                • Student discount requires valid student ID upon delivery
              </p>
              <p>
                • Happy Hour applies to drinks only, Monday-Friday 3-5 PM
              </p>
              <p>
                • Free delivery applies to orders over $25 within our delivery radius
              </p>
              <p>
                • We reserve the right to modify or cancel deals at any time
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
