"use client"

import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { useEffect, useState } from "react"

export function Navbar() {
  const { state } = useCart()
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0)
  const [open, setOpen] = useState(false)

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [open])

  return (
    <nav className="bg-[#d62828] text-white px-4 sm:px-6 py-4 shadow-lg relative overflow-hidden">
      <div className="hero-grain" />

      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Brand + Mobile Menu Button */}
        <div className="flex items-center gap-3">
          <button
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className="md:hidden relative h-10 w-10 rounded-lg hover:bg-white/10 transition-colors z-50"
          >
            <span
              className={`absolute left-1/2 top-1/2 block h-[2px] w-5 -translate-x-1/2 -translate-y-2 bg-white transition-transform ${
                open ? 'translate-y-0 rotate-45' : ''
              }`}
            />
            <span
              className={`absolute left-1/2 top-1/2 block h-[2px] w-5 -translate-x-1/2 bg-white transition-opacity ${
                open ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`absolute left-1/2 top-1/2 block h-[2px] w-5 -translate-x-1/2 translate-y-2 bg-white transition-transform ${
                open ? '-translate-y-0 -rotate-45' : ''
              }`}
            />
          </button>

          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image
              src="/pizza-logo.svg"
              alt="FoodKing Pizza Logo"
              width={40}
              height={40}
              className="w-10 h-10 object-contain"
            />
            <span className="text-2xl font-extrabold tracking-tight text-white">
              FoodKing
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="hover:text-[#ffbe0b] transition-colors font-medium">
            Home
          </Link>
          <Link href="/menu" className="hover:text-[#ffbe0b] transition-colors font-medium">
            Shop
          </Link>
          <Link href="/contact" className="hover:text-[#ffbe0b] transition-colors font-medium">
            Contact
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Button variant="ghost" size="icon" className="text-white hover:text-[#ffbe0b] hover:bg-white/10">
            <Search className="h-5 w-5" />
          </Button>
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="text-white hover:text-[#ffbe0b] hover:bg-white/10 relative">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-[#ffbe0b] text-black text-xs min-w-[20px] h-5 flex items-center justify-center">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>
          <Button
            variant="outline"
            className="hidden sm:inline-flex border-2 border-white text-white hover:bg-[#ffbe0b] hover:text-black hover:border-[#ffbe0b] bg-transparent font-semibold transition-all"
          >
            Order Now
          </Button>
        </div>
      </div>

      {/* Mobile Drawer (Left → Right) */}
      {/* Backdrop */}
      <button
        aria-label="Close menu"
        onClick={() => setOpen(false)}
        className={`md:hidden fixed inset-0 bg-black/40 transition-opacity z-40 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Panel */}
      <div
        className={`md:hidden fixed left-0 top-0 h-full w-[82%] max-w-sm bg-[#d62828]/98 backdrop-blur-md border-r border-white/10 transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } z-50`}
      >
        <div className="hero-grain" />
        <div className="px-5 py-5 space-y-2">
          <Link onClick={() => setOpen(false)} href="/" className="block rounded-lg px-3 py-3 hover:bg-white/10">Home</Link>
          <Link onClick={() => setOpen(false)} href="/menu" className="block rounded-lg px-3 py-3 hover:bg-white/10">Shop</Link>
          <Link onClick={() => setOpen(false)} href="/contact" className="block rounded-lg px-3 py-3 hover:bg-white/10">Contact</Link>
          <Button
            onClick={() => setOpen(false)}
            className="w-full mt-2 bg-[#ffbe0b] hover:bg-[#e6a800] text-black font-semibold"
          >
            Order Now
          </Button>
        </div>
      </div>
    </nav>
  )
}
