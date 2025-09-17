"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"

const carouselData = [
  {
    id: 1,
    title: "SUPREME\nDELICIOUS\nPIZZA",
    price: "$25.00",
    image: "/images/carousel-pizza-1.png",
    alt: "Supreme Pizza with Premium Toppings",
  },
  {
    id: 2,
    title: "FRESH\nMARGHERITA\nPIZZA",
    price: "$22.00",
    image: "/images/carousel-pizza-2.png",
    alt: "Fresh Margherita Pizza with Basil",
  },
  {
    id: 3,
    title: "CLASSIC\nPEPPERONI\nPIZZA",
    price: "$24.00",
    image: "/images/carousel-pizza-3.png",
    alt: "Classic Pepperoni Pizza",
  },
]

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const router = useRouter()
  const currentSlide = carouselData[activeSlide]

  const handleSlideChange = (index: number) => {
    if (index === activeSlide || isTransitioning) return

    setIsTransitioning(true)
    setTimeout(() => {
      setActiveSlide(index)
      setTimeout(() => setIsTransitioning(false), 100)
    }, 350)
  }

  const handleImageError = () => {
    console.log("[v0] Pizza image failed to load:", currentSlide.image)
  }

  const handleImageLoad = () => {
    console.log("[v0] Pizza image loaded successfully:", currentSlide.image)
  }

  return (
    <section className="bg-[#d62828] relative overflow-hidden min-h-[600px] flex items-center">
      {/* Decorative Food Icons */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-16 h-16">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-full h-full text-white"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
        <div className="absolute top-40 left-32 w-8 h-8">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-full h-full text-white"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" />
          </svg>
        </div>
        <div className="absolute bottom-32 left-20 w-12 h-12">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-full h-full text-white"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
        <div className="absolute top-32 right-20 w-10 h-10">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-full h-full text-white"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
          </svg>
        </div>
        <div className="absolute bottom-40 right-32 w-14 h-14">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-full h-full text-white"
          >
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3 4-3 9-3 9 1.34 9 3z" />
            <path d="M3 5v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" />
          </svg>
        </div>
        <div className="absolute top-60 right-10 w-6 h-6 border-2 border-white rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Content */}
        <div className="text-white space-y-6 md:order-1 order-2">
          <div
            className={`transition-all duration-700 ease-in-out transform ${
              isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            }`}
          >
            <h1 className="text-5xl md:text-7xl font-black uppercase leading-tight text-balance whitespace-pre-line">
              {currentSlide.title}
            </h1>
          </div>
          <div
            className={`transition-all duration-700 ease-in-out transform delay-100 ${
              isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            }`}
          >
            <p className="text-lg md:text-xl font-medium">Start your order just only {currentSlide.price}</p>
          </div>
          <div
            className={`transition-all duration-700 ease-in-out transform delay-200 ${
              isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            }`}
          >
            <Button 
              className="bg-[#ffbe0b] hover:bg-[#e6a800] text-black font-bold px-8 py-6 text-lg rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
              onClick={() => router.push('/menu')}
            >
              ORDER NOW →
            </Button>
          </div>

          <div className="flex items-center space-x-4 pt-8">
            <div className="flex space-x-3">
              {carouselData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleSlideChange(index)}
                  className={`text-2xl font-bold transition-all duration-500 ease-out transform hover:scale-125 ${
                    activeSlide === index
                      ? "text-white scale-125 underline decoration-2 underline-offset-4 drop-shadow-lg"
                      : "text-white/60 hover:text-white/80 hover:drop-shadow-md"
                  }`}
                  disabled={isTransitioning}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="w-16 h-0.5 bg-white transition-all duration-300"></div>
            <span className="text-lg opacity-70">/ {carouselData.length}</span>
          </div>
        </div>

        {/* Right Content - Pizza Image */}
        <div className="flex justify-center md:order-2 order-1">
          <div className="relative w-96 h-96 md:w-[500px] md:h-[500px]">
            <div
              className={`relative w-full h-full transition-all duration-700 ease-in-out transform ${
                isTransitioning ? "opacity-0 scale-95 rotate-3" : "opacity-100 scale-100 rotate-0"
              }`}
            >
              <Image
                src={currentSlide.image}
                alt={currentSlide.alt}
                fill
                className="object-contain transition-all duration-700 ease-in-out hover:scale-105"
                priority={activeSlide === 0}
                onError={handleImageError}
                onLoad={handleImageLoad}
                unoptimized
                sizes="(max-width: 768px) 384px, 500px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
