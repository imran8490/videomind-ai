import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Keep module resolution scoped to this application when other lockfiles
    // exist elsewhere in the workspace.
    root: process.cwd(),
  },
};

export default nextConfig;
