"use client";

import Link from "next/link";
import { BRAND } from "@/lib/data";
import { Reveal } from "@/components/ui/reveal";

export function BrandStory() {
  return (
    <section className="relative overflow-hidden bg-ivory">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse at 85% 15%, rgba(201,169,98,0.14), transparent 45%), radial-gradient(ellipse at 10% 90%, rgba(74,14,31,0.06), transparent 40%)",
        }}
      />

      <div className="relative section-pad max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {/* Quote panel — contained box */}
          <Reveal className="h-full">
            <div
              className="relative h-full min-h-[420px] lg:min-h-[520px] overflow-hidden gold-border flex flex-col items-center justify-center p-10 md:p-14 text-center"
              style={{
                background:
                  "linear-gradient(160deg, #2d0812 0%, #4a0e1f 42%, #1a0a0e 100%)",
              }}
            >
              <p className="font-telugu text-gold text-2xl md:text-3xl lg:text-4xl leading-relaxed max-w-md">
                {BRAND.quoteTelugu}
              </p>
              <div className="mt-6 h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
              <p className="mt-6 text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-gold-soft/75">
                {BRAND.quote}
              </p>
            </div>
          </Reveal>

          {/* Story copy — contained box */}
          <Reveal delay={0.1} className="h-full">
            <div className="h-full overflow-hidden border border-gold/25 bg-cream/80 backdrop-blur-sm p-8 md:p-10 lg:p-12 flex flex-col justify-center">
              <p className="text-[11px] tracking-[0.35em] uppercase text-maroon mb-4">
                Our House
              </p>

              <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] text-charcoal leading-[1.15] text-balance">
                Woven from memory,{" "}
                <span className="gold-gradient-text">worn as legacy</span>
              </h2>

              <div className="mt-5 h-px w-20 bg-gradient-to-r from-gold to-transparent shrink-0" />

              <div className="mt-7 space-y-4 text-muted text-[0.95rem] md:text-base leading-relaxed">
                <p>
                  RN Saree Handlooms and Dress is devoted to pure Indian handloom
                  — Banarasi zari, temple-border Kanjeevarams, soft silks, and
                  bridal heirlooms that carry Telugu heritage with quiet dignity.
                </p>
                <p>
                  Every piece is chosen for its story: the weaver&apos;s patience,
                  the gold&apos;s warmth, the drape that feels inevitable. We keep
                  a living tradition luminous.
                </p>
              </div>

              <div className="mt-9">
                <Link href="/about" className="luxury-btn">
                  Discover Our Story
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
