"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/product-card";
import { Reveal } from "@/components/ui/reveal";
import { useCatalog } from "@/lib/use-catalog";

export function CollectionPageClient({ slug }: { slug: string }) {
  const { getCategoryBySlug, getProductsByCategory, hydrated } = useCatalog();
  const category = getCategoryBySlug(slug);
  const items = getProductsByCategory(slug);

  if (hydrated && !category) {
    notFound();
  }

  if (!category) {
    return (
      <div className="min-h-[50vh] pt-32 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border border-gold/40 border-t-gold animate-spin" />
      </div>
    );
  }

  const banner = category.banner || items[0]?.images[0] || "";

  return (
    <div className="bg-ivory">
      <section className="relative h-[45vh] min-h-[300px] max-h-[480px] overflow-hidden">
        {banner ? (
          <Image
            src={banner}
            alt={category.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            unoptimized={banner.startsWith("/uploads/")}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 30% 40%, rgba(201,169,98,0.2), transparent 55%), linear-gradient(160deg, #0a0a0a, #4a0e1f)",
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep via-maroon-deep/55 to-matte/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 md:pb-16 px-6 text-center">
          <Reveal>
            <p className="text-[11px] tracking-[0.4em] uppercase text-gold mb-3">
              Collection
            </p>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-pearl text-balance">
              {category.name}
            </h1>
            <p className="mt-4 text-pearl/65 max-w-lg mx-auto text-sm md:text-base">
              {category.description}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-pad max-w-[1400px] mx-auto">
        {items.length === 0 ? (
          <div className="py-20 text-center border border-gold/20 bg-cream/40">
            <p className="font-serif text-3xl text-charcoal mb-4">
              Pieces arriving soon
            </p>
            <p className="text-muted mb-8 max-w-md mx-auto">
              This collection is being curated. Enquire for private appointments.
            </p>
            <Link href="/contact" className="luxury-btn">
              Enquire with us
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
            {items.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i % 6} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
