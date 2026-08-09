"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Product } from "@/lib/data";
import { useCatalog } from "@/lib/use-catalog";
import { ProductCard } from "@/components/product/product-card";
import {
  ShopFilters,
  type ShopFilterState,
} from "@/components/shop/shop-filters";

type ShopCatalogProps = {
  initialCategory?: string;
  initialSearch?: string;
};

function uniqueSorted(values: string[]) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

export function ShopCatalog({
  initialCategory = "",
  initialSearch = "",
}: ShopCatalogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { products, getProductsByCategory } = useCatalog();

  const priceBounds = useMemo(() => {
    const prices = products.map((p) => p.price);
    if (!prices.length) return { min: 0, max: 100000 };
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [products]);

  const fabrics = useMemo(
    () => uniqueSorted(products.map((p) => p.fabric)),
    [products]
  );
  const colors = useMemo(
    () => uniqueSorted(products.map((p) => p.color)),
    [products]
  );
  const occasions = useMemo(
    () => uniqueSorted(products.map((p) => p.occasion)),
    [products]
  );

  const [filters, setFilters] = useState<ShopFilterState>({
    search: initialSearch,
    category: initialCategory,
    fabric: "",
    color: "",
    occasion: "",
    minPrice: priceBounds.min,
    maxPrice: priceBounds.max,
    sort: "newest",
  });

  // Adopt category from URL (links / back-forward). Search stays local after mount
  // so debounced URL writes never clobber in-progress typing.
  useEffect(() => {
    setFilters((prev) =>
      prev.category === initialCategory
        ? prev
        : { ...prev, category: initialCategory }
    );
  }, [initialCategory]);

  useEffect(() => {
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, []);

  const syncUrl = useCallback(
    (category: string, search: string) => {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (search) params.set("search", search);
      const qs = params.toString();
      startTransition(() => {
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    },
    [pathname, router]
  );

  const onChange = (partial: Partial<ShopFilterState>) => {
    setFilters((prev) => {
      const next = { ...prev, ...partial };

      if ("category" in partial) {
        if (searchTimer.current) clearTimeout(searchTimer.current);
        syncUrl(next.category, next.search);
      } else if ("search" in partial) {
        if (searchTimer.current) clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => {
          syncUrl(next.category, next.search);
        }, 350);
      }

      return next;
    });
  };

  const onReset = () => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    setFilters({
      search: "",
      category: "",
      fabric: "",
      color: "",
      occasion: "",
      minPrice: priceBounds.min,
      maxPrice: priceBounds.max,
      sort: "newest",
    });
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  };

  const filtered = useMemo(
    () => applyFilters(products, filters, getProductsByCategory),
    [filters, products, getProductsByCategory]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 lg:gap-14">
      <ShopFilters
        filters={filters}
        onChange={onChange}
        onReset={onReset}
        fabrics={fabrics}
        colors={colors}
        occasions={occasions}
        priceBounds={priceBounds}
        resultCount={filtered.length}
      />

      <div>
        {filtered.length === 0 ? (
          <div className="py-24 text-center border border-gold/20 bg-cream/40">
            <p className="font-serif text-3xl text-charcoal mb-3">
              No sarees match
            </p>
            <p className="text-muted mb-8">
              Adjust your filters or clear them to rediscover the collection.
            </p>
            <button type="button" onClick={onReset} className="luxury-btn">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i % 6} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function applyFilters(
  all: Product[],
  f: ShopFilterState,
  getByCategory: (slug: string) => Product[]
): Product[] {
  let list =
    f.category && f.category.length > 0
      ? getByCategory(f.category)
      : [...all];

  const q = f.search.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.color.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (f.fabric) list = list.filter((p) => p.fabric === f.fabric);
  if (f.color) list = list.filter((p) => p.color === f.color);
  if (f.occasion) list = list.filter((p) => p.occasion === f.occasion);

  list = list.filter((p) => p.price >= f.minPrice && p.price <= f.maxPrice);

  switch (f.sort) {
    case "price-asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "trending":
      list.sort((a, b) => {
        const score = (p: Product) =>
          (p.bestSeller ? 4 : 0) +
          (p.featured ? 2 : 0) +
          (p.isNew ? 1 : 0) +
          (p.limited ? 1 : 0);
        return score(b) - score(a);
      });
      break;
    case "newest":
    default:
      list.sort((a, b) => {
        if (a.isNew === b.isNew) return 0;
        return a.isNew ? -1 : 1;
      });
      break;
  }

  return list;
}
