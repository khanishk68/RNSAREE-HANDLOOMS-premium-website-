"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  images: string[];
  alt: string;
};

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const safeImages = images.filter(Boolean);
  const [active, setActive] = useState(0);
  const [zooming, setZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const go = useCallback(
    (dir: number) => {
      setActive((i) =>
        safeImages.length
          ? (i + dir + safeImages.length) % safeImages.length
          : 0
      );
    },
    [safeImages.length]
  );

  if (!safeImages.length) {
    return (
      <div
        className="relative aspect-[3/4] w-full overflow-hidden gold-border"
        style={{
          background:
            "linear-gradient(160deg, #2d0812 0%, #4a0e1f 50%, #1a0a0e 100%)",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
          <p className="font-serif text-gold-soft/80 text-xl">{alt}</p>
        </div>
      </div>
    );
  }

  const onZoomMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="space-y-4">
      <div
        ref={setContainer}
        className="relative aspect-[3/4] cursor-zoom-in overflow-hidden bg-cream"
        onMouseEnter={() => setZooming(true)}
        onMouseLeave={() => setZooming(false)}
        onMouseMove={onZoomMove}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Image
              src={safeImages[active]}
              alt={`${alt} — view ${active + 1}`}
              fill
              priority
              sizes="(max-width:1024px) 100vw, 50vw"
              className={cn(
                "object-cover select-none",
                zooming && "opacity-0"
              )}
              draggable={false}
              unoptimized={safeImages[active]?.startsWith("/uploads/")}
            />
          </motion.div>
        </AnimatePresence>

        {zooming && (
          <div
            className="pointer-events-none absolute inset-0 hidden md:block"
            style={{
              backgroundImage: `url(${safeImages[active]})`,
              backgroundSize: "200%",
              backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
            }}
            aria-hidden
          />
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-matte/25 via-transparent to-transparent" />

        {safeImages.length > 1 && (
          <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3">
            <button
              type="button"
              onClick={() => go(-1)}
              className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full glass text-pearl transition-colors hover:text-gold"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full glass text-pearl transition-colors hover:text-gold"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {safeImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {safeImages.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative h-20 w-16 shrink-0 overflow-hidden border transition-all md:h-24 md:w-20",
                active === i
                  ? "border-gold opacity-100"
                  : "border-transparent opacity-60 hover:opacity-100"
              )}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
                unoptimized={src.startsWith("/uploads/")}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
