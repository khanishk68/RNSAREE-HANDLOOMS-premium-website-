import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, SectionHeading } from "@/components/ui/reveal";
import { PaisleyMotif, LotusMotif } from "@/components/ui/motifs";

export const metadata: Metadata = {
  title: "Our Heritage",
  description:
    "The craft story of RN Saree Handlooms — loom process, Uppada, Pochampally, Kanjeevaram, Banarasi, and the artisans we celebrate.",
};

const loomSteps = [
  {
    step: "01",
    title: "Yarn & dye",
    text: "Silk and cotton yarns are prepared, then dyed with care — colours that will sing against zari and border.",
  },
  {
    step: "02",
    title: "Warping the loom",
    text: "Thousands of threads are stretched in tension. The warp is the architecture; the weft will paint upon it.",
  },
  {
    step: "03",
    title: "Tie, resist, weave",
    text: "For ikat, patterns are tied and dyed before weaving. For jamdani and brocade, motifs rise as the shuttle flies.",
  },
  {
    step: "04",
    title: "Border & pallu",
    text: "Korvai joins, temple borders, flowering jaals — the saree's signature is finished by patient hands.",
  },
  {
    step: "05",
    title: "Finish & bless",
    text: "Washing, pressing, inspection. Only pieces that carry integrity leave the loom for our house.",
  },
];

const weaves = [
  {
    name: "Uppada",
    region: "Coastal Andhra",
    text: "Celebrated for feather-light silk and intricate jamdani buttis — a pride of Andhra that drapes like breath.",
  },
  {
    name: "Pochampally",
    region: "Telangana",
    text: "Geometric ikat poetry — each pattern tie-dyed by hand before the loom. No two pieces identical.",
  },
  {
    name: "Kanjeevaram",
    region: "Tamil Nadu",
    text: "South India's temple of silk — bold contrast borders, sacred motifs, weight that feels ceremonial.",
  },
  {
    name: "Banarasi",
    region: "Varanasi",
    text: "Opulent zari weaves from the looms of Varanasi — gardens of gold, jaals of antique light.",
  },
];

