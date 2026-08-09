"use client";

import { ReactNode } from "react";
import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/** Cinematic page hero — image optional; falls back to luxury maroon/gold atmosphere */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  tall = false,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image?: string;
  tall?: boolean;
  children?: ReactNode;
}) {
  const hasImage = Boolean(image);

  return (
    <section
      className={cn(
        "relative overflow-hidden flex items-end",
        tall
          ? "h-[55vh] min-h-[340px] max-h-[560px]"
          : "h-[40vh] min-h-[260px] max-h-[420px]"
      )}
    >
      {hasImage ? (
        <Image
          src={image!}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          unoptimized={image!.startsWith("/uploads/")}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 20% 20%, rgba(201,169,98,0.22), transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(107,26,46,0.5), transparent 45%), linear-gradient(160deg, #0a0a0a 0%, #2d0812 45%, #4a0e1f 100%)",
          }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-matte via-maroon-deep/55 to-matte/30" />
      <div className="relative z-10 w-full flex flex-col items-center justify-end pb-12 md:pb-16 px-6 text-center">
        <Reveal>
          {eyebrow && (
            <p className="text-[11px] tracking-[0.4em] uppercase text-gold mb-3">
              {eyebrow}
            </p>
          )}
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-pearl text-balance">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 text-pearl/65 max-w-md mx-auto text-sm md:text-base">
              {subtitle}
            </p>
          )}
          {children}
        </Reveal>
      </div>
    </section>
  );
}

export function EmptyCatalog({
  title = "Collection arriving soon",
  subtitle = "Our handloom pieces are being curated. Please check back shortly, or explore our heritage.",
  ctaHref = "/contact",
  ctaLabel = "Enquire with us",
}: {
  title?: string;
  subtitle?: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="py-20 md:py-28 text-center px-6 border border-gold/20 bg-cream/40">
      <p className="font-serif text-3xl md:text-4xl text-charcoal mb-4">{title}</p>
      <p className="text-muted max-w-md mx-auto mb-8 leading-relaxed">{subtitle}</p>
      <a href={ctaHref} className="luxury-btn">
        {ctaLabel}
      </a>
    </div>
  );
}
