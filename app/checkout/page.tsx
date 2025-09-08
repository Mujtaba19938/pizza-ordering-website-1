import { Navbar } from "@/components/navbar"
import { CheckoutForm } from "@/components/checkout-form"

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[#d62828] mb-4">Checkout</h1>
          <p className="text-xl text-muted-foreground">Complete your order</p>
        </div>
        <CheckoutForm />
      </div>
    </div>
  )
}
