"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string
  description?: string
  onClick?: () => void
}

export function ProductCard({ id, name, price, image, description, onClick }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden rounded-2xl border-0 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 py-0">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2">{name}</h3>
          {description && <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2">{description}</p>}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span className="text-xl sm:text-2xl font-bold text-[#d62828]">${price.toFixed(2)}</span>
            {onClick ? (
              <Button 
                onClick={onClick}
                className="bg-[#d62828] hover:bg-[#b91c1c] text-white px-4 sm:px-6 py-2 rounded-full transition-colors duration-200 text-sm sm:text-base w-full sm:w-auto"
              >
                View Details
              </Button>
            ) : (
              <Link href={`/products/${id}`} className="w-full sm:w-auto">
                <Button className="bg-[#d62828] hover:bg-[#b91c1c] text-white px-4 sm:px-6 py-2 rounded-full transition-colors duration-200 text-sm sm:text-base w-full">
                  View Details
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
