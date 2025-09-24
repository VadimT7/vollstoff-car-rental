/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  transpilePackages: ['@valore/ui', '@valore/database', '@valore/lib'],
  // Completely disable static generation
  staticPageGenerationTimeout: 0,
  generateEtags: false,
  experimental: {
    typedRoutes: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'assets.valorerent.com',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    typedRoutes: false
  },
  webpack: (config) => {
    config.resolve.symlinks = false;
    return config;
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  async rewrites() {
    // Only add rewrites for production
    if (process.env.NODE_ENV === 'production') {
      return [
        {
          source: '/uploads/:path*',
          destination: 'https://flyrentals.ca/uploads/:path*',
        },
      ]
    }
    
    // In development, serve files directly from public directory
    return []
  },
}

module.exports = nextConfig
