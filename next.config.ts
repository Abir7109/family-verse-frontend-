import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  // In dev, avoid `/_next/image` caching surprises while iterating on files in /public.
  images: {
    unoptimized: process.env.NODE_ENV !== "production",
  },

  // In dev, disable caching for files served from /public/images so replacing an image
  // (keeping the same filename) is reflected immediately without hard-refreshes.
  async headers() {
    if (process.env.NODE_ENV === "production") return [];

    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
