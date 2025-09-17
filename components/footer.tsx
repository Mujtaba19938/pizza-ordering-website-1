"use client"

import Link from "next/link"
import { Facebook, Twitter, Youtube, Instagram } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-[#d62828] rounded-full"></div>
              </div>
              <span className="text-xl font-bold">FOODKING</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Delicious pizzas made with fresh ingredients and authentic recipes. 
              Order online for fast delivery or visit our restaurant for a great dining experience.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              <Youtube className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-white transition-colors">
                  Our Menu
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/deals" className="hover:text-white transition-colors">
                  Deals & Specials
                </Link>
              </li>
            </ul>
          </div>

          {/* Our Menu */}
          <div>
            <h3 className="text-lg font-bold mb-4">Our Menu</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/menu?category=signature" className="hover:text-white transition-colors">
                  Signature Pizzas
                </Link>
              </li>
              <li>
                <Link href="/menu?category=specialty" className="hover:text-white transition-colors">
                  Specialty Pizzas
                </Link>
              </li>
              <li>
                <Link href="/menu?category=gourmet" className="hover:text-white transition-colors">
                  Gourmet Collection
                </Link>
              </li>
              <li>
                <Link href="/menu?category=meat" className="hover:text-white transition-colors">
                  Meat Lovers
                </Link>
              </li>
              <li>
                <Link href="/menu?category=veggie" className="hover:text-white transition-colors">
                  Veggie Options
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>123 Pizza Street</p>
              <p>Food District, NY 10001</p>
              <p className="text-[#ffbe0b]">support@foodking.com</p>
              <p>+1-234-567-8900</p>
              <div className="mt-4">
                <p>
                  <span className="text-white">Monday - Thursday:</span> 11am - 11pm
                </p>
                <p>
                  <span className="text-white">Friday - Saturday:</span> 11am - 12am
                </p>
                <p>
                  <span className="text-white">Sunday:</span> 12pm - 10pm
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-[#d62828] rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
          <p className="text-sm text-gray-400">© Copyright 2024, FoodKing. All Rights Reserved.</p>
          <div className="flex space-x-4 text-sm text-gray-400 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/refund" className="hover:text-white transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
