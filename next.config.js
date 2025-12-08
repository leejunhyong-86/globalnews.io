/** @type {import('next').NextConfig} */
const nextConfig = {
  // Three.js에서 사용하는 텍스처 이미지 허용
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // 서버 컴포넌트에서 환경변수 사용
  env: {
    NOTION_API_KEY: process.env.NOTION_API_KEY,
    NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
  // Three.js 최적화
  webpack: (config) => {
    config.externals = [...(config.externals || []), { canvas: 'canvas' }];
    return config;
  },
};

module.exports = nextConfig;

