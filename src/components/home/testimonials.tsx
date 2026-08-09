"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/ui/reveal";
import { useCatalog } from "@/lib/use-catalog";

export function TestimonialsSection() {
  const { testimonials } = useCatalog();

  if (!testimonials.length) return null;

  return (
    <section className="relative overflow-hidden bg-cream">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none opacity-50"
        style={{
          background:
            "radial-gradient(ellipse, rgba(201,169,98,0.15), transparent 70%)",
        }}
      />

      <div className="relative section-pad max-w-[1400px] mx-auto">
        <SectionHeading
          eyebrow="Patrons"
          title="Words woven in trust"
          subtitle="From bridal chambers to festive gatherings — the women who wear RN speak of craft, care, and belonging."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.1}>
              <article className="luxury-card h-full p-8 md:p-10 flex flex-col">
                <div
                  className="flex gap-1 mb-6"
                  aria-label={`${t.rating} out of 5 stars`}
                >
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s < t.rating ? "fill-gold text-gold" : "text-gold/25"
                      }`}
                    />
                  ))}
                </div>
                <p className="font-serif text-xl md:text-2xl text-charcoal leading-relaxed flex-1">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="mt-8 flex items-center gap-4 pt-6 border-t border-gold/20">
                  {t.image && (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                      <Image
                        src={t.image}
                        alt={t.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                        unoptimized={t.image.startsWith("/uploads/")}
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-charcoal">{t.name}</p>
                    <p className="text-sm text-muted">
                      {t.location}
                      {t.saree ? ` · ${t.saree}` : ""}
                    </p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
