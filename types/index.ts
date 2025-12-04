// types/index.ts
export interface Video {
  id: string;
  title: string;
  description?: string; // optional in Prisma
  publicId: string;
  videoUrl: string;
  originalSize: string; // Prisma: String
  compressedSize: string; // Prisma: String
  duration: number; // Prisma: Float -> number in TS
  createdAt: Date;
  updatedAt: Date;
}
