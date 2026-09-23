import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Vinext applies this limit before the quote route can validate the
      // multipart request. Keep it above our route's 6 MB request ceiling so
      // customers receive the route's friendly 4 MB attachment-limit error.
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
