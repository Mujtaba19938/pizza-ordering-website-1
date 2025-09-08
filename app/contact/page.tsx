import { ContactHero } from "@/components/contact-hero"
import { ContactForm } from "@/components/contact-form"
import { Navbar } from "@/components/navbar"

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <ContactHero />
      <ContactForm />
    </div>
  )
}
