import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Opcional si subes la web dentro de una subcarpeta en IONOS:
  basePath: '/web', 
};

export default nextConfig;