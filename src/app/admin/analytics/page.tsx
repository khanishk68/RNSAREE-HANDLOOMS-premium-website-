"use client";

import { useMemo } from "react";
import { useAdminStore } from "@/lib/admin-store";
import { formatINR } from "@/lib/utils";
import { AdminCard, AdminPageHeader } from "@/components/admin/ui";

export default function AdminAnalyticsPage() {
  const products = useAdminStore((s) => s.products);
  const categories = useAdminStore((s) => s.categories);
  const orders = useAdminStore((s) => s.orders);
  const analytics = useAdminStore((s) => s.analytics);
  const stats = analytics();

  const salesByStatus = useMemo(() => {
    const entries = Object.entries(stats.orderCounts) as [
      string,
      number,
    ][];
    const max = Math.max(...entries.map(([, v]) => v), 1);
    return entries.map(([label, value]) => ({
      label,
      value,
      pct: Math.round((value / max) * 100),
    }));
  }, [stats.orderCounts]);

  const categoryMix = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of products) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
    const max = Math.max(...Object.values(counts), 1);
    return Object.entries(counts)
      .map(([label, value]) => ({
        label,
        value,
        pct: Math.round((value / max) * 100),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [products]);

  const stockBars = useMemo(() => {
    const buckets = [
      { label: "0", value: products.filter((p) => p.stock === 0).length },
      {
        label: "1–4",
        value: products.filter((p) => p.stock > 0 && p.stock < 5).length,
      },
      {
        label: "5–19",
        value: products.filter((p) => p.stock >= 5 && p.stock < 20).length,
      },
      { label: "20+", value: products.filter((p) => p.stock >= 20).length },
    ];
    const max = Math.max(...buckets.map((b) => b.value), 1);
    return buckets.map((b) => ({
      ...b,
      pct: Math.round((b.value / max) * 100),
    }));
  }, [products]);

  const revenueTimeline = useMemo(() => {
    const byDay: Record<string, number> = {};
    for (const o of orders) {
      if (o.status === "cancelled") continue;
      const day = new Date(o.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      });
      byDay[day] = (byDay[day] || 0) + o.total;
    }
    const entries = Object.entries(byDay);
    const max = Math.max(...entries.map(([, v]) => v), 1);
    return entries.map(([label, value]) => ({
      label,
      value,
      pct: Math.round((value / max) * 100),
    }));
  }, [orders]);

  return (
    <div>
      <AdminPageHeader
        title="Analytics"
        description="Lightweight sales, category, and stock insights."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <AdminCard>
          <p className="text-xs uppercase tracking-[0.14em] text-white/40">
            Revenue
          </p>
          <p className="mt-2 font-serif text-2xl text-[#e8d5a3]">
            {formatINR(stats.revenue)}
          </p>
        </AdminCard>
        <AdminCard>
          <p className="text-xs uppercase tracking-[0.14em] text-white/40">
            Avg order
          </p>
          <p className="mt-2 font-serif text-2xl text-[#e8d5a3]">
            {formatINR(stats.avgOrderValue)}
          </p>
        </AdminCard>
        <AdminCard>
          <p className="text-xs uppercase tracking-[0.14em] text-white/40">
            Catalogue
          </p>
          <p className="mt-2 font-serif text-2xl text-[#e8d5a3]">
            {stats.totalProducts}
            <span className="ml-2 text-sm text-white/35">
              / {categories.length} cats
            </span>
          </p>
        </AdminCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard>
          <h3 className="mb-5 font-serif text-lg text-[#e8d5a3]">
            Orders by status
          </h3>
          <div className="space-y-3">
            {salesByStatus.map((row) => (
              <BarRow key={row.label} {...row} />
            ))}
          </div>
        </AdminCard>

        <AdminCard>
          <h3 className="mb-5 font-serif text-lg text-[#e8d5a3]">
            Products by category
          </h3>
          <div className="space-y-3">
            {categoryMix.map((row) => (
              <BarRow key={row.label} {...row} capitalize />
            ))}
          </div>
        </AdminCard>

        <AdminCard>
          <h3 className="mb-5 font-serif text-lg text-[#e8d5a3]">
            Stock distribution
          </h3>
          <div className="space-y-3">
            {stockBars.map((row) => (
              <BarRow key={row.label} {...row} accent="maroon" />
            ))}
          </div>
        </AdminCard>

        <AdminCard>
          <h3 className="mb-5 font-serif text-lg text-[#e8d5a3]">
            Sales by day
          </h3>
          {revenueTimeline.length === 0 ? (
            <p className="text-sm text-white/40">No sales data yet.</p>
          ) : (
            <div className="space-y-3">
              {revenueTimeline.map((row) => (
                <BarRow
                  key={row.label}
                  label={row.label}
                  value={row.value}
                  pct={row.pct}
                  formatValue={(v) => formatINR(v)}
                />
              ))}
            </div>
          )}
        </AdminCard>
      </div>
    </div>
  );
}

function BarRow({
  label,
  value,
  pct,
  capitalize,
  accent = "gold",
  formatValue,
}: {
  label: string;
  value: number;
  pct: number;
  capitalize?: boolean;
  accent?: "gold" | "maroon";
  formatValue?: (v: number) => string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span
          className={
            capitalize
              ? "capitalize text-white/55"
              : "text-white/55"
          }
        >
          {label}
        </span>
        <span className="text-white/70">
          {formatValue ? formatValue(value) : value}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className={
            accent === "gold"
              ? "h-full rounded-full bg-gradient-to-r from-[#c9a962] to-[#e8d5a3] transition-all duration-500"
              : "h-full rounded-full bg-gradient-to-r from-[#4a0e1f] to-[#c9a962]/80 transition-all duration-500"
          }
          style={{ width: `${Math.max(pct, value > 0 ? 6 : 0)}%` }}
        />
      </div>
    </div>
  );
}
