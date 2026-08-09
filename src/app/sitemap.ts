import type { MetadataRoute } from "next";
import { products, categories, blogs } from "@/lib/data";

const base = process.env.NEXT_PUBLIC_SITE_URL || "https://rnsareehandlooms.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/shop",
    "/collections",
    "/about",
    "/heritage",
    "/gallery",
    "/blogs",
    "/contact",
    "/wishlist",
    "/cart",
    "/account",
    "/track-order",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const productPages = products.map((p) => ({
    url: `${base}/product/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const collectionPages = categories.map((c) => ({
    url: `${base}/collections/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const blogPages = blogs.map((b) => ({
    url: `${base}/blogs/${b.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...productPages, ...collectionPages, ...blogPages];
}
