"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Scale, AlertTriangle, CreditCard, Truck, Phone } from "lucide-react"

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-[#d62828] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-4">TERMS & CONDITIONS</h1>
          <p className="text-xl md:text-2xl mb-8">Please read these terms carefully before using our service</p>
          <div className="flex justify-center items-center space-x-4">
            <div className="w-16 h-1 bg-[#ffbe0b]"></div>
            <span className="text-[#ffbe0b] font-bold">LEGAL • FAIR • TRANSPARENT</span>
            <div className="w-16 h-1 bg-[#ffbe0b]"></div>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <p className="text-gray-600 mb-4">
                <strong>Last updated:</strong> December 2024
              </p>
              <p className="text-gray-600">
                These Terms and Conditions ("Terms") govern your use of the FoodKing website and services. By using our service, you agree to be bound by these Terms.
              </p>
            </div>

            <div className="space-y-8">
              {/* Acceptance of Terms */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-bold text-gray-800">
                    <FileText className="w-6 h-6 mr-3 text-[#d62828]" />
                    Acceptance of Terms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    By accessing and using the FoodKing website, mobile application, or any of our services, you accept and agree to be bound by the terms and provision of this agreement.
                  </p>
                  <p className="text-gray-600">
                    If you do not agree to abide by the above, please do not use this service.
                  </p>
                </CardContent>
              </Card>

              {/* Use License */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-bold text-gray-800">
                    <Scale className="w-6 h-6 mr-3 text-[#d62828]" />
                    Use License
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Permission is granted to temporarily download one copy of the materials on FoodKing's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Modify or copy the materials</li>
                    <li>Use the materials for any commercial purpose or for any public display</li>
                    <li>Attempt to reverse engineer any software contained on the website</li>
                    <li>Remove any copyright or other proprietary notations from the materials</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Orders and Payment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-bold text-gray-800">
                    <CreditCard className="w-6 h-6 mr-3 text-[#d62828]" />
                    Orders and Payment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Order Placement</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>All orders are subject to acceptance by FoodKing</li>
                      <li>We reserve the right to refuse or cancel any order at our discretion</li>
                      <li>Order prices are subject to change without notice</li>
                      <li>All prices are in USD and include applicable taxes</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Payment Terms</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Payment is required at the time of order placement</li>
                      <li>We accept major credit cards, debit cards, and cash on delivery</li>
                      <li>All payments are processed securely through Stripe</li>
                      <li>Refunds will be processed within 5-7 business days</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Terms */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-bold text-gray-800">
                    <Truck className="w-6 h-6 mr-3 text-[#d62828]" />
                    Delivery Terms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Delivery times are estimates and may vary based on location and order volume</li>
                    <li>We deliver within a 5-mile radius of our restaurant</li>
                    <li>Delivery fee applies to all orders under $25</li>
                    <li>We are not responsible for delays due to weather, traffic, or other circumstances beyond our control</li>
                    <li>Someone must be present to receive the order at the delivery address</li>
                    <li>We reserve the right to refuse delivery to unsafe or inaccessible locations</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Cancellation and Refunds */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-bold text-gray-800">
                    <AlertTriangle className="w-6 h-6 mr-3 text-[#d62828]" />
                    Cancellation and Refunds
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Order Cancellation</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Orders can be cancelled within 5 minutes of placement</li>
                      <li>Once food preparation begins, cancellation may not be possible</li>
                      <li>Contact us immediately if you need to cancel your order</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Refund Policy</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Full refunds for orders cancelled before preparation begins</li>
                      <li>Partial refunds for orders with quality issues (contact us within 24 hours)</li>
                      <li>No refunds for orders delivered successfully without quality issues</li>
                      <li>Refunds will be processed to the original payment method</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Limitation of Liability */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-800">Limitation of Liability</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    In no event shall FoodKing, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.
                  </p>
                  <p className="text-gray-600">
                    Our total liability to you for any damages arising from or related to these Terms or the service shall not exceed the amount you paid us for the service in the 12 months preceding the claim.
                  </p>
                </CardContent>
              </Card>

              {/* Privacy Policy */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-800">Privacy Policy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices.
                  </p>
                  <p className="text-gray-600">
                    By using our service, you consent to the collection and use of information in accordance with our Privacy Policy.
                  </p>
                </CardContent>
              </Card>

              {/* Changes to Terms */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-800">Changes to Terms</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
                  </p>
                  <p className="text-gray-600">
                    Your continued use of the service after any such changes constitutes your acceptance of the new Terms.
                  </p>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-bold text-gray-800">
                    <Phone className="w-6 h-6 mr-3 text-[#d62828]" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    If you have any questions about these Terms and Conditions, please contact us:
                  </p>
                  <div className="space-y-2 text-gray-600">
                    <p><strong>Email:</strong> legal@foodking.com</p>
                    <p><strong>Phone:</strong> +1-234-567-8900</p>
                    <p><strong>Address:</strong> 123 Pizza Street, Food District, NY 10001</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
