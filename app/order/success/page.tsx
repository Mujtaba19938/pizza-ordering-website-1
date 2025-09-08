import { Suspense } from "react"
import { SuccessContent } from "./success-content"

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  )
}
