"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Package, MapPin, Phone, ArrowRight } from "lucide-react";
import { useOrderStore, type Order } from "@/lib/store";
import { formatINR } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";
import { BRAND } from "@/lib/data";

const statusLabel: Record<Order["status"], string> = {
  pending: "Pending Confirmation",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [mounted, setMounted] = useState(false);
  const orders = useOrderStore((s) => s.orders);
  const order = orders.find((o) => o.id === id);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="min-h-[70vh] pt-32 pb-20 px-4">
        <div className="max-w-2xl mx-auto h-48 skeleton" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="relative min-h-[70vh] pt-28 md:pt-32 pb-24 px-4">
        <div className="max-w-lg mx-auto text-center py-20">
          <h1 className="font-serif text-4xl text-charcoal mb-4">
            Order not found
          </h1>
          <p className="text-muted mb-8">
            We couldn&apos;t locate this order. Check your ID or track below.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/track-order" className="luxury-btn inline-flex">
              Track Order
            </Link>
            <Link href="/shop" className="luxury-btn luxury-btn-outline inline-flex">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const dateStr = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="relative min-h-[80vh] pt-28 md:pt-32 pb-24 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(201,169,98,0.2), transparent 55%), linear-gradient(180deg, var(--maroon-deep), var(--maroon) 40%, var(--ivory) 40%)",
        }}
      />

      <div className="relative max-w-2xl mx-auto px-4 md:px-8">
        <Reveal>
          <div className="text-center text-pearl mb-10 pt-4">
            <motion.div
              className="mx-auto w-16 h-16 rounded-full border border-gold/50 flex items-center justify-center mb-6 animate-gold-pulse"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 16 }}
            >
              <CheckCircle2 className="w-8 h-8 text-gold" strokeWidth={1.25} />
            </motion.div>
            <p className="text-[11px] tracking-[0.35em] uppercase text-gold mb-3">
              Order Confirmed
            </p>
            <h1 className="font-serif text-4xl md:text-5xl leading-tight">
              Thank you
            </h1>
            <p className="mt-4 text-pearl/70 text-sm md:text-base max-w-md mx-auto">
              Your handloom is reserved. Pay with Cash on Delivery when it
              arrives.
            </p>
            <p className="font-telugu text-gold/80 text-sm mt-4">
              {BRAND.quoteTelugu}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="luxury-card p-6 md:p-8 -mt-2">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-gold/25">
              <div>
                <p className="text-[10px] tracking-[0.25em] uppercase text-muted">
                  Order ID
                </p>
                <p className="font-serif text-2xl text-maroon mt-0.5">
                  {order.id}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] tracking-[0.25em] uppercase text-muted">
                  Status
                </p>
                <p className="text-sm text-gold font-medium mt-0.5">
                  {statusLabel[order.status]}
                </p>
              </div>
            </div>

            <p className="text-xs text-muted mt-4 mb-6">{dateStr}</p>

            <ul className="space-y-4">
              {order.items.map((item) => (
                <li key={item.product.id} className="flex gap-4">
                  <div className="relative w-16 aspect-[3/4] shrink-0 overflow-hidden bg-cream">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-lg text-charcoal">
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

            <div className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent my-6" />

            <div className="space-y-3 text-sm">
              <div className="flex gap-3">
                <Package className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-muted">
                    Payment
                  </p>
                  <p className="text-charcoal">Cash on Delivery</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-muted">
                    Phone
                  </p>
                  <p className="text-charcoal">{order.phone}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-muted">
                    Delivery
                  </p>
                  <p className="text-charcoal whitespace-pre-line leading-relaxed">
                    {order.address}
                  </p>
                </div>
              </div>
              {order.notes && (
                <div className="pt-2">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-muted mb-1">
                    Notes
                  </p>
                  <p className="text-charcoal text-sm">{order.notes}</p>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-between items-baseline p-4 bg-cream/80 border border-gold/30">
              <span className="text-[11px] tracking-[0.2em] uppercase text-maroon">
                Total Due (COD)
              </span>
              <span className="font-serif text-3xl text-maroon">
                {formatINR(order.total)}
              </span>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href={`/track-order?id=${order.id}`}
                className="luxury-btn flex-1 inline-flex justify-center"
              >
                Track Order
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/shop"
                className="luxury-btn luxury-btn-outline flex-1 inline-flex justify-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
