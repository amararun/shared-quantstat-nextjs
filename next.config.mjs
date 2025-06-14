/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Ignore TypeScript errors in docs directory
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignore ESLint errors in docs directory
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['*'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  }
};

export default nextConfig;
