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
        <Link href={`/product/${product.slug}`}>
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width:768px) 50vw, 25vw"
              className="object-cover"
              unoptimized={product.images[0].startsWith("/uploads/")}
            />
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
        <div className="absolute inset-0 bg-gradient-to-t from-matte/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <button
          onClick={() => {
            toggle(product.id);
            toast(has ? "Removed from wishlist" : "Added to wishlist");
          }}
          className={cn(
            "absolute top-3 right-3 w-10 h-10 rounded-full glass flex items-center justify-center transition-colors",
            has ? "text-gold" : "text-pearl"
          )}
          aria-label="Toggle wishlist"
        >
          <Heart className={cn("w-4 h-4", has && "fill-current")} />
        </button>
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.limited && (
            <span className="text-[9px] tracking-[0.2em] uppercase bg-maroon text-gold px-2 py-1">
              Limited
            </span>
          )}
          {product.isNew && (
            <span className="text-[9px] tracking-[0.2em] uppercase bg-gold text-maroon-deep px-2 py-1">
              New
            </span>
          )}
        </div>
        <button
          onClick={() => {
            addItem(product);
            toast.success("Added to bag");
          }}
          className="absolute bottom-4 left-4 right-4 luxury-btn opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 text-[10px]"
        >
          Add to Bag
        </button>
      </div>
      <div className="mt-4 space-y-1">
        <p className="text-[10px] tracking-[0.25em] uppercase text-muted">{product.fabric}</p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-serif text-xl md:text-2xl text-charcoal group-hover:text-maroon transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-3 pt-1">
          <span className="text-maroon font-medium">{formatINR(product.price)}</span>
          {product.compareAt && (
            <span className="text-muted text-sm line-through">{formatINR(product.compareAt)}</span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
