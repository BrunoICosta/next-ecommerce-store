import type { NextConfig } from "next";

/**
 * The store is deployed as a fully static site on Cloudflare (Workers static
 * assets), served from https://portfolio.brunoisaac.dev/next-ecommerce-store/. Static export means no
 * server runtime: no Server Actions, no dynamic Route Handlers and no image
 * optimizer. Everything dynamic (cart, checkout, filters) runs on the client.
 */
const basePath = "/next-ecommerce-store";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    // Root-level 404 for an app with one root layout per locale (out/404.html).
    globalNotFound: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
