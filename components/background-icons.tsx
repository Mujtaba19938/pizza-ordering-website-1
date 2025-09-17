import React from 'react'

// Simple vegetable icon SVGs (outlined for better legibility with low blur)
const TomatoIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" vectorEffect="non-scaling-stroke">
    <circle cx="12" cy="12" r="7.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.5 6.5c1 .3 2 .5 2.5.5s1.5-.2 2.5-.5M12 7l-1.5-2-1.5 1.5M12 7l1.5-2 1.5 1.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const CarrotIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" vectorEffect="non-scaling-stroke">
    <path d="M6 5l3 1-1 1 1 1-1 1-1-1-1 1 1 1-1 1C4.5 9 4.5 7.5 6 5z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 8l8 8c.8.8.8 2.2 0 3s-2.2.8-3 0L7 11l3-3z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const PepperIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" vectorEffect="non-scaling-stroke">
    <path d="M13 3c-1 0-2 .8-2 1.8V7c-2 .2-4 1.9-4 4.5 0 2.4 1.6 6.5 5 6.5s5-4.1 5-6.5c0-2.6-2-4.3-4-4.5V4.8C13 3.8 12 3 11 3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const OnionIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" vectorEffect="non-scaling-stroke">
    <path d="M12 4c-1 2-5 4-5 9a5 5 0 0010 0c0-5-4-7-5-9z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 7c-1.5 1-3 2.5-3 6a3 3 0 006 0c0-3.5-1.5-5-3-6z" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
  </svg>
)

const MushroomIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full" vectorEffect="non-scaling-stroke">
    <path d="M5 10c0-3.5 3.5-6 7-6s7 2.5 7 6H5z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 10v4a2 2 0 004 0v-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

interface BackgroundIconsProps {
  className?: string
}

export function BackgroundIcons({ className = "" }: BackgroundIconsProps) {
  return (
    <div className={`absolute inset-0 z-0 pointer-events-none ${className}`}>
      {/* Tomato - Top Left */}
      <div className="hero-doodle absolute top-16 left-8 w-16 h-16 md:w-20 md:h-20 text-[#ffbe0b] opacity-[0.34] md:opacity-[0.38] blur-[1px] animate-float-slow">
        <TomatoIcon />
      </div>

      {/* Carrot - Top Right */}
      <div className="hero-doodle absolute top-20 right-12 w-14 h-14 md:w-[72px] md:h-[72px] text-[#ffbe0b] opacity-[0.34] md:opacity-[0.38] blur-[1px] animate-float-slow-delay-1">
        <CarrotIcon />
      </div>

      {/* Pepper - Mid Right */}
      <div className="hero-doodle absolute top-1/2 right-8 w-12 h-12 md:w-16 md:h-16 text-[#ffbe0b] opacity-[0.34] md:opacity-[0.38] blur-[1px] animate-float-slow-delay-2">
        <PepperIcon />
      </div>

      {/* Onion - Bottom Left */}
      <div className="hero-doodle absolute bottom-20 left-12 w-14 h-14 md:w-[72px] md:h-[72px] text-[#ffbe0b] opacity-[0.34] md:opacity-[0.38] blur-[1px] animate-float-slow-delay-3">
        <OnionIcon />
      </div>

      {/* Mushroom - Center */}
      <div className="hero-doodle absolute top-1/3 left-1/4 w-12 h-12 md:w-14 md:h-14 text-[#ffbe0b] opacity-[0.34] md:opacity-[0.38] blur-[1px] animate-float-slow-delay-4">
        <MushroomIcon />
      </div>
    </div>
  )
}
