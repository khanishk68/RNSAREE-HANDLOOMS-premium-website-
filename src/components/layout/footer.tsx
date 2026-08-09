import Link from "next/link";
import { BRAND } from "@/lib/data";
import { Mail, Phone, MapPin } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/ui/social-icons";

const cols = [
  {
    title: "Explore",
    links: [
      { href: "/shop", label: "Shop All" },
      { href: "/collections", label: "Collections" },
      { href: "/gallery", label: "Gallery" },
      { href: "/blogs", label: "Journal" },
    ],
  },
  {
    title: "House",
    links: [
      { href: "/about", label: "About" },
      { href: "/heritage", label: "Our Heritage" },
      { href: "/contact", label: "Contact" },
      { href: "/track-order", label: "Track Order" },
    ],
  },
  {
    title: "Policies",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/account", label: "My Account" },
      { href: "/wishlist", label: "Wishlist" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative bg-matte text-pearl overflow-hidden">
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 20% 0%, rgba(74,14,31,0.6), transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(201,169,98,0.15), transparent 40%)",
        }}
      />
      <div className="relative section-pad pb-10">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <span className="font-serif text-3xl tracking-[0.2em]">RN SAREE</span>
              <span className="block text-[10px] tracking-[0.35em] uppercase text-gold mt-1">
                Handlooms and Dress
              </span>
            </Link>
            <p className="font-telugu text-gold mt-6 text-lg">{BRAND.quoteTelugu}</p>
            <p className="text-pearl/50 text-sm mt-1 italic">&ldquo;{BRAND.quote}&rdquo;</p>
            <p className="mt-6 text-pearl/60 text-sm max-w-sm leading-relaxed">
              An ultra luxury handloom house celebrating Telugu culture, Indian heritage, and
              timeless craftsmanship — one thread at a time.
            </p>
            <div className="flex gap-4 mt-8">
              {BRAND.instagram && (
                <a
                  href={BRAND.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold/10 transition"
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
                  className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold/10 transition"
                  aria-label="Facebook"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="text-[11px] tracking-[0.3em] uppercase text-gold mb-5">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-pearl/60 hover:text-gold transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {(BRAND.address || BRAND.phone || BRAND.email) && (
          <div className="max-w-[1400px] mx-auto mt-16 pt-10 border-t border-gold/15 grid md:grid-cols-3 gap-6 text-sm text-pearl/50">
            {BRAND.address && (
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>{BRAND.address}</span>
              </div>
            )}
            {BRAND.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <a href={`tel:${BRAND.phone}`} className="hover:text-gold transition">
                  {BRAND.phone}
                </a>
              </div>
            )}
            {BRAND.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <a href={`mailto:${BRAND.email}`} className="hover:text-gold transition">
                  {BRAND.email}
                </a>
              </div>
            )}
          </div>
        )}

        <div className="max-w-[1400px] mx-auto mt-10 flex flex-col md:flex-row justify-between gap-4 text-[11px] tracking-wider text-pearl/40 uppercase border-t border-gold/10 pt-8">
          <p>© {new Date().getFullYear()} RN Saree Handlooms and Dress. All rights reserved.</p>
          <p>Cash on Delivery · Pan India Shipping</p>
        </div>
      </div>
    </footer>
  );
}
