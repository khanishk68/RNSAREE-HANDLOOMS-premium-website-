"use client";

import { FormEvent, useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
} from "lucide-react";
import { useOrderStore, type Order } from "@/lib/store";
import type { AdminOrder } from "@/lib/admin-store";
import { formatINR } from "@/lib/utils";
import { Reveal, SectionHeading } from "@/components/ui/reveal";
import { BRAND } from "@/lib/data";

const inputClass =
  "w-full bg-pearl/80 border border-gold/35 px-4 py-3.5 text-sm text-charcoal placeholder:text-muted/50 outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-colors";

type TrackResult = {
  id: string;
  total: number;
  address: string;
  phone: string;
  status: Order["status"];
  createdAt: string;
  itemCount: number;
};

const statusMeta: Record<
  Order["status"],
  { label: string; icon: typeof Clock; step: number }
> = {
  pending: { label: "Pending", icon: Clock, step: 0 },
  confirmed: { label: "Confirmed", icon: CheckCircle2, step: 1 },
  shipped: { label: "Shipped", icon: Truck, step: 2 },
  delivered: { label: "Delivered", icon: Package, step: 3 },
  cancelled: { label: "Cancelled", icon: Clock, step: -1 },
};

const steps = ["Pending", "Confirmed", "Shipped", "Delivered"] as const;

function fromLocal(o: Order): TrackResult {
  return {
    id: o.id,
    total: o.total,
    address: o.address,
    phone: o.phone,
    status: o.status,
    createdAt: o.createdAt,
    itemCount: o.items.length,
  };
}

