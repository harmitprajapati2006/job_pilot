import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdf-parse loads pdfjs-dist and its worker from disk at runtime, which
  // breaks when the route handler bundles it. Load it with native require.
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;
