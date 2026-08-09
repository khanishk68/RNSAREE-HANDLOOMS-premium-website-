import type { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@/lib/data";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for RN Saree Handlooms and Dress — how we collect, use, and protect your personal information.",
};

const sections = [
  {
    title: "Information we collect",
    body: `When you browse our site, place an order, create an account, join our newsletter, or write to our concierge, we may collect your name, email address, phone number, shipping address, and message content. Technical data such as browser type and approximate location may be collected to improve site performance.`,
  },
  {
    title: "How we use your information",
    body: `We use your information to fulfil orders (including Cash on Delivery coordination), respond to enquiries, send transactional updates, and — with your consent — share atelier news and new arrivals. We do not sell your personal data.`,
  },
  {
    title: "Payments & COD",
    body: `For online payments processed through third-party gateways, card details are handled by those providers under their security standards. For Cash on Delivery, we share only the delivery details required by our logistics partners.`,
  },
  {
    title: "Cookies & analytics",
    body: `We may use cookies and similar technologies to remember preferences, understand traffic, and refine the shopping experience. You may control cookies through your browser settings.`,
  },
  {
    title: "Sharing & security",
    body: `We share data only with trusted partners who help us operate (shipping, payment, messaging). We apply reasonable administrative and technical safeguards; no method of transmission over the internet is perfectly secure.`,
  },
  {
    title: "Your rights",
    body: `You may request access, correction, or deletion of your personal data, or opt out of marketing communications, by contacting us at the email below. We will respond within a reasonable period.`,
  },
  {
    title: "Contact",
    body: `For privacy requests, write to ${BRAND.email} or visit us at ${BRAND.address}. Phone: ${BRAND.phone}.`,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-maroon-deep text-pearl">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 70% 0%, rgba(201,169,98,0.15), transparent 50%)",
          }}
        />
        <div className="relative section-pad max-w-[800px] mx-auto pb-12 md:pb-16">
          <Reveal>
            <p className="text-[11px] tracking-[0.4em] uppercase text-gold mb-5">
              Policies
            </p>
            <h1 className="font-serif text-5xl md:text-7xl leading-[0.95]">
              Privacy Policy
            </h1>
            <p className="mt-6 text-pearl/55 text-base md:text-lg leading-relaxed">
              How {BRAND.shortName} honours your trust and protects your
              information.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-ivory">
        <div className="section-pad max-w-[720px] mx-auto">
          <Reveal>
            <p className="font-serif text-xl md:text-2xl text-charcoal/80 leading-relaxed mb-14">
              Last updated: August 2026. This policy applies to the website and
              services of {BRAND.name}.
            </p>
          </Reveal>

          <div className="space-y-14">
            {sections.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.04}>
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

          <Reveal className="mt-16 pt-10 border-t border-gold/25">
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
