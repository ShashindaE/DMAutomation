/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["440e-2402-d000-8120-225b-a411-425e-4d36-621b.ngrok-free.app"],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'scontent.cdninstagram.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'scontent-*.cdninstagram.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.cdninstagram.com',
        pathname: '**',
      }
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
