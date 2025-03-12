/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    viewTransition: true,
  },
    typescript: {
        ignoreBuildErrors: true, // Ignores TypeScript errors during build
      },
};

export default nextConfig;
