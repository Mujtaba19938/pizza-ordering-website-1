"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle, XCircle, Clock, CreditCard, Phone, Mail } from "lucide-react"
import Link from "next/link"

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-[#d62828] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-4">REFUND POLICY</h1>
          <p className="text-xl md:text-2xl mb-8">Your satisfaction is our priority</p>
          <div className="flex justify-center items-center space-x-4">
            <div className="w-16 h-1 bg-[#ffbe0b]"></div>
            <span className="text-[#ffbe0b] font-bold">FAIR • FAST • FRIENDLY</span>
            <div className="w-16 h-1 bg-[#ffbe0b]"></div>
          </div>
        </div>
      </section>

      {/* Refund Policy Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <p className="text-gray-600 mb-4">
                <strong>Last updated:</strong> December 2024
              </p>
              <p className="text-gray-600">
                At FoodKing, we want you to be completely satisfied with your order. If you're not happy with your food, we'll make it right.
              </p>
            </div>

            <div className="space-y-8">
              {/* Quick Overview */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-bold text-green-800">
                    <CheckCircle className="w-6 h-6 mr-3" />
                    Quick Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">24 Hours</div>
                      <div className="text-sm text-green-700">To request a refund</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">5-7 Days</div>
                      <div className="text-sm text-green-700">Processing time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
                      <div className="text-sm text-green-700">Satisfaction guarantee</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* When Refunds Are Available */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-bold text-gray-800">
                    <CheckCircle className="w-6 h-6 mr-3 text-green-600" />
                    When Refunds Are Available
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-800">Quality Issues</h3>
                        <p className="text-gray-600 text-sm">Food is cold, undercooked, or doesn't meet our quality standards</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-800">Wrong Order</h3>
                        <p className="text-gray-600 text-sm">You received items different from what you ordered</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-800">Significant Delay</h3>
                        <p className="text-gray-600 text-sm">Order is delivered more than 30 minutes past estimated time</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-800">Order Cancellation</h3>
                        <p className="text-gray-600 text-sm">Order cancelled before preparation begins (within 5 minutes)</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-800">Allergy Concerns</h3>
                        <p className="text-gray-600 text-sm">Food contains allergens not listed in the description</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* When Refunds Are Not Available */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-bold text-gray-800">
                    <XCircle className="w-6 h-6 mr-3 text-red-600" />
                    When Refunds Are Not Available
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-800">Change of Mind</h3>
                        <p className="text-gray-600 text-sm">You simply don't like the taste after trying the food</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-800">Late Request</h3>
                        <p className="text-gray-600 text-sm">Refund requested more than 24 hours after delivery</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-800">Partial Consumption</h3>
                        <p className="text-gray-600 text-sm">More than 50% of the food has been consumed</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-800">Delivery Issues</h3>
                        <p className="text-gray-600 text-sm">No one available to receive the order at the specified address</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Refund Process */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-bold text-gray-800">
                    <Clock className="w-6 h-6 mr-3 text-[#d62828]" />
                    How to Request a Refund
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-[#d62828] text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Contact Us Immediately</h3>
                        <p className="text-gray-600 text-sm">Call us at +1-234-567-8900 or email support@foodking.com within 24 hours</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-[#d62828] text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Provide Order Details</h3>
                        <p className="text-gray-600 text-sm">Give us your order number, delivery address, and reason for refund</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-[#d62828] text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                      <div>
                        <h3 className="font-semibold text-gray-800">We'll Review Your Request</h3>
                        <p className="text-gray-600 text-sm">Our team will review your request and respond within 2 hours</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-[#d62828] text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                      <div>
                        <h3 className="font-semibold text-gray-800">Refund Processing</h3>
                        <p className="text-gray-600 text-sm">If approved, refund will be processed within 5-7 business days</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Refund Methods */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-bold text-gray-800">
                    <CreditCard className="w-6 h-6 mr-3 text-[#d62828]" />
                    Refund Methods
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Original Payment Method</h3>
                      <p className="text-gray-600 text-sm mb-2">Refunds will be processed to the same payment method used for the original order:</p>
                      <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                        <li>Credit/Debit Cards: 5-7 business days</li>
                        <li>PayPal: 3-5 business days</li>
                        <li>Apple Pay/Google Pay: 5-7 business days</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Store Credit</h3>
                      <p className="text-gray-600 text-sm mb-2">In some cases, we may offer store credit instead of a refund:</p>
                      <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                        <li>Valid for 6 months from issue date</li>
                        <li>Can be used for any future orders</li>
                        <li>Non-transferable and non-refundable</li>
                        <li>Applied automatically at checkout</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Special Circumstances */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-800">Special Circumstances</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Allergy-Related Issues</h3>
                    <p className="text-gray-600 text-sm">
                      If you experience an allergic reaction due to undisclosed allergens, contact us immediately. 
                      We take food allergies very seriously and will provide a full refund plus cover any medical expenses.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Repeated Issues</h3>
                    <p className="text-gray-600 text-sm">
                      If you experience quality issues with multiple orders, we may offer additional compensation 
                      such as free meals or store credit to make up for the inconvenience.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Force Majeure</h3>
                    <p className="text-gray-600 text-sm">
                      In cases of extreme weather, natural disasters, or other circumstances beyond our control 
                      that affect delivery, we will work with you to find a satisfactory solution.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl font-bold text-gray-800">
                    <Phone className="w-6 h-6 mr-3 text-[#d62828]" />
                    Need Help?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    If you have any questions about our refund policy or need to request a refund, please contact us:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-[#d62828]" />
                        <span className="text-gray-600">+1-234-567-8900</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-[#d62828]" />
                        <span className="text-gray-600">support@foodking.com</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <strong>Hours:</strong> 24/7 for urgent issues
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Response Time:</strong> Within 2 hours
                      </p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link href="/contact">
                      <Button className="bg-[#d62828] hover:bg-[#b91c1c] text-white">
                        Contact Support
                      </Button>
                    </Link>
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
