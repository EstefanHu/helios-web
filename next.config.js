const { securityHeaders } = require('./src/lib/constants/httpHeaders');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  headers: async () => [
    {
      source: '/(.*)',
      headers: securityHeaders,
    },
  ],
  experimental: {
    scrollRestoration: false,
  },
};

module.exports = nextConfig;
