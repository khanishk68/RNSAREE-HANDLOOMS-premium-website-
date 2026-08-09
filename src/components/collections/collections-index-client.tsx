"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { useCatalog } from "@/lib/use-catalog";

export function CollectionsIndexClient() {
  const { categories, getProductsByCategory } = useCatalog();

  return (
    <div className="section-pad max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, i) => {
          const banner =
            cat.banner || getProductsByCategory(cat.slug)[0]?.images[0] || "";
          const count = getProductsByCategory(cat.slug).length;
          return (
            <Reveal key={cat.id} delay={i * 0.05}>
              <Link
                href={`/collections/${cat.slug}`}
                className="group relative block overflow-hidden aspect-[4/5]"
              >
                {banner ? (
                  <Image
                    src={banner}
                    alt={cat.name}
                    fill
                    sizes="(max-width:768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    unoptimized={banner.startsWith("/uploads/")}
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
                <div className="absolute inset-0 bg-gradient-to-t from-matte via-matte/20 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-6 md:p-8">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-gold mb-2">
                    {count} {count === 1 ? "piece" : "pieces"}
                  </p>
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <h2 className="font-serif text-3xl text-pearl">{cat.name}</h2>
                      <p className="mt-2 text-sm text-pearl/60 line-clamp-2">
                        {cat.description}
                      </p>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-gold shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
