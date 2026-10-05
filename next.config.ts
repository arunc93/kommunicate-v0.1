import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
    ],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        // Uploaded files live in /uploads. A save must not rebuild the dev server.
        ignored: /[\\/](\.(git|next)|node_modules|uploads)([\\/]|$)/,
      };
    }
    return config;
  },
};

export default nextConfig;
