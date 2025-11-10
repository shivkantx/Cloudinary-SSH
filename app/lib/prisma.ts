import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ["error"], // keep error logs only in production
  });
};

// Prevent multiple instances in dev hot-reload
declare const globalThis: {
  prismaGlobal?: ReturnType<typeof prismaClientSingleton>;
};

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