function fromAdmin(o: AdminOrder): TrackResult {
  return {
    id: o.id,
    total: o.total,
    address: `${o.customerName}\n${o.address}`,
    phone: o.phone,
    status: o.status,
    createdAt: o.createdAt,
    itemCount: o.items.reduce((n, i) => n + i.quantity, 0),
  };
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const orders = useOrderStore((s) => s.orders);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<TrackResult | null | undefined>(
    undefined
  );
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => setMounted(true), []);

  async function lookup(id: string) {
    const local = orders.find((o) => o.id.toLowerCase() === id.toLowerCase());
    if (local) {
      setResult(fromLocal(local));
      setSearched(true);
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/orders?id=${encodeURIComponent(id)}`, {
        cache: "no-store",
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.order) {
        setResult(fromAdmin(data.order as AdminOrder));
      } else if (!local) {
        setResult(null);
      }
    } catch {
      if (!local) setResult(null);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }

  useEffect(() => {
    if (!mounted) return;
    const id = searchParams.get("id");
    if (id) {
      setQuery(id);
      void lookup(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run when URL id is present
  }, [mounted, searchParams]);

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const id = query.trim();
    if (!id) return;
    void lookup(id);
  }

  if (!mounted) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="h-40 skeleton" />
      </div>
    );
  }

  const meta = result ? statusMeta[result.status] : null;

  return (
    <>
      <Reveal delay={0.08}>
        <form
          onSubmit={handleSearch}
          className="luxury-card p-6 md:p-8 max-w-lg mx-auto"
        >
          <label
            htmlFor="order-id"
            className="block text-[11px] tracking-[0.2em] uppercase text-maroon mb-2"
          >
            Order ID
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="order-id"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={inputClass}
              placeholder="e.g. RN12345678"
              autoComplete="off"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="luxury-btn shrink-0 inline-flex disabled:opacity-60"
            >
              <Search className="w-3.5 h-3.5" />
              {loading ? "Looking…" : "Track"}
            </button>
          </div>
          <p className="text-xs text-muted mt-4 text-center leading-relaxed">
            Enter the order ID from your confirmation email or bag receipt.
            Cash on Delivery · {BRAND.shortName}
          </p>
        </form>
      </Reveal>

      <AnimatePresence mode="wait">
        {searched && result === null && (
          <motion.div
            key="not-found"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="max-w-lg mx-auto mt-10 text-center luxury-card p-8"
          >
            <Package className="w-10 h-10 text-gold/60 mx-auto mb-4" strokeWidth={1.2} />
            <h3 className="font-serif text-2xl text-charcoal mb-2">
              Order not found
            </h3>
            <p className="text-sm text-muted mb-6">
              We couldn&apos;t find an order with that ID. Double-check and try
              again, or contact us at {BRAND.phone}.
            </p>
            <Link href="/contact" className="luxury-btn luxury-btn-outline inline-flex text-[10px] py-3">
              Contact Atelier
            </Link>
          </motion.div>
        )}

        {result && meta && (
          <motion.div
            key={result.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-lg mx-auto mt-10 luxury-card p-6 md:p-8"
          >
            <div className="flex justify-between items-start gap-4 mb-8">
              <div>
                <p className="text-[10px] tracking-[0.25em] uppercase text-muted">
                  Order
                </p>
                <p className="font-serif text-2xl text-maroon mt-0.5">
                  {result.id}
                </p>
                <p className="text-xs text-muted mt-1">
                  {new Date(result.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] tracking-[0.2em] uppercase text-muted">
                  Total (COD)
                </p>
                <p className="font-serif text-xl text-charcoal mt-0.5">
                  {formatINR(result.total)}
                </p>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-8 px-1">
              <div className="relative flex justify-between">
                <div className="absolute top-4 left-[12%] right-[12%] h-px bg-gold/25" />
                <motion.div
                  className="absolute top-4 left-[12%] h-px bg-gold origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{
                    scaleX: meta.step / (steps.length - 1),
                  }}
                  style={{ width: "76%" }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                />
                {steps.map((label, i) => {
                  const active = i <= meta.step;
                  return (
                    <div
                      key={label}
                      className="relative z-10 flex flex-col items-center flex-1"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${
                          active
                            ? "bg-maroon border-gold text-gold"
                            : "bg-cream border-gold/30 text-muted"
                        }`}
                      >
                        {i === 0 && <Clock className="w-3.5 h-3.5" />}
                        {i === 1 && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {i === 2 && <Truck className="w-3.5 h-3.5" />}
                        {i === 3 && <Package className="w-3.5 h-3.5" />}
                      </div>
                      <span
                        className={`text-[9px] tracking-wider uppercase mt-2 ${
                          active ? "text-maroon" : "text-muted"
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 bg-cream/70 border border-gold/30 text-center mb-6">
              <p className="text-[11px] tracking-[0.2em] uppercase text-maroon">
                Current Status
              </p>
              <p className="font-serif text-2xl text-charcoal mt-1">
                {meta.label}
              </p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex gap-3">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <p className="text-charcoal whitespace-pre-line leading-relaxed">
                  {result.address}
                </p>
              </div>
              <p className="text-muted text-xs pl-7">
                {result.itemCount} item
                {result.itemCount === 1 ? "" : "s"} · Phone {result.phone} · COD
              </p>
            </div>

            <Link
              href={`/order-confirmation/${result.id}`}
              className="block text-center mt-6 text-[11px] tracking-[0.2em] uppercase text-maroon hover:text-gold transition-colors"
            >
              View Full Details →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function TrackOrderPage() {
  return (
    <div className="relative min-h-[80vh] pt-28 md:pt-32 pb-24 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 10%, rgba(74,14,31,0.08), transparent 45%), radial-gradient(ellipse at 90% 80%, rgba(201,169,98,0.1), transparent 40%), linear-gradient(180deg, var(--ivory), var(--cream))",
        }}
      />

      <div className="relative max-w-3xl mx-auto px-4 md:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Delivery"
            title="Track Your Order"
            subtitle={`Follow your handloom from loom to door · ${BRAND.quote}`}
          />
        </Reveal>

        <Suspense
          fallback={
            <div className="max-w-lg mx-auto h-40 skeleton" />
          }
        >
          <TrackOrderContent />
        </Suspense>
      </div>
    </div>
  );
}
