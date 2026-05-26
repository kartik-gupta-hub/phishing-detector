/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/scans/:path*",
        destination: "http://127.0.0.1:5000/api/scans/:path*",
      },
      {
        source: "/api/chat",
        destination: "http://127.0.0.1:5000/api/chat",
      },
    ];
  },
};

export default nextConfig;
