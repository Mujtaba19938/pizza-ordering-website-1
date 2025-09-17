import { NextRequest, NextResponse } from "next/server";
import { riderDB } from "@/lib/database/riders";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const riderId = params.id;
    const { status } = await req.json();

    const updatedRider = await riderDB.updateRiderStatus(riderId, status);

    if (!updatedRider) {
      return NextResponse.json({ error: "Rider not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      message: "Rider status updated successfully",
      rider: updatedRider 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error updating rider status:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
