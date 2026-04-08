/** Public site URL, used for absolute links in the sitemap, robots.txt and metadata. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
