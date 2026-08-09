"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ArrowRight, ShoppingBag } from "lucide-react";
import { BRAND } from "@/lib/data";
import { useWishlistStore, useCartStore } from "@/lib/store";
import { useCatalog } from "@/lib/use-catalog";
import { Reveal, SectionHeading } from "@/components/ui/reveal";
import { ProductCard } from "@/components/product/product-card";
import { toast } from "sonner";

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const ids = useWishlistStore((s) => s.ids);
  const clear = useWishlistStore((s) => s.clear);
  const addItem = useCartStore((s) => s.addItem);
  const { products } = useCatalog();

  useEffect(() => setMounted(true), []);

  const wishlistProducts = products.filter((p) => ids.includes(p.id));

  if (!mounted) {
    return (
      <div className="min-h-[70vh] pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-[3/4] skeleton" />
          ))}
        </div>
      </div>
    );
  }

  function addAllToCart() {
    wishlistProducts.forEach((p) => addItem(p));
    toast.success("All pieces added to bag");
  }

  return (
    <div className="relative min-h-[80vh] pt-28 md:pt-32 pb-24 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 70% 10%, rgba(201,169,98,0.14), transparent 45%), radial-gradient(ellipse at 10% 90%, rgba(74,14,31,0.07), transparent 40%), linear-gradient(165deg, var(--pearl), var(--cream))",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 md:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Saved for Later"
            title="Wishlist"
            subtitle={
              wishlistProducts.length
                ? `${wishlistProducts.length} treasured piece${wishlistProducts.length === 1 ? "" : "s"}`
                : "Pieces that linger in memory"
            }
          />
        </Reveal>

        <AnimatePresence mode="wait">
          {wishlistProducts.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-center py-16 md:py-24"
            >
              <motion.div
                className="mx-auto w-24 h-24 rounded-full border border-gold/35 flex items-center justify-center mb-8"
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <Heart className="w-9 h-9 text-gold" strokeWidth={1.2} />
              </motion.div>
              <h3 className="font-serif text-3xl md:text-4xl text-charcoal mb-3">
                Nothing saved yet
              </h3>
              <p className="text-muted max-w-md mx-auto mb-2 leading-relaxed">
                Tap the heart on any saree to keep it here — a private atelier
                of pieces you love.
              </p>
              <p className="font-serif text-sm italic text-gold/90 mb-10">
                “{BRAND.quote}”
              </p>
              <Link href="/shop" className="luxury-btn inline-flex">
                Browse Handlooms
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
                <button
                  onClick={addAllToCart}
                  className="luxury-btn text-[10px] py-3 px-5 inline-flex"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Add All to Bag
                </button>
                <button
                  onClick={() => {
                    clear();
                    toast("Wishlist cleared");
                  }}
                  className="text-[11px] tracking-[0.2em] uppercase text-muted hover:text-maroon transition-colors"
                >
                  Clear All
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14">
                {wishlistProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
