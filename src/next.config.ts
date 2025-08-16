
import type {NextConfig} from 'next';
import createPWA from '@ducanh2912/next-pwa';

const withPWA = createPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    // This is the key change to make Next.js and Expo work together.
    transpilePackages: [
      'react-native',
      'expo',
    ],
  },
};

export default withPWA(nextConfig);
