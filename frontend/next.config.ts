import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    esmExternals: 'loose'
  },
  webpack: (config) => {
    config.externals = [...config.externals, { ymaps3: 'ymaps3' }];
    return config;
  }
};

export default nextConfig;
