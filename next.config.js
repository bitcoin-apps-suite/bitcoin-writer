/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: '/Users/b0ase/Projects/bitcoin-OS/apps/bitcoin-writer',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;