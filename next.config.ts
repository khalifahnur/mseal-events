import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          "https://img.icons8.com/fluency-systems-regular/48/user--v1.png",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname:
          "res.cloudinary.com",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
