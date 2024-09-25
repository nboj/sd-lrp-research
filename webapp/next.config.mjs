/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: '7aqagtdznmitxhok.public.blob.vercel-storage.com'
      }
    ]
  }
};

export default nextConfig;
