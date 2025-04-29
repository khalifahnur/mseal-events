import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  images: {
    remotePatterns: [
      new URL("https://res.cloudinary.com/**"),
      {
        protocol: "https",
        hostname:
          "https://img.icons8.com/fluency-systems-regular/48/user--v1.png",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
