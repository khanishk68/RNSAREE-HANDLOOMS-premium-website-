"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, User, Menu, X, Search } from "lucide-react";
import { BRAND } from "@/lib/data";
import { useCartStore, useWishlistStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About" },
  { href: "/heritage", label: "Heritage" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blogs", label: "Journal" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const cartCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const wishCount = useWishlistStore((s) => s.ids.length);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-500",
          scrolled
            ? "glass py-3 border-b border-gold/20"
            : "bg-gradient-to-b from-matte/70 to-transparent py-5"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mx-auto max-w-[1600px] px-4 md:px-8 flex items-center justify-between gap-4">
          <button
            className="lg:hidden text-pearl p-2"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 flex-1">
            {links.slice(0, 4).map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[11px] tracking-[0.2em] uppercase text-pearl/80 hover:text-gold transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <Link href="/" className="text-center shrink-0 group">
            <span className="block font-serif text-pearl text-lg md:text-2xl tracking-[0.2em] group-hover:text-gold transition-colors">
              RN SAREE
            </span>
            <span className="block text-[8px] md:text-[9px] tracking-[0.35em] uppercase text-gold/90 mt-0.5">
              Handlooms and Dress
            </span>
          </Link>

          <div className="flex items-center justify-end gap-3 md:gap-5 flex-1">
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 mr-2">
              {links.slice(4).map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-[11px] tracking-[0.2em] uppercase text-pearl/80 hover:text-gold transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <Link href="/shop?search=1" className="text-pearl/80 hover:text-gold p-1" aria-label="Search">
              <Search className="w-4 h-4" />
            </Link>
            <Link href="/wishlist" className="relative text-pearl/80 hover:text-gold p-1" aria-label="Wishlist">
              <Heart className="w-4 h-4" />
              {wishCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-maroon text-gold text-[9px] flex items-center justify-center">
                  {wishCount}
                </span>
              )}
            </Link>
            <Link href="/cart" className="relative text-pearl/80 hover:text-gold p-1" aria-label="Cart">
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold text-maroon-deep text-[9px] flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link href="/account" className="text-pearl/80 hover:text-gold p-1" aria-label="Account">
              <User className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <p className="text-center font-telugu text-[10px] md:text-xs text-gold/70 tracking-wide mt-2 hidden sm:block">
          {BRAND.quoteTelugu} · {BRAND.quote}
        </p>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] bg-maroon-deep/98 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex justify-between items-center p-5">
              <span className="font-serif text-pearl tracking-[0.2em]">RN SAREE</span>
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="text-pearl p-2">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex flex-col items-center gap-6 mt-12">
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="font-serif text-3xl text-pearl hover:text-gold tracking-wide"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <p className="absolute bottom-10 inset-x-0 text-center font-telugu text-gold/80">
              {BRAND.quoteTelugu}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
