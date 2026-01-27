/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  // 성능 최적화
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  // 로컬 네트워크에서 개발 서버 접근 허용
  allowedDevOrigins: ['192.168.*.*', 'localhost'],
};

module.exports = nextConfig;
