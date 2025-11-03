import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const title = data.get("title") as string;
    const description = data.get("description") as string;
    const publicId = data.get("publicId") as string;
    const originalSize = data.get("originalSize") as string;
    const compressedSize = data.get("compressedSize") as string;
    const duration = parseFloat(data.get("duration") as string);

    const video = await prisma.video.create({
      data: {
        title,
        description,
        publicId,
        originalSize,
        compressedSize,
        duration,
      },
    });

    return NextResponse.json(video, { status: 200 });
  } catch (error) {
    console.error("❌ Error uploading video:", error);
    return NextResponse.json(
      { error: "Failed to upload video", details: (error as Error).message },
      { status: 500 }
    );
  }
}
