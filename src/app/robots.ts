import type { MetadataRoute } from "next";

import { locales } from "@/i18n/config";
import { createRoutes } from "@/lib/routes";
import { absoluteUrl, BASE_PATH } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const privatePaths = locales.flatMap((locale) => {
    const routes = createRoutes(locale);
    return [routes.cart, routes.checkout, routes.orderConfirmation];
  });
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: privatePaths.map((path) => `${BASE_PATH}${path}`),
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
