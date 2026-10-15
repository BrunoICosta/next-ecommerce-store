import type { MetadataRoute } from "next";

import { routes } from "@/lib/routes";
import { absoluteUrl, BASE_PATH } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [routes.cart, routes.checkout, routes.orderConfirmation].map(
        (path) => `${BASE_PATH}${path}`,
      ),
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
