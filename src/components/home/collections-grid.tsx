"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/ui/reveal";
import { useCatalog } from "@/lib/use-catalog";

const FEATURED_SLUGS = [
  "silk",
  "banarasi",
  "kanjeevaram",
  "bridal",
  "designer",
  "soft-silk",
];

export function CollectionsGrid() {
  const { categories } = useCatalog();
  const featured = categories.filter((c) => FEATURED_SLUGS.includes(c.slug));

  return (
    <section className="bg-cream">
      <div className="section-pad max-w-[1400px] mx-auto">
        <SectionHeading
          eyebrow="Collections"
          title="Curated worlds of weave"
          subtitle="Step into our signature categories — each a distinct language of silk, zari, and occasion."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {featured.map((cat, i) => (
            <Reveal
              key={cat.id}
              delay={i * 0.08}
              className={i === 0 || i === 5 ? "md:col-span-2 lg:col-span-1" : ""}
            >
              <Link
                href={`/collections/${cat.slug}`}
                className="group relative block overflow-hidden aspect-[4/5]"
                data-cursor="hover"
              >
                {cat.banner ? (
                  <Image
                    src={cat.banner}
                    alt={cat.name}
                    fill
                    sizes="(max-width:768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    unoptimized={cat.banner.startsWith("/uploads/")}
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(160deg, #2d0812 0%, #4a0e1f 50%, #1a0a0e 100%)",
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-matte/90 via-maroon-deep/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-gold mb-2">
                    Collection
                  </p>
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-3xl md:text-4xl text-pearl">
                        {cat.name}
                      </h3>
                      <p className="mt-2 text-pearl/60 text-sm max-w-xs leading-relaxed line-clamp-2">
                        {cat.description}
                      </p>
                    </div>
                    <span className="shrink-0 w-10 h-10 rounded-full border border-gold/50 text-gold flex items-center justify-center group-hover:bg-gold group-hover:text-maroon-deep transition-colors">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 text-center">
          <Link href="/collections" className="luxury-btn luxury-btn-outline">
            View all collections
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
