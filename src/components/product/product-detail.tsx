"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Truck } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/data";
import { formatINR, cn } from "@/lib/utils";
import { useCartStore, useWishlistStore } from "@/lib/store";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductCard } from "@/components/product/product-card";
import { Reveal, SectionHeading } from "@/components/ui/reveal";

type ProductDetailProps = {
  product: Product;
  related: Product[];
};

export function ProductDetail({ product, related }: ProductDetailProps) {
  const addItem = useCartStore((s) => s.addItem);
  const toggle = useWishlistStore((s) => s.toggle);
  const wished = useWishlistStore((s) => s.ids.includes(product.id));

  const onAdd = () => {
    if (product.stock <= 0) {
      toast.error("This piece is currently unavailable");
      return;
    }
    addItem(product);
    toast.success("Added to bag");
  };

  const onWish = () => {
    toggle(product.id);
    toast(wished ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <div className="bg-ivory">
      <section className="section-pad max-w-[1400px] mx-auto pt-28 md:pt-32">
        <nav className="mb-8 text-[11px] tracking-[0.15em] uppercase text-muted">
          <Link href="/shop" className="hover:text-maroon transition-colors">
            Shop
          </Link>
          <span className="mx-2 text-gold/60">/</span>
          <Link
            href={`/collections/${product.category}`}
            className="hover:text-maroon transition-colors"
          >
            {product.category.replace(/-/g, " ")}
          </Link>
          <span className="mx-2 text-gold/60">/</span>
          <span className="text-charcoal">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <Reveal y={30}>
            <ProductGallery images={product.images} alt={product.name} />
          </Reveal>

          <Reveal delay={0.15} y={30} className="lg:pt-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {product.limited && (
                <span className="text-[9px] tracking-[0.2em] uppercase bg-maroon text-gold px-2.5 py-1">
                  Limited
                </span>
              )}
              {product.isNew && (
                <span className="text-[9px] tracking-[0.2em] uppercase bg-gold text-maroon-deep px-2.5 py-1">
                  New
                </span>
              )}
              {product.bestSeller && (
                <span className="text-[9px] tracking-[0.2em] uppercase border border-gold/50 text-maroon px-2.5 py-1">
                  Best Seller
                </span>
              )}
            </div>

            <p className="text-[11px] tracking-[0.3em] uppercase text-maroon mb-3">
              {product.fabric}
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal text-balance leading-tight">
              {product.name}
            </h1>

            <div className="mt-5 flex items-baseline gap-4">
              <span className="text-2xl text-maroon font-medium">
                {formatINR(product.price)}
              </span>
              {product.compareAt && (
                <span className="text-muted line-through">
                  {formatINR(product.compareAt)}
                </span>
              )}
            </div>

            <p className="mt-6 text-muted leading-relaxed max-w-lg">
              {product.description}
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-4 text-sm border-y border-gold/20 py-6">
              <div>
                <dt className="text-[10px] tracking-[0.25em] uppercase text-muted mb-1">
                  Colour
                </dt>
                <dd className="text-charcoal">{product.color}</dd>
              </div>
              <div>
                <dt className="text-[10px] tracking-[0.25em] uppercase text-muted mb-1">
                  Occasion
                </dt>
                <dd className="text-charcoal">{product.occasion}</dd>
              </div>
              <div>
                <dt className="text-[10px] tracking-[0.25em] uppercase text-muted mb-1">
                  Fabric
                </dt>
                <dd className="text-charcoal">{product.fabric}</dd>
              </div>
              <div>
                <dt className="text-[10px] tracking-[0.25em] uppercase text-muted mb-1">
                  Availability
                </dt>
                <dd className="text-charcoal">
                  {product.stock > 0
                    ? `${product.stock} in atelier`
                    : "Sold out"}
                </dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={onAdd}
                disabled={product.stock <= 0}
                className="luxury-btn flex-1 disabled:opacity-50 disabled:pointer-events-none"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Bag
              </button>
              <button
                type="button"
                onClick={onWish}
                className={cn(
                  "luxury-btn-outline flex-1 inline-flex items-center justify-center gap-2",
                  wished && "bg-maroon/5"
                )}
              >
                <Heart
                  className={cn("w-4 h-4", wished && "fill-current text-gold")}
                />
                {wished ? "Wishlisted" : "Wishlist"}
              </button>
            </div>

            <div className="mt-6 flex items-start gap-3 text-sm text-muted bg-cream/60 border border-gold/15 px-4 py-3.5">
              <Truck className="w-4 h-4 text-maroon shrink-0 mt-0.5" />
              <p>
                <span className="text-charcoal font-medium">
                  Cash on Delivery
                </span>{" "}
                available across India. Secure packaging, insured dispatch.
              </p>
            </div>
          </Reveal>
        </div>

        <div className="mt-20 md:mt-28 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          <Reveal>
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">
              The Story
            </h2>
            <div className="h-px w-16 bg-gradient-to-r from-gold to-transparent mb-6" />
            <p className="text-muted leading-relaxed text-base md:text-lg">
              {product.story}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">
              Care
            </h2>
            <div className="h-px w-16 bg-gradient-to-r from-gold to-transparent mb-6" />
            <ul className="space-y-3">
              {product.care.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-muted text-sm md:text-base"
                >
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-cream">
          <div className="section-pad max-w-[1400px] mx-auto">
            <SectionHeading
              eyebrow="Continue exploring"
              title="Related sarees"
              subtitle="Kindred weaves from the same occasion or collection."
            />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
