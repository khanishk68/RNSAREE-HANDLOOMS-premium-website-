"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Star,
} from "lucide-react";
import { BRAND } from "@/lib/data";
import { useCatalog } from "@/lib/use-catalog";
import { Reveal, SectionHeading } from "@/components/ui/reveal";
import { PageHero } from "@/components/ui/page-hero";
import { InstagramIcon, FacebookIcon } from "@/components/ui/social-icons";
import Image from "next/image";

export function ContactClient() {
  const [sending, setSending] = useState(false);
  const { testimonials } = useCatalog();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    const form = e.currentTarget;
    window.setTimeout(() => {
      toast.success("Message received", {
        description:
          "Our concierge will respond shortly. Thank you for writing to RN Saree Handlooms.",
      });
      form.reset();
      setSending(false);
    }, 600);
  }

  const contacts = [
    BRAND.phone && {
      icon: Phone,
      label: "Phone",
      value: BRAND.phone,
      href: `tel:${BRAND.phone.replace(/\s/g, "")}`,
    },
    BRAND.email && {
      icon: Mail,
      label: "Email",
      value: BRAND.email,
      href: `mailto:${BRAND.email}`,
    },
    BRAND.whatsapp && {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "Chat with us",
      href: `https://wa.me/${BRAND.whatsapp}`,
    },
    BRAND.timings && {
      icon: Clock,
      label: "Store Timings",
      value: BRAND.timings,
      href: undefined as string | undefined,
    },
  ].filter(Boolean) as {
    icon: typeof Phone;
    label: string;
    value: string;
    href?: string;
  }[];

  return (
    <>
      <PageHero
        eyebrow="Concierge"
        title="Contact"
        subtitle="Write to our house — we are at your service for bridal appointments and enquiries."
      />

      <section className="bg-ivory">
        <div className="section-pad max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="text-[11px] tracking-[0.35em] uppercase text-maroon mb-4">
                  Write to Us
                </p>
                <h2 className="font-serif text-3xl md:text-5xl text-charcoal leading-tight">
                  A note for the house
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <form onSubmit={onSubmit} className="mt-10 space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <input
                      name="name"
                      required
                      placeholder="Your name"
                      className={inputCls}
                    />
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="you@email.com"
                      className={inputCls}
                    />
                  </div>
                  <input
                    name="phone"
                    placeholder="+91"
                    className={inputCls}
                  />
                  <textarea
                    name="message"
                    required
                    rows={5}
                    placeholder="How may we assist you?"
                    className={inputCls}
                  />
                  <button type="submit" disabled={sending} className="luxury-btn">
                    {sending ? "Sending…" : "Send message"}
                  </button>
                </form>
              </Reveal>
            </div>

            <div className="lg:col-span-5 space-y-8">
              {BRAND.address && (
                <Reveal>
                  <div className="flex gap-4">
                    <MapPin className="w-5 h-5 text-gold shrink-0 mt-1" />
                    <div>
                      <p className="text-[11px] tracking-[0.25em] uppercase text-maroon mb-2">
                        Visit
                      </p>
                      <p className="text-charcoal leading-relaxed">{BRAND.address}</p>
                      {BRAND.mapsUrl && (
                        <a
                          href={BRAND.mapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block mt-3 text-[11px] tracking-[0.2em] uppercase text-maroon border-b border-gold/50 pb-0.5 hover:border-gold transition-colors"
                        >
                          Open in Google Maps
                        </a>
                      )}
                    </div>
                  </div>
                </Reveal>
              )}

              {contacts.map((c) => (
                <Reveal key={c.label}>
                  <div className="flex gap-4">
                    <c.icon className="w-5 h-5 text-gold shrink-0 mt-1" />
                    <div>
                      <p className="text-[11px] tracking-[0.25em] uppercase text-maroon mb-2">
                        {c.label}
                      </p>
                      {c.href ? (
                        <a
                          href={c.href}
                          className="text-charcoal hover:text-maroon transition"
                          target={c.href.startsWith("http") ? "_blank" : undefined}
                          rel="noreferrer"
                        >
                          {c.value}
                        </a>
                      ) : (
                        <p className="text-charcoal">{c.value}</p>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}

              {!contacts.length && !BRAND.address && (
                <Reveal>
                  <p className="text-muted leading-relaxed">
                    Contact details will be published here shortly. Use the form
                    to reach us — we respond personally.
                  </p>
                </Reveal>
              )}

              <div className="flex gap-3 pt-2">
                {BRAND.instagram && (
                  <a
                    href={BRAND.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="w-11 h-11 rounded-full border border-gold/40 text-gold flex items-center justify-center hover:bg-gold/10"
                    aria-label="Instagram"
                  >
                    <InstagramIcon className="w-4 h-4" />
                  </a>
                )}
                {BRAND.facebook && (
                  <a
                    href={BRAND.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="w-11 h-11 rounded-full border border-gold/40 text-gold flex items-center justify-center hover:bg-gold/10"
                    aria-label="Facebook"
                  >
                    <FacebookIcon className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {(BRAND.mapsEmbed || BRAND.address) && (
            <Reveal className="mt-16">
              <div className="overflow-hidden border border-gold/25 aspect-[21/9] min-h-[240px] bg-cream">
                <iframe
                  title="RN Saree Handlooms location"
                  className="w-full h-full min-h-[240px] grayscale-[20%] contrast-110"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  src={
                    BRAND.mapsEmbed ||
                    `https://www.google.com/maps?q=${encodeURIComponent(BRAND.address)}&output=embed`
                  }
                />
              </div>
              {BRAND.mapsUrl && (
                <p className="mt-4 text-center">
                  <a
                    href={BRAND.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] tracking-[0.2em] uppercase text-maroon hover:text-gold transition-colors"
                  >
                    View on Google Maps
                  </a>
                </p>
              )}
            </Reveal>
          )}
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="bg-cream">
          <div className="section-pad max-w-[1400px] mx-auto">
            <SectionHeading
              eyebrow="Reviews"
              title="What our patrons say"
              subtitle="Stories from those who wear RN."
            />
            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.slice(0, 4).map((t) => (
                <article key={t.id} className="luxury-card p-8">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < t.rating ? "fill-gold text-gold" : "text-gold/25"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="font-serif text-xl text-charcoal leading-relaxed">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    {t.image && (
                      <div className="relative w-10 h-10 rounded-full overflow-hidden">
                        <Image
                          src={t.image}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="40px"
                          unoptimized={t.image.startsWith("/uploads/")}
                        />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="text-xs text-muted">{t.location}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

const inputCls =
  "w-full bg-pearl border border-gold/35 px-4 py-[0.95rem] text-charcoal text-[0.95rem] outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-muted/70 focus:border-gold focus:shadow-[0_0_0_3px_rgba(201,169,98,0.15)]";
