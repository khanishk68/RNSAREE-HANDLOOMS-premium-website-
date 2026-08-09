"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useCatalog } from "@/lib/use-catalog";

export type ShopFilterState = {
  search: string;
  category: string;
  fabric: string;
  color: string;
  occasion: string;
  minPrice: number;
  maxPrice: number;
  sort: "newest" | "price-asc" | "price-desc" | "trending";
};

type ShopFiltersProps = {
  filters: ShopFilterState;
  onChange: (next: Partial<ShopFilterState>) => void;
  onReset: () => void;
  fabrics: string[];
  colors: string[];
  occasions: string[];
  priceBounds: { min: number; max: number };
  resultCount: number;
};

const SORT_OPTIONS: { value: ShopFilterState["sort"]; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price · Low to High" },
  { value: "price-desc", label: "Price · High to Low" },
  { value: "trending", label: "Trending" },
];

export function ShopFilters({
  filters,
  onChange,
  onReset,
  fabrics,
  colors,
  occasions,
  priceBounds,
  resultCount,
}: ShopFiltersProps) {
  const [open, setOpen] = useState(false);
  const { categories } = useCatalog();

  const hasActive =
    filters.search ||
    filters.category ||
    filters.fabric ||
    filters.color ||
    filters.occasion ||
    filters.minPrice > priceBounds.min ||
    filters.maxPrice < priceBounds.max ||
    filters.sort !== "newest";

  const filterPanel = (
    <div className="space-y-8">
      <div>
        <label className="block text-[10px] tracking-[0.3em] uppercase text-maroon mb-3">
          Search
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="search"
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="Name, fabric, colour…"
            className="w-full bg-pearl/60 border border-gold/25 pl-10 pr-4 py-3 text-sm text-charcoal placeholder:text-muted/60 focus:outline-none focus:border-gold transition-colors"
          />
        </div>
      </div>

      <FilterSelect
        label="Category"
        value={filters.category}
        onChange={(category) => onChange({ category })}
        options={[
          { value: "", label: "All collections" },
          ...categories.map((c) => ({ value: c.slug, label: c.name })),
        ]}
      />

      <FilterSelect
        label="Fabric"
        value={filters.fabric}
        onChange={(fabric) => onChange({ fabric })}
        options={[
          { value: "", label: "All fabrics" },
          ...fabrics.map((f) => ({ value: f, label: f })),
        ]}
      />

      <FilterSelect
        label="Colour"
        value={filters.color}
        onChange={(color) => onChange({ color })}
        options={[
          { value: "", label: "All colours" },
          ...colors.map((c) => ({ value: c, label: c })),
        ]}
      />

      <FilterSelect
        label="Occasion"
        value={filters.occasion}
        onChange={(occasion) => onChange({ occasion })}
        options={[
          { value: "", label: "All occasions" },
          ...occasions.map((o) => ({ value: o, label: o })),
        ]}
      />

      <div>
        <label className="block text-[10px] tracking-[0.3em] uppercase text-maroon mb-3">
          Price range
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={priceBounds.min}
            max={filters.maxPrice}
            value={filters.minPrice}
            onChange={(e) =>
              onChange({ minPrice: Number(e.target.value) || priceBounds.min })
            }
            className="w-full bg-pearl/60 border border-gold/25 px-3 py-2.5 text-sm focus:outline-none focus:border-gold"
            aria-label="Minimum price"
          />
          <span className="text-muted text-xs">—</span>
          <input
            type="number"
            min={filters.minPrice}
            max={priceBounds.max}
            value={filters.maxPrice}
            onChange={(e) =>
              onChange({ maxPrice: Number(e.target.value) || priceBounds.max })
            }
            className="w-full bg-pearl/60 border border-gold/25 px-3 py-2.5 text-sm focus:outline-none focus:border-gold"
            aria-label="Maximum price"
          />
        </div>
        <input
          type="range"
          min={priceBounds.min}
          max={priceBounds.max}
          step={500}
          value={filters.maxPrice}
          onChange={(e) => onChange({ maxPrice: Number(e.target.value) })}
          className="mt-4 w-full accent-maroon"
          aria-label="Maximum price slider"
        />
      </div>

      <FilterSelect
        label="Sort"
        value={filters.sort}
        onChange={(sort) =>
          onChange({ sort: sort as ShopFilterState["sort"] })
        }
        options={SORT_OPTIONS.map((o) => ({
          value: o.value,
          label: o.label,
        }))}
      />

      {hasActive && (
        <button
          type="button"
          onClick={onReset}
          className="text-[11px] tracking-[0.2em] uppercase text-maroon hover:text-gold transition-colors inline-flex items-center gap-2"
        >
          <X className="w-3.5 h-3.5" />
          Clear filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile bar */}
      <div className="lg:hidden flex items-center justify-between gap-3 mb-8">
        <p className="text-sm text-muted">
          <span className="text-charcoal font-medium">{resultCount}</span> pieces
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 luxury-btn-outline px-4 py-2.5 text-[10px]"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block sticky top-28">
        <div className="mb-6 flex items-baseline justify-between gap-2">
          <h2 className="font-serif text-2xl text-charcoal">Refine</h2>
          <span className="text-xs text-muted">{resultCount} pieces</span>
        </div>
        {filterPanel}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-matte/60"
            aria-label="Close filters"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-ivory p-6 overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl">Refine</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 text-charcoal"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {filterPanel}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="luxury-btn w-full mt-8"
            >
              Show {resultCount} pieces
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-[10px] tracking-[0.3em] uppercase text-maroon mb-3">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full bg-pearl/60 border border-gold/25 px-3 py-3 text-sm text-charcoal",
          "focus:outline-none focus:border-gold appearance-none cursor-pointer"
        )}
      >
        {options.map((o) => (
          <option key={o.value || "all"} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
