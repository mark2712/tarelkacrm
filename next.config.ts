import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/app/main',
  output: 'export',
  trailingSlash: true,
};

export default nextConfig;
