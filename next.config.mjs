/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://unientry-server-production.up.railway.app/api/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'https://unientry-server-production.up.railway.app/uploads/:path*',
      },
    ];
  },
};

export default nextConfig;
