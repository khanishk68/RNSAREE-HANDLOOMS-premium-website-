"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND } from "@/lib/data";
import { useCatalog } from "@/lib/use-catalog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

function GoldParticles() {
  const [particles, setParticles] = useState<
    { id: number; left: number; delay: number; size: number; duration: number }[]
  >([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        size: 2 + Math.random() * 4,
        duration: 8 + Math.random() * 10,
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-gold/60"
          style={{
            left: `${p.left}%`,
            bottom: "-10px",
            width: p.size,
            height: p.size,
            animation: `float-petal ${p.duration}s linear ${p.delay}s infinite`,
            boxShadow: "0 0 8px rgba(201,169,98,0.6)",
          }}
        />
      ))}
    </div>
  );
}

function HeroCopy({ delayBase = 0.4 }: { delayBase?: number }) {
  return (
    <div className="relative z-20 h-full flex flex-col justify-center px-6 md:px-16 lg:px-24 max-w-[1600px] mx-auto">
      <motion.p
        className="font-telugu text-gold text-lg md:text-2xl mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delayBase, duration: 0.8 }}
      >
        {BRAND.quoteTelugu}
      </motion.p>
      <motion.h1
        className="font-serif text-pearl text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.95] max-w-4xl tracking-wide"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delayBase + 0.15, duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        RN SAREE
        <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl mt-3 tracking-[0.15em] text-gold-soft font-light">
          HANDLOOMS AND DRESS
        </span>
      </motion.h1>
      <motion.p
        className="mt-6 md:mt-8 text-pearl/70 text-base md:text-lg max-w-md leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delayBase + 0.35 }}
      >
        Ultra luxury Indian handloom artistry. Pure craft, timeless elegance —
        Mana Samskruthi Mana Chenatha.
      </motion.p>
      <motion.div
        className="mt-10 flex flex-wrap gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delayBase + 0.5 }}
      >
        <Link href="/shop" className="luxury-btn">
          Explore Collection
        </Link>
        <Link href="/heritage" className="luxury-btn luxury-btn-outline">
          Our Heritage
        </Link>
      </motion.div>
    </div>
  );
}

export function Hero() {
  const { banners } = useCatalog();
  const slides = banners.filter((s) => s.image);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = useCallback(
    (dir: number) => {
      if (!slides.length) return;
      setDirection(dir);
      setIndex((i) => (i + dir + slides.length) % slides.length);
    },
    [slides.length]
  );

  useEffect(() => {
    if (index >= slides.length) setIndex(0);
  }, [slides.length, index]);

  useEffect(() => {
    if (!slides.length) return;
    const t = setInterval(() => paginate(1), 7000);
    return () => clearInterval(t);
  }, [paginate, slides.length]);

  const slide = slides[index];

  return (
    <section className="relative h-[100svh] min-h-[640px] overflow-hidden bg-matte">
      {slide ? (
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={slide.id}
            className="absolute inset-0"
            custom={direction}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1.12 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.2 },
              scale: { duration: 7, ease: "linear" },
            }}
          >
            <Image
              src={slide.image}
              alt={slide.title || BRAND.shortName}
              fill
              priority
              sizes="100vw"
              className="object-cover"
              unoptimized={slide.image.startsWith("/uploads/")}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-matte/85 via-maroon-deep/50 to-matte/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-matte via-transparent to-matte/30" />
          </motion.div>
        </AnimatePresence>
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 30% 40%, rgba(201,169,98,0.2), transparent 55%), radial-gradient(ellipse at 70% 60%, rgba(74,14,31,0.85), transparent 50%), linear-gradient(165deg, #0a0a0a 0%, #2d0812 40%, #4a0e1f 100%)",
          }}
        />
      )}

      <GoldParticles />

      <svg
        className="absolute bottom-0 left-0 w-full h-32 md:h-48 opacity-20 pointer-events-none z-10"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0,100 C360,180 720,20 1080,100 C1260,140 1380,120 1440,100 L1440,200 L0,200 Z"
          fill="url(#silkGrad)"
          animate={{
            d: [
              "M0,100 C360,180 720,20 1080,100 C1260,140 1380,120 1440,100 L1440,200 L0,200 Z",
              "M0,120 C360,40 720,160 1080,80 C1260,40 1380,100 1440,120 L1440,200 L0,200 Z",
              "M0,100 C360,180 720,20 1080,100 C1260,140 1380,120 1440,100 L1440,200 L0,200 Z",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <defs>
          <linearGradient id="silkGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4a0e1f" />
            <stop offset="50%" stopColor="#c9a962" />
            <stop offset="100%" stopColor="#4a0e1f" />
          </linearGradient>
        </defs>
      </svg>

      <HeroCopy delayBase={slide ? 2.9 : 0.3} />

      {slides.length > 1 && (
        <div className="absolute bottom-10 right-6 md:right-16 z-20 flex items-center gap-3">
          <button
            onClick={() => paginate(-1)}
            className="w-11 h-11 rounded-full border border-gold/40 text-gold flex items-center justify-center hover:bg-gold/10 transition"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-gold text-sm tracking-widest">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(slides.length).padStart(2, "0")}
          </span>
          <button
            onClick={() => paginate(1)}
            className="w-11 h-11 rounded-full border border-gold/40 text-gold flex items-center justify-center hover:bg-gold/10 transition"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </section>
  );
}
