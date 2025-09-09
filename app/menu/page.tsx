"use client"

import { Navbar } from "@/components/navbar"
import { MenuGrid } from "@/components/menu-grid"

export default function MenuPage() {
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

        <MenuGrid />
      </div>
    </div>
  )
}
