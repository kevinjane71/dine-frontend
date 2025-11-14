/** @type {import('next').NextConfig} */
const nextConfig = {
  // Compress static assets for better performance
  compress: true,
  // Optimize package imports for better bundle size
  experimental: {
    optimizePackageImports: ['react-icons'],
  },
  // Enable static optimization
  swcMinify: true,
};

export default nextConfig;
