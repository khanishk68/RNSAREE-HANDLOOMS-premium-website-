"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  images: string[];
  alt: string;
};

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const safeImages = images.filter(Boolean);
  const [active, setActive] = useState(0);
  const [mode360, setMode360] = useState(false);
  const [zooming, setZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const dragRef = useRef<{ startX: number; startIndex: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const onPointerDown = (e: React.PointerEvent) => {
    if (!mode360) return;
    dragRef.current = { startX: e.clientX, startIndex: active };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!mode360 || !dragRef.current) return;
    const delta = e.clientX - dragRef.current.startX;
    const step = 48;
    const steps = Math.round(delta / step);
    const next =
      (dragRef.current.startIndex - steps + safeImages.length * 20) %
      safeImages.length;
    setActive(next);
  };

  const onPointerUp = () => {
    dragRef.current = null;
  };

  const onZoomMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mode360 || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className={cn(
          "relative aspect-[3/4] overflow-hidden bg-cream",
          mode360 ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onMouseEnter={() => !mode360 && setZooming(true)}
        onMouseLeave={() => setZooming(false)}
        onMouseMove={onZoomMove}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${active}-${mode360}`}
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
                !mode360 && zooming && "opacity-0"
              )}
              draggable={false}
              unoptimized={safeImages[active]?.startsWith("/uploads/")}
            />
          </motion.div>
        </AnimatePresence>

        {!mode360 && zooming && (
          <div
            className="absolute inset-0 hidden md:block pointer-events-none"
            style={{
              backgroundImage: `url(${safeImages[active]})`,
              backgroundSize: "200%",
              backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
            }}
            aria-hidden
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-matte/25 via-transparent to-transparent pointer-events-none" />

        {mode360 && (
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <span className="text-[10px] tracking-[0.3em] uppercase text-gold bg-matte/60 px-3 py-1.5 backdrop-blur-sm">
              Drag to rotate · 360°
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-pearl/80 bg-matte/50 px-2 py-1">
              {active + 1}/{safeImages.length}
            </span>
          </div>
        )}

        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3 pointer-events-none">
          <button
            type="button"
            onClick={() => go(-1)}
            className="pointer-events-auto w-10 h-10 rounded-full glass text-pearl flex items-center justify-center hover:text-gold transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="pointer-events-auto w-10 h-10 rounded-full glass text-pearl flex items-center justify-center hover:text-gold transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-2 overflow-x-auto pb-1 flex-1">
          {safeImages.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative shrink-0 w-16 h-20 md:w-20 md:h-24 overflow-hidden border transition-all",
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

        <button
          type="button"
          onClick={() => setMode360((m) => !m)}
          className={cn(
            "shrink-0 inline-flex items-center gap-2 px-4 py-2.5 text-[10px] tracking-[0.25em] uppercase border transition-colors",
            mode360
              ? "border-gold bg-maroon text-gold"
              : "border-gold/40 text-maroon hover:border-gold hover:bg-maroon/5"
          )}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          360° View
        </button>
      </div>
    </div>
  );
}
