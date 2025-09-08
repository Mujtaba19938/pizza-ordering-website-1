"use client"

import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"

export interface Pizza {
  id: number
  name: string
  description: string
  image: string
  prices: {
    small: number
    medium: number
    large: number
  }
  category: string
  toppings?: string[]
  availableToppings?: string[]
  crustOptions?: string[]
}

export interface CartItem {
  pizza: Pizza
  size: "small" | "medium" | "large"
  quantity: number
  price: number
  selectedToppings?: string[]
  selectedCrust?: string
}

interface CartState {
  items: CartItem[]
  total: number
}

type CartAction =
  | {
      type: "ADD_TO_CART"
      payload: { pizza: Pizza; size: "small" | "medium" | "large"; selectedToppings?: string[]; selectedCrust?: string }
    }
  | { type: "REMOVE_FROM_CART"; payload: { pizzaId: number; size: "small" | "medium" | "large" } }
  | { type: "UPDATE_QUANTITY"; payload: { pizzaId: number; size: "small" | "medium" | "large"; quantity: number } }
  | { type: "CLEAR_CART" }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_TO_CART": {
      const { pizza, size, selectedToppings = [], selectedCrust } = action.payload
      const price = pizza.prices[size] + selectedToppings.length * 2 // $2 per extra topping
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.pizza.id === pizza.id &&
          item.size === size &&
          JSON.stringify(item.selectedToppings) === JSON.stringify(selectedToppings) &&
          item.selectedCrust === selectedCrust,
      )

      let newItems
      if (existingItemIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item,
        )
      } else {
        newItems = [...state.items, { pizza, size, quantity: 1, price, selectedToppings, selectedCrust }]
      }

      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      return { items: newItems, total }
    }

    case "REMOVE_FROM_CART": {
      const { pizzaId, size } = action.payload
      const newItems = state.items.filter((item) => !(item.pizza.id === pizzaId && item.size === size))
      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      return { items: newItems, total }
    }

    case "UPDATE_QUANTITY": {
      const { pizzaId, size, quantity } = action.payload
      if (quantity <= 0) {
        return cartReducer(state, { type: "REMOVE_FROM_CART", payload: { pizzaId, size } })
      }

      const newItems = state.items.map((item) =>
        item.pizza.id === pizzaId && item.size === size ? { ...item, quantity } : item,
      )
      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      return { items: newItems, total }
    }

    case "CLEAR_CART":
      return { items: [], total: 0 }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 })

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }

  const addToCart = (payload: {
    pizza: Pizza
    size: "small" | "medium" | "large"
    selectedToppings?: string[]
    selectedCrust?: string
  }) => {
    context.dispatch({ type: "ADD_TO_CART", payload })
  }

  const removeFromCart = (payload: { pizzaId: number; size: "small" | "medium" | "large" }) => {
    context.dispatch({ type: "REMOVE_FROM_CART", payload })
  }

  const updateQuantity = (payload: { pizzaId: number; size: "small" | "medium" | "large"; quantity: number }) => {
    context.dispatch({ type: "UPDATE_QUANTITY", payload })
  }

  const clearCart = () => {
    context.dispatch({ type: "CLEAR_CART" })
  }

  return {
    state: context.state,
    dispatch: context.dispatch,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  }
}
