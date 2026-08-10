"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/data";
import { formatINR, cn } from "@/lib/utils";
import { useWishlistStore, useCartStore } from "@/lib/store";
import { toast } from "sonner";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const toggle = useWishlistStore((s) => s.toggle);
  const has = useWishlistStore((s) => s.ids.includes(product.id));
  const addItem = useCartStore((s) => s.addItem);
  const primary = product.images[0];
  const secondary = product.images[1];

  return (
    <motion.article
      className="group relative"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      data-cursor="hover"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-cream img-reveal">
        <Link
          href={`/product/${product.slug}`}
          className="absolute inset-0 z-0 block"
          aria-label={`View ${product.name}`}
        >
          {primary ? (
            <>
              <Image
                src={primary}
                alt={product.name}
                fill
                sizes="(max-width:768px) 50vw, 25vw"
                className={cn(
                  "object-cover transition-opacity duration-500",
                  secondary && "group-hover:opacity-0"
                )}
                unoptimized={primary.startsWith("/uploads/")}
              />
              {secondary && (
                <Image
                  src={secondary}
                  alt=""
                  fill
                  sizes="(max-width:768px) 50vw, 25vw"
                  className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  unoptimized={secondary.startsWith("/uploads/")}
                />
              )}
            </>
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center p-6 text-center"
              style={{
                background:
                  "linear-gradient(160deg, #2d0812 0%, #4a0e1f 50%, #1a0a0e 100%)",
              }}
            >
              <span className="font-serif text-gold-soft/80 text-lg leading-snug">
                {product.name}
              </span>
            </div>
          )}
        </Link>

        {/* Decorative only — must not block the product link */}
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-matte/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle(product.id);
            toast(has ? "Removed from wishlist" : "Added to wishlist");
          }}
          className={cn(
            "absolute top-3 right-3 z-[2] flex h-10 w-10 items-center justify-center rounded-full glass transition-colors",
            has ? "text-gold" : "text-pearl"
          )}
          aria-label="Toggle wishlist"
        >
          <Heart className={cn("h-4 w-4", has && "fill-current")} />
        </button>

        <div className="pointer-events-none absolute left-3 top-3 z-[2] flex flex-col gap-1">
          {product.limited && (
            <span className="bg-maroon px-2 py-1 text-[9px] uppercase tracking-[0.2em] text-gold">
              Limited
            </span>
          )}
          {product.isNew && (
            <span className="bg-gold px-2 py-1 text-[9px] uppercase tracking-[0.2em] text-maroon-deep">
              New
            </span>
          )}
          {product.images.length > 1 && (
            <span className="bg-matte/70 px-2 py-1 text-[9px] uppercase tracking-[0.2em] text-pearl backdrop-blur-sm">
              {product.images.length} photos
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addItem(product);
            toast.success("Added to bag");
          }}
          className="absolute bottom-3 left-3 right-3 z-[2] flex items-center justify-center border border-gold bg-maroon-deep px-4 py-3 text-[10px] uppercase tracking-[0.22em] text-gold-soft opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 max-md:opacity-100"
        >
          Add to Bag
        </button>
      </div>

      <div className="mt-4 space-y-1">
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted">
          {product.fabric}
        </p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-serif text-xl text-charcoal transition-colors group-hover:text-maroon md:text-2xl">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-3 pt-1">
          <span className="font-medium text-maroon">{formatINR(product.price)}</span>
          {product.compareAt && (
            <span className="text-sm text-muted line-through">
              {formatINR(product.compareAt)}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
