import { OG_SIZE } from "./og-card";

/** Open Graph image entry pointing to a build-time generated PNG. */
export function ogImage(url: string, alt: string) {
  return { url, alt, type: "image/png", ...OG_SIZE };
}
