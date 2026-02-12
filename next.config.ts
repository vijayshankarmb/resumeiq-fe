import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    reactCompiler: true,
  },
  serverExternalPackages: ["mongodb"],
  transpilePackages: ["@auth/mongodb-adapter"],
};

export default nextConfig;
