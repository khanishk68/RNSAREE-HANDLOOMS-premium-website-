"use client";

import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { Reveal, SectionHeading } from "@/components/ui/reveal";
import { EmptyCatalog } from "@/components/ui/page-hero";
import { useCatalog } from "@/lib/use-catalog";

export function FeaturedProducts() {
  const { products } = useCatalog();
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const list = featured.length ? featured : products.slice(0, 8);

  return (
    <section className="bg-ivory">
      <div className="section-pad max-w-[1400px] mx-auto">
        <SectionHeading
          eyebrow="Featured"
          title="Pieces of quiet splendour"
          subtitle="Bridal heirlooms, soft silks, and limited editions — curated from our handloom house."
        />

        {list.length === 0 ? (
          <EmptyCatalog
            title="New weaves arriving"
            subtitle="Our first collection is being prepared. Enquire for private viewing or bridal appointments."
            ctaHref="/contact"
            ctaLabel="Enquire with us"
          />
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
              {list.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
            <Reveal className="mt-14 text-center">
              <Link href="/shop" className="luxury-btn">
                Shop the Collection
              </Link>
            </Reveal>
          </>
        )}
      </div>
    </section>
  );
}
