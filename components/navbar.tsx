"use client"

import { Search, ShoppingCart, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const { itemCount } = useCart()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
    if (!isSearchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/menu?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setIsSearchOpen(false)
    }
  }

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e)
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false)
      setSearchQuery("")
    }
  }

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSearchOpen && !(event.target as Element).closest('.search-container')) {
        setIsSearchOpen(false)
        setSearchQuery("")
      }
    }

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSearchOpen])

  return (
    <nav className="bg-[#d62828] px-4 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-[#d62828] rounded-full"></div>
          </div>
          <span className="text-white text-xl font-bold">FOODKING</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-white hover:text-yellow-400 transition-colors">
            HOME
          </Link>
          <Link href="/menu" className="text-white hover:text-yellow-400 transition-colors">
            MENU
          </Link>
          <Link href="/contact" className="text-white hover:text-yellow-400 transition-colors">
            CONTACT
          </Link>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative search-container">
            <Search 
              className="w-5 h-5 text-white cursor-pointer hover:text-yellow-400 transition-colors" 
              onClick={toggleSearch}
            />
            
            {/* Search Input */}
            {isSearchOpen && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 p-4">
                <form onSubmit={handleSearch} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-gray-400" />
                    <Input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search for pizzas, drinks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearchKeyPress}
                      className="flex-1 border-0 focus:ring-0 text-gray-800 placeholder-gray-500"
                      autoFocus
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsSearchOpen(false)
                        setSearchQuery("")
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      className="bg-[#d62828] hover:bg-[#b91c1c] text-white"
                    >
                      Search
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>

          <Link href="/cart" className="relative">
            <ShoppingCart className="w-5 h-5 text-white cursor-pointer hover:text-yellow-400 transition-colors" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#ffbe0b] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>

          <Button
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-[#d62828] transition-colors hidden md:flex bg-transparent"
          >
            ORDER NOW
          </Button>
          {/* Animated Burger Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden relative w-6 h-6 flex flex-col justify-center items-center group"
            aria-label="Toggle mobile menu"
          >
            <span
              className={`block w-5 h-0.5 bg-white transition-all duration-300 ease-in-out ${
                isMobileMenuOpen ? "rotate-45 translate-y-1.5" : "-translate-y-1"
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-white transition-all duration-300 ease-in-out ${
                isMobileMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-white transition-all duration-300 ease-in-out ${
                isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : "translate-y-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeMobileMenu}
      />

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-[#d62828] z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-[#d62828] rounded-full"></div>
            </div>
            <span className="text-white text-lg font-bold">FOODKING</span>
          </div>
          <button
            onClick={closeMobileMenu}
            className="w-8 h-8 flex items-center justify-center text-white hover:text-yellow-400 transition-colors"
            aria-label="Close mobile menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Menu Content */}
        <div className="p-4 space-y-6">
          {/* Navigation Links */}
          <div className="space-y-4">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="block text-white text-lg font-medium hover:text-yellow-400 transition-colors py-2"
            >
              HOME
            </Link>
            <Link
              href="/menu"
              onClick={closeMobileMenu}
              className="block text-white text-lg font-medium hover:text-yellow-400 transition-colors py-2"
            >
              MENU
            </Link>
            <Link
              href="/contact"
              onClick={closeMobileMenu}
              className="block text-white text-lg font-medium hover:text-yellow-400 transition-colors py-2"
            >
              CONTACT
            </Link>
          </div>

          {/* Mobile Menu Actions */}
          <div className="pt-6 border-t border-white/20 space-y-4">
            {/* Mobile Search */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Search className="w-5 h-5 text-white" />
                <span className="text-white">Search</span>
              </div>
              <form onSubmit={handleSearch} className="space-y-2">
                <Input
                  type="text"
                  placeholder="Search for pizzas, drinks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/10 border-white/20 text-white placeholder-white/70 focus:bg-white focus:text-gray-800 focus:placeholder-gray-500"
                />
                <Button
                  type="submit"
                  className="w-full bg-[#ffbe0b] hover:bg-[#e6a800] text-black font-bold"
                  onClick={closeMobileMenu}
                >
                  Search Menu
                </Button>
              </form>
            </div>
            
            <Link
              href="/cart"
              onClick={closeMobileMenu}
              className="flex items-center space-x-3 relative"
            >
              <ShoppingCart className="w-5 h-5 text-white" />
              <span className="text-white">Cart</span>
              {itemCount > 0 && (
                <span className="bg-[#ffbe0b] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>

            <Button
              onClick={closeMobileMenu}
              className="w-full bg-[#ffbe0b] hover:bg-[#e6a800] text-black font-bold py-3 text-lg rounded-lg transition-all duration-300"
            >
              ORDER NOW
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
