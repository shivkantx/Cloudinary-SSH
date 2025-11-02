import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // ⚙️ Allow larger video uploads (up to 100 MB)
  // Note: 'api' is not a valid NextConfig property.
  // To set body size limit, configure it in your API route handler instead.

  // 🧪 Experimental config for Server Actions (if you use them)
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
};

export default nextConfig;
