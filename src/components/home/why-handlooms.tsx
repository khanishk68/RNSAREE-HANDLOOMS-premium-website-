"use client";

import { Hand, Landmark, Users, ScrollText } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/ui/reveal";

const pillars = [
  {
    icon: Hand,
    title: "Craftsmanship",
    text: "Pit looms, korvai joins, and real zari — slow work that no machine can imitate with soul.",
  },
  {
    icon: Landmark,
    title: "Culture",
    text: "Telugu pride woven into every border. Mana Samskruthi Mana Chenatha is not a motto — it is our method.",
  },
  {
    icon: Users,
    title: "Artisans",
    text: "We partner with master weaver families whose hands have served generations of ceremony and celebration.",
  },
  {
    icon: ScrollText,
    title: "Heritage",
    text: "Kanjeevaram temples, Banarasi gardens, Uppada jamdani — living lineages you wear, not merely display.",
  },
];

export function WhyRNHandlooms() {
  return (
    <section className="relative overflow-hidden bg-maroon-deep text-pearl">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 10% 20%, rgba(201,169,98,0.12), transparent 45%), radial-gradient(ellipse at 90% 80%, rgba(107,26,46,0.5), transparent 50%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a962' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative section-pad max-w-[1400px] mx-auto">
        <SectionHeading
          light
          eyebrow="Why RN Handlooms"
          title="Four pillars of enduring beauty"
          subtitle="Luxury without lineage is empty. Ours rests on craft, culture, the artisan's hand, and heritage that outlives fashion."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <Reveal key={pillar.title} delay={i * 0.1}>
                <article className="group h-full border border-gold/20 bg-maroon/40 p-8 transition-colors duration-500 hover:border-gold/50 hover:bg-maroon-soft/40">
                  <div className="w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center text-gold mb-6 group-hover:bg-gold/10 transition-colors">
                    <Icon className="w-5 h-5" strokeWidth={1.25} />
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl text-pearl mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-pearl/55 text-sm md:text-base leading-relaxed">
                    {pillar.text}
                  </p>
                  <div className="mt-6 h-px w-12 bg-gradient-to-r from-gold to-transparent opacity-60 group-hover:w-20 transition-all duration-500" />
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
