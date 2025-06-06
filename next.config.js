/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
  },
  env: {
    STARLING_API_URL: process.env.STARLING_API_URL || 'http://localhost:3001',
  },
}

module.exports = nextConfig
