import { Navbar } from "@/components/navbar"
import { CartContent } from "@/components/cart-content"

export default function CartPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#d62828] mb-2 sm:mb-4">Your Cart</h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground">Review your order before checkout</p>
        </div>
        <CartContent />
      </div>
    </div>
  )
}
