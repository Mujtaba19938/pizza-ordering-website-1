"use client"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { BackgroundIcons } from "@/components/background-icons"
import { useMemo, useState, useEffect } from "react"
import Link from "next/link"

export function HeroSection() {
  const slides = useMemo(
    () => [
      {
        image: "/pizza.png",
        lines: ["AWESOME", "DELICIOUS", "PIZZA"],
        sub: "Start your order just only $25.00",
      },
      {
        image: "/pizza%20(1).png",
        lines: ["FRESH", "VEGGIE", "SPECIAL"],
        sub: "Crisp veggies on a cheesy base",
      },
      {
        image: "/pizza-2.png",
        lines: ["SPICY", "CHICKEN", "FEAST"],
        sub: "Bold flavor, tender chunks",
      },
    ],
    []
  )
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFading, setIsFading] = useState(false)
  const [showBanner, setShowBanner] = useState(false)

  // Check if today is Tuesday (2) or Thursday (4)
  useEffect(() => {
    const today = new Date()
    const dayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    setShowBanner(dayOfWeek === 2 || dayOfWeek === 4) // Tuesday or Thursday
  }, [])

  const handleNext = () => {
    setIsFading(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
      setIsFading(false)
    }, 220)
  }

  return (
    <section className={`bg-[#d62828] hero-texture text-white ${showBanner ? 'pt-16 sm:pt-20 md:pt-24' : 'pt-12 sm:pt-16 md:pt-20'} pb-12 sm:pb-16 md:pb-20 px-3 sm:px-4 md:px-6 relative overflow-hidden min-h-[480px] sm:min-h-[540px] md:min-h-[680px] flex items-center`}>
      {/* Banner Animation Layer - Only show on Tuesday and Thursday */}
      {showBanner && (
        <div className="banner-animation absolute top-0 left-0 w-full h-12 bg-[#ffbe0b] text-black z-20 overflow-hidden">
          <div className="banner-content">
            <div className="banner-text">
              <span className="bg-black text-white px-3 py-1 rounded-full font-bold">Tuesday & Thursday</span>
              <span>Deal : Buy one large pizza and get one large pizza free</span>
              <span className="banner-exclamation">!</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Background Effects Layer */}
      <div className="hero-grain hero-grain-strong" />
      <BackgroundIcons />
      
      {/* Main Content Layer - Static */}
      <div className="max-w-7xl mx-auto w-full relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="relative">
            <div className="space-y-5 sm:space-y-6">
              <h1 className={`font-extrabold uppercase tracking-[-0.02em] leading-[0.9] text-white text-[28px] xs:text-[32px] sm:text-[48px] md:text-[72px] lg:text-[96px] xl:text-[108px] transition-all ${isFading ? 'fade-out-200' : 'fade-in-200'}`}>
                <span className="block">{slides[currentIndex].lines[0]}</span>
                <span className="block">{slides[currentIndex].lines[1]}</span>
                <span className="block">{slides[currentIndex].lines[2]}</span>
              </h1>
              <p className={`text-white/85 text-sm sm:text-base md:text-lg lg:text-xl font-semibold ${isFading ? 'fade-out-200' : 'fade-in-200'}`}>{slides[currentIndex].sub}</p>
              <div className="pt-2">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#ffbe0b] text-black hover:bg-[#e6a800] text-sm sm:text-base md:text-lg px-4 sm:px-5 md:px-6 lg:px-8 py-3 sm:py-4 md:py-5 lg:py-6 rounded-lg font-bold shadow-lg w-full sm:w-auto"
                >
                  <Link href="/menu">
                    Order Now <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Carousel indicator */}
            <div className="mt-4 sm:mt-6 md:mt-10 flex items-center gap-3 sm:gap-4 md:gap-6 text-white/90 select-none">
              <button
                onClick={handleNext}
                className="text-lg sm:text-xl font-semibold hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded px-1 cursor-pointer"
                aria-label="Show next pizza"
              >
                {currentIndex + 1}
              </button>
              <div className="relative h-[2px] sm:h-[3px] w-20 sm:w-24 md:w-28 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-white transition-all duration-500"
                  style={{ width: `${((currentIndex + 1) / slides.length) * 100}%` }}
                />
              </div>
              <span className="text-lg sm:text-xl font-semibold">/ {slides.length}</span>
            </div>
          </div>

          {/* Right Side - Pizza Animation */}
          <div className="flex justify-center items-center mt-8 lg:mt-0">
            <div className="pizza-container">
              <div className="pizza-rotator">
                <img
                  key={currentIndex}
                  src={slides[currentIndex].image}
                  alt="Delicious Pizza"
                  className={`pizza-image ${isFading ? 'fade-out-200' : 'fade-in-200'}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
