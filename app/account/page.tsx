"use client"

import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"
import { Phone, Mail, User, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function AccountPage() {
  const [step, setStep] = useState<'details' | 'otp' | 'success'>('details')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { login } = useAuth()
  const router = useRouter()

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const phoneNumber = value.replace(/\D/g, '')
    
    // Format as (XXX) XXX-XXXX
    if (phoneNumber.length >= 6) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`
    } else if (phoneNumber.length >= 3) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`
    } else if (phoneNumber.length > 0) {
      return `(${phoneNumber}`
    }
    return phoneNumber
  }

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userDetails.name || !userDetails.email || !userDetails.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        className: "border-red-200 bg-red-50 text-red-800",
      })
      return
    }

    if (userDetails.phone.replace(/\D/g, '').length !== 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number.",
        className: "border-red-200 bg-red-50 text-red-800",
      })
      return
    }

    setIsLoading(true)
    
    // Simulate SMS sending
    setTimeout(() => {
      setOtpSent(true)
      setCountdown(60) // 60 seconds countdown
      setStep('otp')
      setIsLoading(false)
      
      toast({
        title: "OTP Sent!",
        description: `Verification code sent to ${userDetails.phone}`,
        className: "border-green-200 bg-green-50 text-green-800",
      })
    }, 1500)
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit verification code.",
        className: "border-red-200 bg-red-50 text-red-800",
      })
      return
    }

    setIsLoading(true)
    
    // Simulate OTP verification
    setTimeout(() => {
      setOtpVerified(true)
      setStep('success')
      setIsLoading(false)
      
      // Store user data and login
      const userData = {
        ...userDetails,
        phone: userDetails.phone,
        verified: true,
        createdAt: new Date().toISOString()
      }
      login(userData)
      
      toast({
        title: "Account Created!",
        description: "Welcome! Your account has been created successfully.",
        className: "border-green-200 bg-green-50 text-green-800",
      })
    }, 1000)
  }


  const handleResendOtp = () => {
    if (countdown > 0) return
    
    setCountdown(60)
    toast({
      title: "OTP Resent!",
      description: `New verification code sent to ${userDetails.phone}`,
      className: "border-green-200 bg-green-50 text-green-800",
    })
  }

  const handleBack = () => {
    if (step === 'otp') {
      setStep('details')
      setOtpSent(false)
      setOtp('')
    }
  }

  const handleContinueToProfile = () => {
    router.push('/profile')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card className="bg-[#d62828] border-0 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold text-white mb-2">
                Your Account
              </CardTitle>
              <p className="text-gray-300 text-sm leading-relaxed">
                Please provide us with your contact details for updates, exclusive offers, and an easy ordering experience right at your fingertips.
              </p>
            </CardHeader>
            
            <CardContent className="px-8 pb-8">
              {/* User Details Step */}
              {step === 'details' && (
                <form onSubmit={handleDetailsSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white font-semibold text-sm">
                        Your Name *
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Type your full name"
                          value={userDetails.name}
                          onChange={(e) => setUserDetails(prev => ({ ...prev, name: e.target.value }))}
                          className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-white focus:ring-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white font-semibold text-sm">
                        Your Email *
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Type your email address"
                          value={userDetails.email}
                          onChange={(e) => setUserDetails(prev => ({ ...prev, email: e.target.value }))}
                          className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-white focus:ring-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-white font-semibold text-sm">
                        Your Phone *
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Type your phone number"
                          value={userDetails.phone}
                          onChange={(e) => setUserDetails(prev => ({ ...prev, phone: formatPhoneNumber(e.target.value) }))}
                          className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-white focus:ring-white"
                          maxLength={14}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isLoading || !userDetails.name || !userDetails.email || userDetails.phone.replace(/\D/g, '').length !== 10}
                    className="w-full bg-white hover:bg-gray-100 text-black font-bold text-lg py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Sending..." : "CONTINUE"}
                  </Button>
                </form>
              )}

              {/* OTP Verification Step */}
              {step === 'otp' && (
                <form onSubmit={handleOtpSubmit} className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">Verify Your Phone</h3>
                    <p className="text-gray-300 text-sm">
                      We sent a 6-digit code to <br />
                      <span className="text-white font-medium">{userDetails.phone}</span>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="otp" className="text-white font-semibold text-sm">
                      Enter Verification Code *
                    </Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-yellow-400 text-center text-2xl tracking-widest"
                      maxLength={6}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleBack}
                      className="text-gray-300 hover:text-white p-0"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleResendOtp}
                      disabled={countdown > 0}
                      className="text-yellow-400 hover:text-yellow-300 p-0 disabled:opacity-50"
                    >
                      {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
                    </Button>
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isLoading || otp.length !== 6}
                    className="w-full bg-white hover:bg-gray-100 text-black font-bold text-lg py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Verifying..." : "VERIFY"}
                  </Button>
                </form>
              )}


              {/* Success Step */}
              {step === 'success' && (
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  
                  <div>
                    <h3 className="text-white font-bold text-2xl mb-2">Welcome!</h3>
                    <p className="text-gray-300 text-sm">
                      Your account has been created successfully. You can now enjoy our services!
                    </p>
                  </div>

                  <Button
                    onClick={handleContinueToProfile}
                    className="w-full bg-white hover:bg-gray-100 text-black font-bold text-lg py-3 rounded-lg"
                  >
                    GO TO PROFILE
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
