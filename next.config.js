/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
   images: {
    unoptimized: true,
    remotePatterns: [
      // Cloudinary
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      // Placeholder images
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  assetPrefix: '/',
  async headers() {
    return [
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, must-revalidate',
          },
        ],
      },
    ]
  },
  // ✅ Ignore socket.io warnings
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        bufferutil: false,
        'utf-8-validate': false,
      }
    }
    return config
  },
}

module.exports = nextConfig