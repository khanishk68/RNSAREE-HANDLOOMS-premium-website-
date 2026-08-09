"use client";

import { useEffect, useMemo, useState } from "react";
import {
  categories as seedCategories,
  type Product,
  type Category,
  type Testimonial,
} from "@/lib/data";
import { useAdminStore, type AdminBanner } from "@/lib/admin-store";

type LiveBanner = {
  id: string;
  image: string;
  title: string;
  subtitle: string;
};

/**
 * Storefront catalogue — prefers published server catalogue (`/api/catalog`)
 * so every visitor sees the same products after Admin publishes.
 */
export function useCatalog() {
  const adminProducts = useAdminStore((s) => s.products);
  const adminCategories = useAdminStore((s) => s.categories);
  const adminTestimonials = useAdminStore((s) => s.testimonials);
  const adminBanners = useAdminStore((s) => s.banners);
  const adminHydrated = useAdminStore((s) => s.hydrated);

  const [serverProducts, setServerProducts] = useState<Product[] | null>(null);
  const [serverCategories, setServerCategories] = useState<Category[] | null>(
    null
  );
  const [serverTestimonials, setServerTestimonials] = useState<
    Testimonial[] | null
  >(null);
  const [serverBanners, setServerBanners] = useState<AdminBanner[] | null>(
    null
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/catalog", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const c = data.catalog;
          if (!cancelled && c) {
            setServerProducts(c.products ?? []);
            setServerCategories(
              c.categories?.length ? c.categories : seedCategories
            );
            setServerTestimonials(c.testimonials ?? []);
            setServerBanners(c.banners ?? []);
          }
        }
      } catch {
        /* fall back below */
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Prefer server catalogue; while admin is editing in same browser, prefer admin store if richer
  const products =
    serverProducts !== null
      ? serverProducts.length >= adminProducts.length
        ? serverProducts
        : adminProducts.length
          ? adminProducts
          : serverProducts
      : adminProducts;

  const categories =
    (serverCategories && serverCategories.length
      ? serverCategories
      : adminCategories.length
        ? adminCategories
        : seedCategories) ?? seedCategories;

  const testimonials =
    serverTestimonials !== null
      ? serverTestimonials.length
        ? serverTestimonials
        : adminTestimonials
      : adminTestimonials;

  const bannersSource =
    serverBanners !== null
      ? serverBanners.length
        ? serverBanners
        : adminBanners
      : adminBanners;

  const banners: LiveBanner[] = useMemo(() => {
    return [...bannersSource]
      .filter((b) => b.active && b.image)
      .sort((a, b) => a.order - b.order)
      .map((b) => ({
        id: b.id,
        image: b.image,
        title: b.title,
        subtitle: b.subtitle || "",
      }));
  }, [bannersSource]);

  const hydrated = ready && adminHydrated;

  return {
    products,
    categories,
    testimonials,
    banners,
    hydrated,
    getProductBySlug: (slug: string) => products.find((p) => p.slug === slug),
    getProductsByCategory: (slug: string) => {
      if (slug === "new-arrivals") return products.filter((p) => p.isNew);
      if (slug === "best-sellers") return products.filter((p) => p.bestSeller);
      if (slug === "limited-edition") return products.filter((p) => p.limited);
      if (slug === "festival")
        return products.filter(
          (p) => p.category === "festival" || p.occasion === "Festival"
        );
      return products.filter((p) => p.category === slug);
    },
    getRelatedProducts: (product: Product, limit = 4) =>
      products
        .filter(
          (p) =>
            p.id !== product.id &&
            (p.category === product.category || p.occasion === product.occasion)
        )
        .slice(0, limit),
    getCategoryBySlug: (slug: string) =>
      categories.find((c: Category) => c.slug === slug),
  };
}

export type { Product, Category, Testimonial };
