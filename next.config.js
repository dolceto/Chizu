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
};

module.exports = nextConfig;
