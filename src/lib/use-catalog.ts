"use client";

import { useEffect, useMemo, useState } from "react";
import {
  categories as seedCategories,
  type Product,
  type Category,
  type Testimonial,
} from "@/lib/data";
import type { AdminBanner } from "@/lib/admin-store";

type LiveBanner = {
  id: string;
  image: string;
  title: string;
  subtitle: string;
};

/**
 * Storefront catalogue from Postgres via `/api/catalog`.
 * Refetches when admin saves, when the tab is focused, and every 15 seconds.
 */
export function useCatalog() {
  const [serverProducts, setServerProducts] = useState<Product[]>([]);
  const [serverCategories, setServerCategories] = useState<Category[]>(
    seedCategories
  );
  const [serverTestimonials, setServerTestimonials] = useState<Testimonial[]>(
    []
  );
  const [serverBanners, setServerBanners] = useState<AdminBanner[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/catalog", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          if (!cancelled) {
            setError(data.error || "Could not load catalogue");
          }
          return;
        }
        const c = data.catalog;
        if (!cancelled && c) {
          setServerProducts(c.products ?? []);
          setServerCategories(
            c.categories?.length ? c.categories : seedCategories
          );
          setServerTestimonials(c.testimonials ?? []);
          setServerBanners(c.banners ?? []);
          setError(null);
        }
      } catch {
        if (!cancelled) setError("Could not load catalogue");
      } finally {
        if (!cancelled) setReady(true);
      }
    }

    void load();
    const interval = window.setInterval(() => {
      void load();
    }, 15000);
    const onVisible = () => {
      if (document.visibilityState === "visible") void load();
    };
    const onUpdated = () => {
      void load();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("rn-catalog-updated", onUpdated);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("rn-catalog-updated", onUpdated);
    };
  }, []);

  const products = serverProducts;
  const categories = serverCategories;
  const testimonials = serverTestimonials;

  const banners: LiveBanner[] = useMemo(() => {
    return [...serverBanners]
      .filter((b) => b.active && b.image)
      .sort((a, b) => a.order - b.order)
      .map((b) => ({
        id: b.id,
        image: b.image,
        title: b.title,
        subtitle: b.subtitle || "",
      }));
  }, [serverBanners]);

  return {
    products,
    categories,
    testimonials,
    banners,
    hydrated: ready,
    error,
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
