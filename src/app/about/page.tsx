import type { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@/lib/data";
import { Reveal, SectionHeading } from "@/components/ui/reveal";
import { PaisleyMotif, LotusMotif } from "@/components/ui/motifs";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story of RN Saree Handlooms — founder vision, mission, and our celebration of Indian handloom heritage from Nellore.",
};

const timeline = [
  {
    year: "Origins",
    title: "A house of cloth",
    text: "RN began as a devotion to pure handloom — sourcing from master weaver families across Andhra, Telangana, Tamil Nadu, and Varanasi.",
  },
  {
    year: "Craft",
    title: "Looms over machines",
    text: "We chose slow weaving, real zari, and korvai joins — refusing the shortcuts that empty a saree of its soul.",
  },
  {
    year: "Culture",
    title: "Telugu pride, Indian lineage",
    text: "Mana Samskruthi Mana Chenatha became our compass — culture first, commerce second, always.",
  },
  {
    year: "Today",
    title: "Luxury with lineage",
    text: "An ultra-luxury house for bridal, ceremonial, and everyday elegance — still rooted in the weaver's hand.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden bg-maroon-deep text-pearl">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 25% 30%, rgba(201,169,98,0.25), transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(74,14,31,0.9), transparent 45%), linear-gradient(165deg, #0a0a0a, #4a0e1f)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-matte via-maroon-deep/40 to-transparent" />
        <PaisleyMotif className="absolute top-16 right-8 w-28 md:w-40 pointer-events-none" />
        <PaisleyMotif className="absolute bottom-32 left-6 w-20 md:w-28 rotate-180 pointer-events-none" />

        <div className="relative section-pad w-full max-w-[1400px] mx-auto pb-16 md:pb-24">
          <Reveal>
            <p className="text-[11px] tracking-[0.4em] uppercase text-gold mb-5">
              Our House
            </p>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-balance max-w-4xl">
              RN Saree Handlooms
            </h1>
            <p className="font-telugu text-2xl md:text-4xl text-gold mt-8 max-w-2xl leading-snug">
              {BRAND.quoteTelugu}
            </p>
            <p className="mt-3 text-pearl/55 text-sm tracking-[0.2em] uppercase">
              {BRAND.quote}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Founder story */}
      <section className="relative overflow-hidden bg-ivory">
        <div
          className="absolute -top-20 -left-20 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(201,169,98,0.12), transparent 70%)",
          }}
        />
        <div className="relative section-pad max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <Reveal>
              <div
                className="relative aspect-[4/5] overflow-hidden gold-border flex flex-col items-center justify-center p-10 text-center"
                style={{
                  background:
                    "linear-gradient(160deg, #2d0812 0%, #4a0e1f 45%, #1a0a0e 100%)",
                }}
              >
                <LotusMotif className="w-24 h-24 text-gold/40 mb-6" />
                <p className="font-telugu text-gold text-2xl leading-relaxed">
                  {BRAND.quoteTelugu}
                </p>
              </div>
            </Reveal>
            <div>
              <Reveal>
                <p className="text-[11px] tracking-[0.35em] uppercase text-maroon mb-4">
                  Founder Story
                </p>
                <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal leading-tight text-balance">
                  Born of devotion to{" "}
                  <span className="gold-gradient-text">the loom</span>
                </h2>
                <div className="mt-6 h-px w-24 bg-gradient-to-r from-gold to-transparent" />
              </Reveal>
              <Reveal delay={0.12}>
                <p className="mt-8 text-muted text-base md:text-lg leading-relaxed">
                  RN Saree Handlooms was founded on a simple conviction: that
                  Indian handloom deserves the reverence of high fashion — and
                  that Telugu culture deserves a house that speaks its language
                  without apology.
                </p>
                <p className="mt-5 text-muted text-base md:text-lg leading-relaxed">
                  From Nellore&apos;s handloom streets, we built a curated
                  atelier where Banarasi gardens, Kanjeevaram temples, Uppada
                  jamdani, and soft silks meet discerning patrons. Every piece
                  is chosen for story, drape, and the quiet dignity of the
                  weaver&apos;s patience.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-cream">
        <div className="section-pad max-w-[1400px] mx-auto">
          <SectionHeading
            eyebrow="Mission"
            title="To keep living tradition luminous"
            subtitle="We exist to honour the hand that weaves — and to dress women who carry culture with grace."
          />
          <Reveal>
            <p className="max-w-3xl mx-auto text-center text-muted text-lg md:text-xl leading-relaxed font-serif">
              Our mission is to preserve and elevate Indian handloom craft
              through ethical sourcing, museum-worthy presentation, and an
              uncompromising standard of purity — so that every saree leaving
              our house feels inevitable, not merely beautiful.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Vision */}
      <section className="relative overflow-hidden bg-maroon-deep text-pearl">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 80% 20%, rgba(201,169,98,0.14), transparent 50%)",
          }}
        />
        <LotusMotif className="absolute bottom-8 left-1/2 -translate-x-1/2 w-64 md:w-96 pointer-events-none" />
        <div className="relative section-pad max-w-[1400px] mx-auto text-center">
          <SectionHeading
            light
            eyebrow="Vision"
            title="A global house of Indian silk"
            subtitle="Rooted in Andhra, recognised wherever heritage is worn with pride."
          />
          <Reveal>
            <p className="max-w-2xl mx-auto text-pearl/60 text-base md:text-lg leading-relaxed">
              We envision RN as the definitive destination for handloom luxury —
              where bridal chambers, festival mornings, and everyday elegance
              all begin with a loom, a lineage, and a promise kept.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Celebrate weavers */}
      <section className="bg-ivory">
        <div className="section-pad max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <div className="order-2 lg:order-1">
              <Reveal>
                <p className="text-[11px] tracking-[0.35em] uppercase text-maroon mb-4">
                  The Hands Behind the Cloth
                </p>
                <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal leading-tight text-balance">
                  We celebrate the{" "}
                  <span className="gold-gradient-text">weaver</span>
                </h2>
                <div className="mt-6 h-px w-24 bg-gradient-to-r from-gold to-transparent" />
              </Reveal>
              <Reveal delay={0.12}>
                <p className="mt-8 text-muted text-base md:text-lg leading-relaxed">
                  Behind every border is a family. Behind every zari vine, years
                  of apprenticeship. We partner with master weaver households
                  whose craft has served ceremonies for generations — paying
                  fairly, naming the craft, and refusing anonymity.
                </p>
                <p className="mt-5 text-muted text-base md:text-lg leading-relaxed">
                  To wear RN is to wear their patience. We hold that as sacred.
                </p>
              </Reveal>
              <Reveal delay={0.25} className="mt-10">
                <Link href="/heritage" className="luxury-btn">
                  Explore Our Heritage
                </Link>
              </Reveal>
            </div>
            <Reveal className="order-1 lg:order-2 relative">
              <div
                className="relative aspect-[5/6] overflow-hidden gold-border flex items-center justify-center p-10"
                style={{
                  background:
                    "linear-gradient(160deg, #1a0a0e 0%, #4a0e1f 50%, #2d0812 100%)",
                }}
              >
                <PaisleyMotif className="w-40 h-40 text-gold/30" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Indian handloom heritage */}
      <section className="bg-cream">
        <div className="section-pad max-w-[1400px] mx-auto">
          <SectionHeading
            eyebrow="Indian Handloom Heritage"
            title="A civilisation in thread"
            subtitle="From temple corridors to riverside looms — India has woven meaning into cloth for millennia."
          />
          <Reveal>
            <div className="max-w-3xl mx-auto space-y-6 text-center">
              <p className="text-muted text-base md:text-lg leading-relaxed">
                Handloom is not nostalgia. It is a living language — of region,
                ritual, and the human hand. Uppada&apos;s lightness, Banarasi
                jaal gardens, Kanjeevaram&apos;s temple geometry, Pochampally
                ikat&apos;s tie-dyed poetry: each weave is a geography of
                devotion.
              </p>
              <p className="font-serif text-2xl md:text-3xl text-charcoal leading-snug">
                We do not invent heritage. We keep it wearable.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Timeline */}
      <section className="relative overflow-hidden bg-matte text-pearl">
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(74,14,31,0.5), transparent 55%)",
          }}
        />
        <div className="relative section-pad max-w-[900px] mx-auto">
          <SectionHeading
            light
            eyebrow="Our Path"
            title="A timeline of devotion"
          />
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold/60 via-gold/30 to-transparent md:-translate-x-px" />
            <ul className="space-y-14">
              {timeline.map((item, i) => (
                <Reveal key={item.year} delay={i * 0.08}>
                  <li className="relative grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-12 pl-12 md:pl-0">
                    <div
                      className={`md:text-right ${i % 2 === 1 ? "md:col-start-2 md:text-left" : ""}`}
                    >
                      <span className="text-[11px] tracking-[0.3em] uppercase text-gold">
                        {item.year}
                      </span>
                      <h3 className="font-serif text-2xl md:text-3xl mt-2 text-pearl">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-pearl/55 text-sm md:text-base leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                    <span className="absolute left-4 md:left-1/2 top-2 w-2.5 h-2.5 rounded-full bg-gold -translate-x-1/2 ring-4 ring-maroon-deep" />
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Closing quote */}
      <section className="bg-ivory">
        <div className="section-pad max-w-[900px] mx-auto text-center">
          <Reveal>
            <LotusMotif className="w-40 mx-auto mb-8" opacity={0.35} />
            <p className="font-telugu text-3xl md:text-5xl text-maroon leading-snug">
              {BRAND.quoteTelugu}
            </p>
            <p className="mt-4 text-muted italic text-lg">&ldquo;{BRAND.quote}&rdquo;</p>
            <div className="mt-10 h-px w-24 mx-auto bg-gradient-to-r from-transparent via-gold to-transparent" />
          </Reveal>
        </div>
      </section>
    </>
  );
}
