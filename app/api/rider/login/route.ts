import { NextRequest, NextResponse } from "next/server";
import { riderDB } from "@/lib/database/riders";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // For demo purposes, we'll create a rider if they don't exist
    // In production, this would be proper authentication
    const existingRiders = await riderDB.getAllRiders();
    let rider = existingRiders.find(r => r.email === email);

    if (!rider) {
      // Create a new rider for demo
      rider = await riderDB.createRider({
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        email,
        phone: '555-0123' // Default phone for demo
      });
    }

    // In production, verify password here
    // For demo, we'll just return the rider

    return NextResponse.json({ 
      message: "Login successful",
      rider 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Rider login error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
