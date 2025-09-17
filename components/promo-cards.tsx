import { Button } from "@/components/ui/button"
import Image from "next/image"

const promoItems = [
  {
    id: 1,
    title: "DELICIOUS HAMBURGER FRIES",
    startPrice: 25,
    currentPrice: 38,
    image: "/placeholder-j85mm.png",
    bgColor: "bg-gray-900",
  },
  {
    id: 2,
    title: "SUPER CHICKEN FRY",
    startPrice: 25,
    currentPrice: 43,
    image: "/placeholder-9b5te.png",
    bgColor: "bg-gray-800",
  },
  {
    id: 3,
    title: "DELICIOUS HAMBURGER FRIES",
    startPrice: 25,
    currentPrice: 38,
    image: "/images/supreme-pizza.png",
    bgColor: "bg-gray-900",
  },
]

export default function PromoCards() {
  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promoItems.map((item) => (
            <div
              key={item.id}
              className={`${item.bgColor} rounded-lg overflow-hidden relative min-h-[400px] flex flex-col justify-between p-8`}
            >
              {/* Price Badge */}
              <div className="absolute top-6 right-6">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                    item.id === 2 ? "bg-[#d62828]" : "bg-[#ffbe0b] text-black"
                  }`}
                >
                  ${item.currentPrice}
                </div>
              </div>

              {/* Content */}
              <div className="text-white z-10">
                <p className="text-sm font-semibold mb-2 text-[#ffbe0b]">START PRICE ${item.startPrice}</p>
                <h3 className="text-2xl md:text-3xl font-black uppercase leading-tight mb-6">{item.title}</h3>
                <Button
                  className={`${
                    item.id === 2
                      ? "bg-[#ffbe0b] hover:bg-[#e6a800] text-black"
                      : "bg-[#d62828] hover:bg-[#b91c1c] text-white"
                  } font-bold px-6 py-3 rounded-lg transition-all hover:scale-105`}
                >
                  ORDER NOW
                </Button>
              </div>

              {/* Background Image */}
              <div className="absolute inset-0 opacity-60">
                <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
