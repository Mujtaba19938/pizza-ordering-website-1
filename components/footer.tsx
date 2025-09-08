import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Clock } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white relative overflow-hidden">
      {/* Background grain overlay */}
      <div className="hero-grain opacity-20" />
      
      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <Link href="/" className="text-3xl font-extrabold text-[#ffbe0b] mb-4 block">
                FoodKing
              </Link>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Delivering the finest pizzas made with fresh ingredients and authentic recipes. 
                Your satisfaction is our priority.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-[#d62828] rounded-full flex items-center justify-center hover:bg-[#ffbe0b] hover:text-black transition-all duration-300">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-[#d62828] rounded-full flex items-center justify-center hover:bg-[#ffbe0b] hover:text-black transition-all duration-300">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-[#d62828] rounded-full flex items-center justify-center hover:bg-[#ffbe0b] hover:text-black transition-all duration-300">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-[#ffbe0b]">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="text-gray-300 hover:text-[#ffbe0b] transition-colors duration-300">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/menu" className="text-gray-300 hover:text-[#ffbe0b] transition-colors duration-300">
                    Menu
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-300 hover:text-[#ffbe0b] transition-colors duration-300">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-300 hover:text-[#ffbe0b] transition-colors duration-300">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/order-tracking" className="text-gray-300 hover:text-[#ffbe0b] transition-colors duration-300">
                    Track Order
                  </Link>
                </li>
              </ul>
            </div>

            {/* Menu Categories */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-[#ffbe0b]">Our Menu</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/menu?category=classic" className="text-gray-300 hover:text-[#ffbe0b] transition-colors duration-300">
                    Classic Pizzas
                  </Link>
                </li>
                <li>
                  <Link href="/menu?category=meat" className="text-gray-300 hover:text-[#ffbe0b] transition-colors duration-300">
                    Meat Lovers
                  </Link>
                </li>
                <li>
                  <Link href="/menu?category=vegetarian" className="text-gray-300 hover:text-[#ffbe0b] transition-colors duration-300">
                    Vegetarian
                  </Link>
                </li>
                <li>
                  <Link href="/menu?category=specialty" className="text-gray-300 hover:text-[#ffbe0b] transition-colors duration-300">
                    Specialty
                  </Link>
                </li>
                <li>
                  <Link href="/menu?category=deals" className="text-gray-300 hover:text-[#ffbe0b] transition-colors duration-300">
                    Deals & Offers
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-[#ffbe0b]">Contact Info</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-[#ffbe0b] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300 text-sm">
                      123 Pizza Street<br />
                      Food City, FC 12345
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-[#ffbe0b] flex-shrink-0" />
                  <a href="tel:+1234567890" className="text-gray-300 hover:text-[#ffbe0b] transition-colors duration-300">
                    (123) 456-7890
                  </a>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-[#ffbe0b] flex-shrink-0" />
                  <a href="mailto:info@foodking.com" className="text-gray-300 hover:text-[#ffbe0b] transition-colors duration-300">
                    info@foodking.com
                  </a>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-[#ffbe0b] mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300 text-sm">
                      Mon-Sun: 11:00 AM - 11:00 PM<br />
                      Delivery: 11:00 AM - 10:30 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="text-gray-400 text-sm text-center sm:text-left">
                © 2024 FoodKing. All rights reserved. Made with ❤️ for pizza lovers.
              </div>
              <div className="flex space-x-6 text-sm">
                <Link href="/privacy" className="text-gray-400 hover:text-[#ffbe0b] transition-colors duration-300">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-gray-400 hover:text-[#ffbe0b] transition-colors duration-300">
                  Terms of Service
                </Link>
                <Link href="/refund" className="text-gray-400 hover:text-[#ffbe0b] transition-colors duration-300">
                  Refund Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
