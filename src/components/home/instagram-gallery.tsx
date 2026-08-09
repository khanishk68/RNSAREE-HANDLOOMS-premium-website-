"use client";

import Link from "next/link";
import { BRAND } from "@/lib/data";
import { useCatalog } from "@/lib/use-catalog";
import { Reveal, SectionHeading } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import Image from "next/image";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function InstagramGallery() {
  const { products } = useCatalog();
  const images = products
    .flatMap((p) => p.images)
    .filter(Boolean)
    .slice(0, 8);

  if (!images.length) return null;

  return (
    <section className="bg-ivory">
      <div className="section-pad max-w-[1400px] mx-auto">
        <SectionHeading
          eyebrow="Gallery"
          title="A glimpse of the house"
          subtitle="Moments from our handloom world — follow the craft as it unfolds."
        />
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4 space-y-3 md:space-y-4">
          {images.map((src, i) => (
            <Reveal key={`${src}-${i}`} delay={(i % 4) * 0.05}>
              <Link
                href="/gallery"
                className={cn(
                  "group relative block overflow-hidden break-inside-avoid img-reveal",
                  i % 3 === 0 ? "aspect-[3/4]" : "aspect-square"
                )}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="(max-width:768px) 50vw, 25vw"
                  className="object-cover"
                  unoptimized={src.startsWith("/uploads/")}
                />
                <div className="absolute inset-0 bg-maroon-deep/0 group-hover:bg-maroon-deep/35 transition-colors flex items-center justify-center">
                  <InstagramIcon className="w-6 h-6 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        {BRAND.instagram && (
          <div className="mt-12 text-center">
            <a
              href={BRAND.instagram}
              target="_blank"
              rel="noreferrer"
              className="luxury-btn luxury-btn-outline"
            >
              Follow on Instagram
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
