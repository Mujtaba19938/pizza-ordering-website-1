"use client"

import { useEffect, useState } from "react"
import { useSocket } from "@/contexts/socket-context"
import { Order, OrderStatus } from "@/lib/types/order"

interface UseOrderUpdatesProps {
  orderId?: string
  trackingCode?: string
  onStatusUpdate?: (order: Order) => void
}

export function useOrderUpdates({ 
  orderId, 
  trackingCode, 
  onStatusUpdate 
}: UseOrderUpdatesProps) {
  const { socket, isConnected } = useSocket()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch initial order data
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        let response
        
        if (orderId) {
          response = await fetch(`/api/orders/${orderId}`)
        } else if (trackingCode) {
          response = await fetch(`/api/track/${trackingCode}`)
        } else {
          return
        }

        if (response.ok) {
          const data = await response.json()
          setOrder(data.order)
          if (onStatusUpdate) {
            onStatusUpdate(data.order)
          }
        }
      } catch (error) {
        console.error("Error fetching order:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, trackingCode, onStatusUpdate])

  // Set up real-time listeners
  useEffect(() => {
    if (!socket || !isConnected) return

    const handleStatusUpdate = (updatedOrder: Order) => {
      setOrder(updatedOrder)
      if (onStatusUpdate) {
        onStatusUpdate(updatedOrder)
      }
    }

    // Join appropriate rooms
    if (orderId) {
      socket.emit("join-order", orderId)
      socket.on("status:update", handleStatusUpdate)
    }

    if (trackingCode) {
      socket.emit("join-tracking", trackingCode)
      socket.on("status:update", handleStatusUpdate)
    }

    return () => {
      if (orderId) {
        socket.off("status:update", handleStatusUpdate)
      }
      if (trackingCode) {
        socket.off("status:update", handleStatusUpdate)
      }
    }
  }, [socket, isConnected, orderId, trackingCode, onStatusUpdate])

  return {
    order,
    loading,
    isConnected
  }
}
