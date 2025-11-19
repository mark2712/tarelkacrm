import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // Доступно только на сервере
    API_TOKEN: process.env.API_TOKEN,
    // Доступно на сервере и в браузере
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
};

export default nextConfig;