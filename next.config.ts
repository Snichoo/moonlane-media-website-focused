import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  output: "standalone",
  // Pin the workspace root to this project (multiple lockfiles exist on disk).
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
