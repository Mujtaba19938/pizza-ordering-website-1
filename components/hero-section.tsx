"use client"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { BackgroundIcons } from "@/components/background-icons"
import { useMemo, useState, useEffect } from "react"

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
    <section className={`bg-[#d62828] hero-texture text-white ${showBanner ? 'pt-20 sm:pt-24' : 'pt-16 sm:pt-20'} pb-16 sm:pb-20 px-4 sm:px-6 relative overflow-hidden min-h-[540px] md:min-h-[680px] flex items-center`}>
      {/* Banner Animation Layer - Only show on Tuesday and Thursday */}
      {showBanner && (
        <div className="banner-animation absolute top-0 left-0 w-full h-12 bg-[#ffbe0b] text-black z-20 overflow-hidden">
          <div className="banner-scroll-container">
            <div className="banner-text-track">
              {/* Multiple repetitions for seamless infinite scroll */}
              {Array.from({ length: 8 }, (_, i) => (
                <span key={i} className="banner-text-item">
                  <span className="bg-black text-white px-3 py-1 rounded-full font-bold">Tuesday & Thursday</span>
                  <span>Deal : Buy one large pizza and get one large pizza free</span>
                  <span className="banner-exclamation">!</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Pizza Animation Layer - GPU Optimized & Isolated */}
      <div className="pizza-animation-layer">
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
      
      {/* Background Effects Layer */}
      <div className="hero-grain hero-grain-strong" />
      <BackgroundIcons />
      
      {/* Main Content Layer - Static */}
      <div className="max-w-7xl mx-auto w-full relative z-20">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="relative">
            <div className="space-y-5 sm:space-y-6">
              <h1 className={`font-extrabold uppercase tracking-[-0.02em] leading-[0.9] text-white text-[36px] sm:text-[54px] md:text-[84px] lg:text-[108px] transition-all ${isFading ? 'fade-out-200' : 'fade-in-200'}`}>
                <span className="block">{slides[currentIndex].lines[0]}</span>
                <span className="block">{slides[currentIndex].lines[1]}</span>
                <span className="block">{slides[currentIndex].lines[2]}</span>
              </h1>
              <p className={`text-white/85 text-base sm:text-lg md:text-xl font-semibold ${isFading ? 'fade-out-200' : 'fade-in-200'}`}>{slides[currentIndex].sub}</p>
              <div className="pt-2">
                <Button
                  size="lg"
                  className="bg-[#ffbe0b] text-black hover:bg-[#e6a800] text-sm sm:text-base md:text-lg px-5 sm:px-6 md:px-8 py-5 sm:py-6 rounded-lg font-bold shadow-lg"
                >
                  Order Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Carousel indicator */}
            <div className="mt-6 flex md:mt-10 items-center gap-4 md:gap-6 text-white/90 select-none">
              <button
                onClick={handleNext}
                className="text-xl font-semibold hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded px-1 cursor-pointer"
                aria-label="Show next pizza"
              >
                {currentIndex + 1}
              </button>
              <div className="relative h-[3px] w-24 md:w-28 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-white transition-all duration-500"
                  style={{ width: `${((currentIndex + 1) / slides.length) * 100}%` }}
                />
              </div>
              <span className="text-xl font-semibold">/ {slides.length}</span>
            </div>
          </div>

          {/* Right Side - Spacer for Pizza Animation */}
          <div className="hidden lg:block">
            {/* This div provides space for the pizza animation without interfering */}
          </div>
        </div>
      </div>
    </section>
  )
}
