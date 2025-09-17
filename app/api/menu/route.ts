import { NextResponse } from "next/server"
import { pizzas } from "@/data/pizzas"

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      pizzas,
    })
  } catch (error) {
    console.error("Error fetching menu:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch menu" }, { status: 500 })
  }
}
