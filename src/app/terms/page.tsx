import type { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@/lib/data";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of service for RN Saree Handlooms — Cash on Delivery, returns, shipping, and house policies.",
};

const sections = [
  {
    title: "Agreement",
    body: `By browsing or purchasing from ${BRAND.name}, you agree to these terms. If you do not agree, please do not use our website or services.`,
  },
  {
    title: "Products & authenticity",
    body: `We curate genuine handloom and silk sarees from trusted weaver partners. Product descriptions, colours, and imagery are presented with care; slight variations in handwoven textiles are natural and part of the craft's character.`,
  },
  {
    title: "Pricing",
    body: `All prices are listed in Indian Rupees (INR) and may change without prior notice. Limited editions and bridal commissions may carry special pricing. Taxes, if applicable, will be indicated at checkout.`,
  },
  {
    title: "Cash on Delivery (COD)",
    body: `We offer Cash on Delivery on eligible orders within our serviceable pin codes. COD orders may require phone confirmation. Refusal of delivery after repeated attempts, or false COD orders, may lead to order cancellation and restrictions on future COD privileges. Exact COD limits and fees (if any) are shown at checkout.`,
  },
  {
    title: "Online payment",
    body: `Where online payment is enabled, orders are confirmed after successful payment authorisation. Failed or incomplete payments will not reserve inventory.`,
  },
  {
    title: "Shipping & delivery",
    body: `We ship across India through trusted courier partners. Estimated delivery windows are indicative. Delays due to weather, festivals, remote locations, or courier network issues are beyond our full control; we will keep you informed where possible.`,
  },
  {
    title: "Returns & exchanges",
    body: `Unused, unwashed sarees with original tags and packaging may be eligible for exchange or return within 7 days of delivery, subject to inspection. Bridal, custom, limited-edition, and heavily embellished pieces are generally final sale unless defective. Return shipping for non-defective exchanges may be borne by the customer. Please contact us before returning any item.`,
  },
  {
    title: "Damaged or incorrect items",
    body: `If your order arrives damaged or incorrect, notify us within 48 hours of delivery with clear photographs. We will arrange a replacement or suitable resolution at our discretion.`,
  },
  {
    title: "Care & liability",
    body: `Please follow the care instructions provided with each saree. We are not liable for damage arising from improper storage, washing, perfume contact with zari, or alterations performed outside our guidance.`,
  },
  {
    title: "Intellectual property",
    body: `All site content — photography, copy, logos, and design — belongs to ${BRAND.shortName} or its licensors and may not be reused without written permission.`,
  },
  {
    title: "Governing law",
    body: `These terms are governed by the laws of India. Disputes shall be subject to the jurisdiction of courts in Nellore / Andhra Pradesh, without prejudice to applicable consumer protection rights.`,
  },
  {
    title: "Contact",
    body: `Questions about these terms: ${BRAND.email} · ${BRAND.phone} · ${BRAND.address}. Store timings: ${BRAND.timings}.`,
  },
];

export default function TermsPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-matte text-pearl">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 30% 0%, rgba(74,14,31,0.55), transparent 55%)",
          }}
        />
        <div className="relative section-pad max-w-[800px] mx-auto pb-12 md:pb-16">
          <Reveal>
            <p className="text-[11px] tracking-[0.4em] uppercase text-gold mb-5">
              Policies
            </p>
            <h1 className="font-serif text-5xl md:text-7xl leading-[0.95]">
              Terms of Service
            </h1>
            <p className="mt-6 text-pearl/55 text-base md:text-lg leading-relaxed">
              COD, returns, shipping, and the house rules that keep craft and
              commerce clear.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-ivory">
        <div className="section-pad max-w-[720px] mx-auto">
          <Reveal>
            <p className="font-serif text-xl md:text-2xl text-charcoal/80 leading-relaxed mb-14">
              Last updated: August 2026. Please read these terms carefully
              before placing an order with {BRAND.name}.
            </p>
          </Reveal>

          <div className="space-y-14">
            {sections.map((s, i) => (
              <Reveal key={s.title} delay={Math.min(i * 0.03, 0.3)}>
                <div>
                  <h2 className="font-serif text-2xl md:text-3xl text-charcoal">
                    {s.title}
                  </h2>
                  <div className="mt-4 h-px w-16 bg-gradient-to-r from-gold to-transparent" />
                  <p className="mt-5 text-muted text-base md:text-lg leading-relaxed">
                    {s.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-16 pt-10 border-t border-gold/25 flex flex-wrap gap-6">
            <Link
              href="/privacy"
              className="text-[11px] tracking-[0.28em] uppercase text-maroon hover:text-maroon-soft transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/contact"
              className="text-[11px] tracking-[0.28em] uppercase text-maroon hover:text-maroon-soft transition-colors"
            >
              Contact Concierge →
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
