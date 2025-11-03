import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(videos);
  } catch (error) {
    console.error("❌ Error fetching videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos", details: (error as Error).message },
      { status: 500 }
    );
  }
}
