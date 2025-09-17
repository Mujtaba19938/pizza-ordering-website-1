import { NextRequest, NextResponse } from "next/server";
import { riderDB } from "@/lib/database/riders";

// GET /api/rider - Get all riders (admin)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let riders;
    if (status === 'online') {
      riders = await riderDB.getOnlineRiders();
    } else {
      riders = await riderDB.getAllRiders();
    }

    return NextResponse.json({ riders }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching riders:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
