/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    minimumCacheTTL: 60 * 24 * 7,
    remotePatterns: [
      {
        hostname: '7aqagtdznmitxhok.public.blob.vercel-storage.com'
      }
    ]
  }
};

export default nextConfig;
