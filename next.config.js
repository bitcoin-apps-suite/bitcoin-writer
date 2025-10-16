/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: '/Users/b0ase/Projects/bitcoin-OS/apps/bitcoin-writer',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;