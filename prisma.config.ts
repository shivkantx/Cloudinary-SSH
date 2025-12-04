// prisma.config.ts
import "dotenv/config";
import path from "node:path";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  // Prisma CLI / Migrate will read the DB URL from here:
  datasource: {
    url: env("DATABASE_URL"),
  },
});
