"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { formatINR } from "@/lib/utils";
import { Reveal, SectionHeading } from "@/components/ui/reveal";
import { BRAND } from "@/lib/data";
import { toast } from "sonner";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const total = useCartStore((s) => s.total);
  const count = useCartStore((s) => s.count);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="min-h-[70vh] pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 skeleton rounded-sm" />
          ))}
        </div>
      </div>
    );
  }

  const cartTotal = total();
  const itemCount = count();

  return (
    <div className="relative min-h-[80vh] pt-28 md:pt-32 pb-24">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 0%, rgba(201,169,98,0.12), transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(74,14,31,0.06), transparent 45%), linear-gradient(180deg, var(--cream), var(--ivory))",
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 md:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Your Selection"
            title="Shopping Bag"
            subtitle={`${itemCount} piece${itemCount === 1 ? "" : "s"} · Cash on Delivery`}
          />
        </Reveal>

        <AnimatePresence mode="wait">
          {items.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-16 md:py-24"
            >
              <div className="mx-auto w-20 h-20 rounded-full border border-gold/40 flex items-center justify-center mb-8">
                <ShoppingBag className="w-8 h-8 text-gold" strokeWidth={1.25} />
              </div>
              <h3 className="font-serif text-3xl md:text-4xl text-charcoal mb-3">
                Your bag awaits
              </h3>
              <p className="text-muted max-w-md mx-auto mb-2 leading-relaxed">
                Discover handloom silk, Banarasi, and Kanjeevaram pieces woven
                for {BRAND.shortName}.
              </p>
              <p className="font-telugu text-gold/80 text-sm mb-10">
                {BRAND.quoteTelugu}
              </p>
              <Link href="/shop" className="luxury-btn inline-flex">
                Explore Collection
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="filled"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)] lg:gap-10"
            >
              <ul className="min-w-0 space-y-5">
                {items.map((item, i) => (
                  <Reveal key={item.product.id} delay={i * 0.06}>
                    <li className="luxury-card flex gap-4 md:gap-6 p-4 md:p-5">
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="relative w-24 md:w-32 aspect-[3/4] shrink-0 overflow-hidden bg-cream img-reveal"
                      >
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          sizes="128px"
                          className="object-cover"
                          unoptimized={item.product.images[0]?.startsWith("/uploads/")}
                        />
                      </Link>
                      <div className="flex-1 flex flex-col min-w-0">
                        <div className="flex justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[10px] tracking-[0.25em] uppercase text-muted">
                              {item.product.fabric}
                            </p>
                            <Link href={`/product/${item.product.slug}`}>
                              <h3 className="font-serif text-xl md:text-2xl text-charcoal hover:text-maroon transition-colors mt-0.5 line-clamp-2">
                                {item.product.name}
                              </h3>
                            </Link>
                            <p className="text-maroon font-medium mt-1">
                              {formatINR(item.product.price)}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              removeItem(item.product.id);
                              toast("Removed from bag");
                            }}
                            className="text-muted hover:text-maroon p-1.5 h-fit transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="mt-auto pt-4 flex items-center justify-between gap-3">
                          <div className="inline-flex items-center border border-gold/40">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1
                                )
                              }
                              className="w-10 h-10 flex items-center justify-center text-maroon hover:bg-cream transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-10 text-center text-sm font-medium tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1
                                )
                              }
                              className="w-10 h-10 flex items-center justify-center text-maroon hover:bg-cream transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="font-serif text-lg text-charcoal">
                            {formatINR(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </li>
                  </Reveal>
                ))}
              </ul>

              <aside className="luxury-card h-fit w-full min-w-0 p-5 md:p-6 lg:sticky lg:top-28">
                <h3 className="font-serif text-2xl text-charcoal mb-6">
                  Order Summary
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4 text-muted">
                    <span>Subtotal</span>
                    <span className="text-charcoal">{formatINR(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between gap-4 text-muted">
                    <span>Shipping</span>
                    <span className="text-right text-gold">At delivery</span>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent my-2" />
                  <div className="flex justify-between items-baseline gap-4">
                    <span className="text-[11px] tracking-[0.2em] uppercase text-maroon">
                      Total
                    </span>
                    <span className="font-serif text-3xl text-maroon">
                      {formatINR(cartTotal)}
                    </span>
                  </div>
                </div>
                <div className="mt-6 p-3 border border-gold/30 bg-cream/60 text-center">
                  <p className="text-[11px] tracking-[0.15em] uppercase text-maroon">
                    Cash on Delivery Only
                  </p>
                  <p className="text-xs text-muted mt-1">
                    Pay when your saree arrives
                  </p>
                </div>
                <Link
                  href="/checkout"
                  className="mt-6 flex w-full items-center justify-center gap-2 border border-gold bg-maroon-deep px-4 py-3.5 text-center text-[11px] uppercase tracking-[0.18em] text-gold-soft transition-opacity hover:opacity-90"
                >
                  Proceed to Checkout
                  <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                </Link>
                <Link
                  href="/shop"
                  className="block text-center mt-4 text-[11px] tracking-[0.2em] uppercase text-muted hover:text-maroon transition-colors"
                >
                  Continue Shopping
                </Link>
              </aside>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
