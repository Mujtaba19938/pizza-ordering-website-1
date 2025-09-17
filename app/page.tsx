import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import ProductsSection from "@/components/products-section"
import PromoCards from "@/components/promo-cards"
import FeaturesSection from "@/components/features-section"
import Footer from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ProductsSection />
      <PromoCards />
      <FeaturesSection />
      <Footer />
    </main>
  )
}
