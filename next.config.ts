import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 

 env:{
  BASE_URL: process.env.BASE_URL,
 },
//  http://localhost:5000/uploads --> backend server for images
 images: {
    unoptimized: true,
    domains: ['localhost'],
    remotePatterns: [
        {
            protocol: 'http',
            hostname: 'localhost',
            port: '5000',
            pathname: '/uploads/**',
        }
    ],
  },
  async rewrites(){
    return [
        {
            source: '/api/:path*',
            destination: 'http://localhost:5000/api/v1/:path*',
        }
    ];
  },
};

export default nextConfig;
