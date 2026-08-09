"use client";

import Link from "next/link";
import { BRAND } from "@/lib/data";
import { Reveal } from "@/components/ui/reveal";
import { SilkCanvas } from "@/components/home/silk-canvas";

export function BrandStory() {
  return (
    <section className="relative overflow-hidden bg-ivory">
      <SilkCanvas className="absolute right-0 top-1/2 -translate-y-1/2 w-[45%] h-[70%] opacity-25 hidden lg:block" />
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div
          className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(201,169,98,0.18), transparent 70%)",
          }}
        />
      </div>

      <div className="relative section-pad max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <Reveal className="relative">
            <div
              className="relative aspect-[4/5] overflow-hidden gold-border"
              style={{
                background:
                  "linear-gradient(160deg, #2d0812 0%, #4a0e1f 40%, #1a0a0e 100%)",
              }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center">
                <p className="font-telugu text-gold text-2xl md:text-3xl leading-relaxed">
                  {BRAND.quoteTelugu}
                </p>
                <p className="mt-4 text-[11px] tracking-[0.3em] uppercase text-gold-soft/70">
                  {BRAND.quote}
                </p>
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className="text-[11px] tracking-[0.35em] uppercase text-maroon mb-4">
                Our House
              </p>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal leading-tight text-balance">
                Woven from memory,{" "}
                <span className="gold-gradient-text">worn as legacy</span>
              </h2>
              <div className="mt-6 h-px w-24 bg-gradient-to-r from-gold to-transparent" />
            </Reveal>

            <Reveal delay={0.15}>
              <p className="mt-8 text-muted text-base md:text-lg leading-relaxed max-w-xl">
                RN Saree Handlooms and Dress is devoted to pure Indian handloom
                — Banarasi zari, temple-border Kanjeevarams, soft silks, and
                bridal heirlooms that carry Telugu heritage with quiet dignity.
              </p>
              <p className="mt-5 text-muted text-base md:text-lg leading-relaxed max-w-xl">
                Every piece is chosen for its story: the weaver&apos;s patience,
                the gold&apos;s warmth, the drape that feels inevitable. We keep
                a living tradition luminous.
              </p>
            </Reveal>

            <Reveal delay={0.3} className="mt-10">
              <Link href="/about" className="luxury-btn">
                Discover Our Story
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