export default function HeritagePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[65vh] flex items-end overflow-hidden bg-matte text-pearl">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 30% 40%, rgba(201,169,98,0.22), transparent 55%), linear-gradient(165deg, #0a0a0a 0%, #2d0812 40%, #4a0e1f 100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-matte via-maroon-deep/40 to-transparent" />
        <PaisleyMotif className="absolute top-20 left-10 w-24 md:w-36 pointer-events-none" />

        <div className="relative section-pad w-full max-w-[1400px] mx-auto pb-16 md:pb-24">
          <Reveal>
            <p className="text-[11px] tracking-[0.4em] uppercase text-gold mb-5">
              Our Heritage
            </p>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-balance max-w-4xl">
              Craft older than fashion
            </h1>
            <p className="mt-6 text-pearl/60 text-lg md:text-xl max-w-xl leading-relaxed">
              A deeper story of looms, lineages, and the regional weaves that
              define Indian handloom luxury.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Craft story */}
      <section className="bg-ivory">
        <div className="section-pad max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <Reveal className="lg:col-span-5">
              <p className="text-[11px] tracking-[0.35em] uppercase text-maroon mb-4">
                The Craft Story
              </p>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal leading-tight text-balance">
                Thread as{" "}
                <span className="gold-gradient-text">memory</span>
              </h2>
              <div className="mt-6 h-px w-24 bg-gradient-to-r from-gold to-transparent" />
            </Reveal>
            <Reveal delay={0.12} className="lg:col-span-7">
              <p className="text-muted text-base md:text-lg leading-relaxed">
                Indian handloom is a civilisation&apos;s archive. Patterns
                travelled along rivers and pilgrimage routes; techniques were
                inherited like heirlooms. At RN, we curate this living archive —
                not as costume, but as contemporary luxury with unbroken
                lineage.
              </p>
              <p className="mt-5 text-muted text-base md:text-lg leading-relaxed">
                Power looms can copy a motif. They cannot copy the slight
                irregularity that makes a handwoven saree breathe. That
                irregularity is the signature of the human hand — and the reason
                we exist.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Loom process */}
      <section className="relative overflow-hidden bg-maroon-deep text-pearl">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 0% 50%, rgba(201,169,98,0.1), transparent 45%)",
          }}
        />
        <div className="relative section-pad max-w-[1400px] mx-auto">
          <SectionHeading
            light
            eyebrow="From Loom to Legacy"
            title="How a saree is born"
            subtitle="Five movements of craft — from yarn to the finished drape you wear."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
            {loomSteps.map((s, i) => (
              <Reveal key={s.step} delay={i * 0.08}>
                <article className="h-full border border-gold/20 bg-maroon/30 p-6 md:p-7">
                  <span className="font-serif text-3xl text-gold/80">
                    {s.step}
                  </span>
                  <h3 className="font-serif text-xl md:text-2xl text-pearl mt-4 mb-3">
                    {s.title}
                  </h3>
                  <p className="text-pearl/55 text-sm leading-relaxed">
                    {s.text}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Regional weaves */}
      <section className="bg-cream">
        <div className="section-pad max-w-[1400px] mx-auto">
          <SectionHeading
            eyebrow="Regional Weaves"
            title="Four lineages we honour"
            subtitle="Uppada, Pochampally, Kanjeevaram, Banarasi — geographies of devotion you can wear."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {weaves.map((w, i) => (
              <Reveal key={w.name} delay={i * 0.08}>
                <article className="group grid grid-cols-1 sm:grid-cols-2 gap-0 overflow-hidden border border-gold/25 bg-ivory">
                  <div
                    className="relative aspect-[4/5] sm:aspect-auto sm:min-h-[280px] overflow-hidden flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(160deg, #2d0812 0%, #4a0e1f 50%, #1a0a0e 100%)",
                    }}
                  >
                    <span className="font-serif text-4xl text-gold/50 tracking-wide">
                      {w.name}
                    </span>
                  </div>
                  <div className="flex flex-col justify-center p-8 md:p-10">
                    <p className="text-[10px] tracking-[0.3em] uppercase text-maroon mb-2">
                      {w.region}
                    </p>
                    <h3 className="font-serif text-3xl md:text-4xl text-charcoal">
                      {w.name}
                    </h3>
                    <div className="mt-4 h-px w-16 bg-gradient-to-r from-gold to-transparent" />
                    <p className="mt-5 text-muted text-sm md:text-base leading-relaxed">
                      {w.text}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Artisan celebration */}
      <section className="relative overflow-hidden bg-ivory">
        <LotusMotif className="absolute top-12 right-8 w-48 pointer-events-none hidden md:block" />
        <div className="section-pad max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <Reveal>
              <div
                className="relative aspect-[4/5] overflow-hidden gold-border flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(160deg, #2d0812 0%, #4a0e1f 50%, #1a0a0e 100%)",
                }}
              >
                <LotusMotif className="w-32 h-32 text-gold/35" />
              </div>
            </Reveal>
            <div>
              <Reveal>
                <p className="text-[11px] tracking-[0.35em] uppercase text-maroon mb-4">
                  Artisan Celebration
                </p>
                <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal leading-tight text-balance">
                  Named hands,{" "}
                  <span className="gold-gradient-text">living craft</span>
                </h2>
                <div className="mt-6 h-px w-24 bg-gradient-to-r from-gold to-transparent" />
              </Reveal>
              <Reveal delay={0.12}>
                <p className="mt-8 text-muted text-base md:text-lg leading-relaxed">
                  We celebrate artisans not as anonymous labour, but as
                  collaborators in luxury. Fair partnership, long relationships,
                  and respect for time — because a bridal Banarasi may take
                  weeks; a limited ebony zari, months.
                </p>
                <p className="mt-5 text-muted text-base md:text-lg leading-relaxed">
                  When you wear RN, you wear a lineage of hands. That is the
                  true ornament.
                </p>
              </Reveal>
              <Reveal delay={0.25} className="mt-10 flex flex-wrap gap-4">
                <Link href="/shop" className="luxury-btn">
                  Shop Heritage
                </Link>
                <Link href="/gallery" className="luxury-btn luxury-btn-outline !text-maroon !border-maroon/40">
                  View Gallery
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
