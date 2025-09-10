import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { CartProvider } from "@/contexts/cart-context"
import { Suspense } from "react"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

export const metadata: Metadata = {
  title: "FoodKing - Pizza Ordering",
  description: "Order delicious pizzas online",
  generator: "v0.app",
  icons: {
    icon: "/930437e4-11b0-42a8-9474-31ec620146ca-removebg-preview.png",
    shortcut: "/930437e4-11b0-42a8-9474-31ec620146ca-removebg-preview.png",
    apple: "/930437e4-11b0-42a8-9474-31ec620146ca-removebg-preview.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <CartProvider>
            {children}
            <Footer />
          </CartProvider>
        </Suspense>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
