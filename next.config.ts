import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https" as const,
        hostname: "**",
      },
      {
        protocol: "http" as const,
        hostname: "**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
