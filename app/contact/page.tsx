"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, ChevronDown, ChevronUp } from "lucide-react"

// Utility function for production-safe logging
const log = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    if (data) {
      console.log(message, data)
    } else {
      console.log(message)
    }
  }
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [newsletterEmail, setNewsletterEmail] = useState("")
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})
  const [isFormValid, setIsFormValid] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Form validation function
  const validateForm = () => {
    const errors: { [key: string]: string } = {}
    
    // Required fields validation
    if (!formData.name.trim()) {
      errors.name = "Name is required"
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address"
    }
    
    if (!formData.subject) {
      errors.subject = "Please select a subject"
    }
    
    if (!formData.message.trim()) {
      errors.message = "Message is required"
    } else if (formData.message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters long"
    }
    
    // Optional phone validation
    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      errors.phone = "Please enter a valid phone number"
    }
    
    return errors
  }

  // Check form validity whenever form data changes
  React.useEffect(() => {
    const errors = validateForm()
    setIsFormValid(Object.keys(errors).length === 0)
  }, [formData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form before submission
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }
    
    setFormErrors({})
    setIsSubmitting(true)

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setIsSubmitting(false)
      setSubmitStatus("success")
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" })

      setTimeout(() => setSubmitStatus("idle"), 5000)
    } catch (error) {
      log('Contact form submission error:', error)
      setIsSubmitting(false)
      setSubmitStatus("error")
      setTimeout(() => setSubmitStatus("idle"), 5000)
    }
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setNewsletterEmail("")
    // Add newsletter subscription logic here
  }

  const faqs = [
    {
      question: "What are your delivery times?",
      answer:
        "We deliver within 30-45 minutes during peak hours and 20-30 minutes during off-peak hours. Delivery times may vary based on location and weather conditions.",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order is confirmed, you'll receive a tracking link via SMS and email. You can also call our restaurant directly for real-time updates on your order status.",
    },
    {
      question: "What's your refund policy?",
      answer:
        "We offer full refunds for orders that are significantly delayed, incorrect, or don't meet our quality standards. Contact us within 24 hours of delivery for refund requests.",
    },
    {
      question: "Do you offer catering services?",
      answer:
        "Yes! We provide catering services for events of 10+ people. Contact us at least 48 hours in advance to discuss menu options and pricing for your special event.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div
        className="relative h-96 bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(214, 40, 40, 0.8), rgba(214, 40, 40, 0.8)), url('/pizza-restaurant-interior-with-friendly-staff.jpg')`,
        }}
      >
        <div className="text-center text-white max-w-4xl px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance">Get in Touch with Us</h1>
          <p className="text-xl md:text-2xl text-balance">
            We'd love to hear from you – whether it's about an order, feedback, or franchise inquiry.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Contact Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="hover:scale-105 transition-transform duration-300 hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-[#d62828] rounded-full flex items-center justify-center mx-auto mb-2">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-[#d62828]">Our Location</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                123 Pizza Street
                <br />
                Food District, NY 10001
              </p>
              <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Google Maps Embed</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:scale-105 transition-transform duration-300 hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-[#d62828] rounded-full flex items-center justify-center mx-auto mb-2">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-[#d62828]">Call Us</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <a
                href="tel:+1234567890"
                className="text-lg font-semibold text-gray-800 hover:text-[#d62828] transition-colors"
              >
                (123) 456-7890
              </a>
              <p className="text-gray-600 mt-2">
                Available 24/7 for orders
                <br />
                and customer support
              </p>
            </CardContent>
          </Card>

          <Card className="hover:scale-105 transition-transform duration-300 hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-[#d62828] rounded-full flex items-center justify-center mx-auto mb-2">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-[#d62828]">Email Us</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <a
                href="mailto:support@foodking.com"
                className="text-lg font-semibold text-gray-800 hover:text-[#d62828] transition-colors"
              >
                support@foodking.com
              </a>
              <p className="text-gray-600 mt-2">
                We'll respond within
                <br />
                24 hours
              </p>
            </CardContent>
          </Card>

          <Card className="hover:scale-105 transition-transform duration-300 hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-[#d62828] rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-[#d62828]">Working Hours</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-1 text-gray-600">
                <p>
                  <strong>Mon - Thu:</strong> 11AM - 11PM
                </p>
                <p>
                  <strong>Fri - Sat:</strong> 11AM - 12AM
                </p>
                <p>
                  <strong>Sunday:</strong> 12PM - 10PM
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Send us a Message</h2>

            {submitStatus === "success" && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                Thank you for your message! We'll get back to you within 24 hours.
              </div>
            )}

            {submitStatus === "error" && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                Sorry, there was an error sending your message. Please try again.
              </div>
            )}

            {/* Form Validation Status */}
            {Object.keys(formErrors).length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <div>
                    <h3 className="text-red-800 font-semibold">Please fix the following errors:</h3>
                    <ul className="text-red-700 text-sm mt-1">
                      {Object.entries(formErrors).map(([field, error]) => (
                        <li key={field}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className={`w-full focus:ring-2 focus:ring-[#d62828] focus:border-[#d62828] ${formErrors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
                    placeholder="Your full name"
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={`w-full focus:ring-2 focus:ring-[#d62828] focus:border-[#d62828] ${formErrors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
                    placeholder="your.email@example.com"
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full focus:ring-2 focus:ring-[#d62828] focus:border-[#d62828] ${formErrors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
                    placeholder="(123) 456-7890"
                  />
                  {formErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#d62828] ${formErrors.subject ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="feedback">Feedback</option>
                    <option value="order">Order Issue</option>
                    <option value="franchise">Franchise Inquiry</option>
                  </select>
                  {formErrors.subject && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.subject}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className={`w-full focus:ring-2 focus:ring-[#d62828] focus:border-[#d62828] ${formErrors.message ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
                  placeholder="Tell us how we can help you..."
                />
                {formErrors.message && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className="w-full bg-[#d62828] hover:bg-[#b91c1c] text-white py-3 text-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? "Sending..." : !isFormValid ? "Please fill all required fields" : "Send Message"}
              </Button>
            </form>
          </div>

          {/* FAQ Section */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Frequently Asked Questions</h2>

            <div className="space-y-4 mb-12">
              {faqs.map((faq, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  >
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-gray-800">{faq.question}</CardTitle>
                      {expandedFaq === index ? (
                        <ChevronUp className="w-5 h-5 text-[#d62828]" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-[#d62828]" />
                      )}
                    </div>
                  </CardHeader>
                  {expandedFaq === index && (
                    <CardContent className="pt-0">
                      <p className="text-gray-600">{faq.answer}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>

            {/* Newsletter Subscription */}
            <Card className="bg-[#d62828] text-white">
              <CardHeader>
                <CardTitle className="text-2xl">Stay Updated!</CardTitle>
                <p>Subscribe to our newsletter for exclusive deals and new menu items.</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <Input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 bg-white text-gray-800"
                    required
                  />
                  <Button type="submit" className="bg-[#ffbe0b] hover:bg-[#e6a800] text-black font-semibold px-6">
                    Subscribe
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Follow Us</h2>
          <div className="flex justify-center space-x-6">
            {[
              { icon: Facebook, label: "Facebook" },
              { icon: Instagram, label: "Instagram" },
              { icon: Twitter, label: "Twitter" },
            ].map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center hover:bg-[#ffbe0b] hover:scale-110 transition-all duration-300 group"
              >
                <Icon className="w-6 h-6 text-gray-600 group-hover:text-black" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
