/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Ensures Vercel properly detects App Router
  experimental: {
    serverComponentsExternalPackages: [],
  },

  // Prevents accidental static export issues
  output: undefined,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
}

module.exports = nextConfig
