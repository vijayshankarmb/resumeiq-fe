import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["mongodb"],
  transpilePackages: ["@auth/mongodb-adapter"],
};

export default nextConfig;
