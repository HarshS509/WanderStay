/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mxoppcodscxjrsalzwcf.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/cabin-images/**",
      },
    ],
  },

  experimental: {
    serverComponentsExternalPackages: ["mongoose"],
  },
};

export default nextConfig;
