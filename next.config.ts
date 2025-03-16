import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  optimizeFonts: false,
  experimental: {
    // Удалено appDir, так как оно больше не является опцией экспериментальной конфигурации
    serverComponentsExternalPackages: ["@medusajs/medusa-js"],
  },
};

export default nextConfig;
