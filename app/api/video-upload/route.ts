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

    if (!title || !publicId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Construct Cloudinary video URL dynamically
    const videoUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/${publicId}.mp4`;

    // ✅ Save to Prisma DB
    const video = await prisma.video.create({
      data: {
        title,
        description,
        publicId,
        videoUrl, // 🆕 added field (make sure your Prisma schema has `videoUrl` column)
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
