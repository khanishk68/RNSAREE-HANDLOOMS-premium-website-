"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Banknote, ArrowLeft, ShieldCheck } from "lucide-react";
import { useCartStore, useOrderStore, useAuthStore } from "@/lib/store";
import { useAdminStore } from "@/lib/admin-store";
import { formatINR } from "@/lib/utils";
import { Reveal, SectionHeading } from "@/components/ui/reveal";
import { BRAND } from "@/lib/data";
import { toast } from "sonner";

const inputClass =
  "w-full bg-pearl/80 border border-gold/35 px-4 py-3.5 text-sm text-charcoal placeholder:text-muted/50 outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors";

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total);
  const clearCart = useCartStore((s) => s.clearCart);
  const placeOrder = useOrderStore((s) => s.placeOrder);
  const upsertOrder = useAdminStore((s) => s.upsertOrder);
  const user = useAuthStore((s) => s.user);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (user) {
      setFullName((n) => n || user.name);
      setPhone((p) => p || user.phone || "");
    }
  }, [user]);

  if (!mounted) {
    return (
      <div className="min-h-[70vh] pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto h-64 skeleton" />
      </div>
    );
  }

  const cartTotal = total();

  if (items.length === 0) {
    return (
      <div className="relative min-h-[70vh] pt-28 md:pt-32 pb-24 px-4">
        <div className="max-w-lg mx-auto text-center py-20">
          <h1 className="font-serif text-4xl text-charcoal mb-4">
            Nothing to checkout
          </h1>
          <p className="text-muted mb-8">
            Your bag is empty. Add a handloom piece to continue.
          </p>
          <Link href="/shop" className="luxury-btn inline-flex">
            Shop Collection
          </Link>
        </div>
      </div>
    );
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const name = fullName.trim();
    const ph = phone.trim();
    const addr = address.trim();

    if (!name || name.length < 2) {
      toast.error("Please enter your full name");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(ph.replace(/\s+/g, ""))) {
      toast.error("Enter a valid 10-digit Indian mobile number");
      return;
    }
    if (!addr || addr.length < 10) {
      toast.error("Please enter a complete delivery address");
      return;
    }

    setSubmitting(true);
    const order = placeOrder({
      items,
      total: cartTotal,
      phone: ph.replace(/\s+/g, ""),
      address: `${name}\n${addr}`,
      notes: notes.trim() || undefined,
    });
    upsertOrder({
      id: order.id,
      customerName: name,
      customerEmail: user?.email || "",
      phone: ph.replace(/\s+/g, ""),
      address: addr,
      total: cartTotal,
      status: "confirmed",
      createdAt: order.createdAt,
      notes: notes.trim() || undefined,
      items: items.map((i) => ({
        name: i.product.name,
        quantity: i.quantity,
        price: i.product.price,
        image: i.product.images[0],
      })),
    });
    clearCart();
    toast.success("Order placed — Cash on Delivery");
    router.push(`/order-confirmation/${order.id}`);
  }

  return (
    <div className="relative min-h-[80vh] pt-28 md:pt-32 pb-24 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 0%, rgba(74,14,31,0.08), transparent 50%), linear-gradient(180deg, var(--cream), var(--ivory))",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 md:px-8">
        <Reveal>
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-muted hover:text-maroon mb-8 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Bag
          </Link>
          <SectionHeading
            eyebrow="Secure Checkout"
            title="Complete Your Order"
            subtitle="Cash on Delivery — pay when your handloom arrives"
          />
        </Reveal>

        <div className="grid lg:grid-cols-[1fr_340px] gap-10 lg:gap-12">
          <Reveal delay={0.08}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="luxury-card p-6 md:p-8 space-y-5">
                <h3 className="font-serif text-2xl text-charcoal">
                  Delivery Details
                </h3>
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-[11px] tracking-[0.2em] uppercase text-maroon mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={inputClass}
                    placeholder="As on delivery"
                    autoComplete="name"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-[11px] tracking-[0.2em] uppercase text-maroon mb-2"
                  >
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputClass}
                    placeholder="10-digit mobile"
                    autoComplete="tel"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="address"
                    className="block text-[11px] tracking-[0.2em] uppercase text-maroon mb-2"
                  >
                    Delivery Address
                  </label>
                  <textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={`${inputClass} min-h-[110px] resize-y`}
                    placeholder="House / flat, street, city, state, PIN"
                    autoComplete="street-address"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="notes"
                    className="block text-[11px] tracking-[0.2em] uppercase text-maroon mb-2"
                  >
                    Order Notes{" "}
                    <span className="text-muted normal-case tracking-normal">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className={`${inputClass} min-h-[80px] resize-y`}
                    placeholder="Gift wrap, preferred delivery window…"
                  />
                </div>
              </div>

              <motion.div
                className="luxury-card p-6 md:p-8 border-gold/50"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-full bg-maroon flex items-center justify-center">
                    <Banknote className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h4 className="font-serif text-xl text-charcoal">
                      Cash on Delivery
                    </h4>
                    <p className="text-sm text-muted mt-1 leading-relaxed">
                      We accept Cash on Delivery only. Inspect your saree on
                      arrival and pay the courier. No online payment required.
                    </p>
                    <p className="text-xs text-gold mt-3 tracking-wide">
                      {BRAND.name} · {BRAND.quote}
                    </p>
                  </div>
                </div>
              </motion.div>

              <button
                type="submit"
                disabled={submitting}
                className="luxury-btn w-full disabled:opacity-60"
              >
                {submitting ? "Placing Order…" : "Place Order · COD"}
              </button>
            </form>
          </Reveal>

          <Reveal delay={0.12}>
            <aside className="lg:sticky lg:top-28 luxury-card p-6 h-fit">
              <h3 className="font-serif text-2xl text-charcoal mb-5">
                Your Bag
              </h3>
              <ul className="space-y-4 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <li key={item.product.id} className="flex gap-3">
                    <div className="relative w-14 aspect-[3/4] shrink-0 overflow-hidden bg-cream">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-serif text-base text-charcoal truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-muted mt-0.5">
                        Qty {item.quantity} ·{" "}
                        {formatINR(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent my-5" />
              <div className="flex justify-between items-baseline">
                <span className="text-[11px] tracking-[0.2em] uppercase text-maroon">
                  Total
                </span>
                <span className="font-serif text-3xl text-maroon">
                  {formatINR(cartTotal)}
                </span>
              </div>
              <div className="mt-5 flex items-center gap-2 text-xs text-muted">
                <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
                Authenticated handloom · Secure COD checkout
              </div>
            </aside>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
