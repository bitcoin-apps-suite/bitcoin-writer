/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Handle crypto polyfills for browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        assert: require.resolve('assert'),
        buffer: require.resolve('buffer'),
        process: require.resolve('process/browser'),
        os: require.resolve('os-browserify'),
        path: require.resolve('path-browserify'),
        vm: require.resolve('vm-browserify'),
      };
    }

    return config;
  },
  env: {
    REACT_APP_HANDCASH_APP_ID: process.env.REACT_APP_HANDCASH_APP_ID,
    REACT_APP_HANDCASH_APP_SECRET: process.env.REACT_APP_HANDCASH_APP_SECRET,
  },
  images: {
    domains: ['bitcoin-apps.s3.amazonaws.com', 'bitcoin-corp.vercel.app'],
  },
};

module.exports = nextConfig;