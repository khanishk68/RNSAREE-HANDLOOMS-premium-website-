"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { EmptyCatalog, PageHero } from "@/components/ui/page-hero";
import { useCatalog } from "@/lib/use-catalog";

export function GalleryClient() {
  const { products } = useCatalog();
  const images = useMemo(
    () => products.flatMap((p) => p.images).filter(Boolean),
    [products]
  );
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const prev = useCallback(() => {
    setActive((i) =>
      i === null || !images.length
        ? null
        : (i - 1 + images.length) % images.length
    );
  }, [images.length]);
  const next = useCallback(() => {
    setActive((i) =>
      i === null || !images.length ? null : (i + 1) % images.length
    );
  }, [images.length]);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active, close, prev, next]);

  return (
    <>
      <PageHero
        eyebrow="Visual Atelier"
        title="Gallery"
        subtitle="A curated view of silk, ceremony, and atmosphere from our house."
        image={images[0]}
      />

      <section className="bg-ivory">
        <div className="section-pad max-w-[1400px] mx-auto">
          {images.length === 0 ? (
            <EmptyCatalog
              title="Gallery opening soon"
              subtitle="As sarees are added to the house, their imagery will appear here."
              ctaHref="/shop"
              ctaLabel="Visit shop"
            />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-[140px] md:auto-rows-[180px]">
              {images.map((src, i) => (
                <Reveal
                  key={`${src}-${i}`}
                  delay={(i % 6) * 0.04}
                  className={i % 5 === 0 ? "row-span-2" : "row-span-1"}
                >
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    className="relative w-full h-full min-h-[140px] overflow-hidden img-reveal group"
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="(max-width:768px) 50vw, 25vw"
                      className="object-cover"
                      unoptimized={src.startsWith("/uploads/")}
                    />
                    <div className="absolute inset-0 bg-maroon-deep/0 group-hover:bg-maroon-deep/25 transition-colors" />
                  </button>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {active !== null && images[active] && (
          <motion.div
            className="fixed inset-0 z-[80] bg-matte/95 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <button
              type="button"
              className="absolute top-5 right-5 text-pearl p-2"
              onClick={close}
              aria-label="Close"
            >
              <X className="w-7 h-7" />
            </button>
            <button
              type="button"
              className="absolute left-4 text-gold p-2"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <motion.div
              key={active}
              className="relative w-full max-w-4xl aspect-[3/4] md:aspect-[4/5]"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[active]}
                alt=""
                fill
                className="object-contain"
                sizes="90vw"
                unoptimized={images[active].startsWith("/uploads/")}
              />
            </motion.div>
            <button
              type="button"
              className="absolute right-4 text-gold p-2"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
