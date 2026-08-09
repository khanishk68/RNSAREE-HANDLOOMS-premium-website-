"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package,
  AlertTriangle,
  IndianRupee,
  ShoppingBag,
  Tags,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { useAdminStore } from "@/lib/admin-store";
import { formatINR } from "@/lib/utils";
import { AdminCard, AdminPageHeader, StatusBadge } from "@/components/admin/ui";

export default function AdminDashboardPage() {
  const products = useAdminStore((s) => s.products);
  const orders = useAdminStore((s) => s.orders);
  const analytics = useAdminStore((s) => s.analytics);
  const stats = analytics();

  const lowStockProducts = products
    .filter((p) => p.stock < 5)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 6);

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const cards = [
    {
      label: "Products",
      value: String(stats.totalProducts),
      icon: Package,
      hint: `${stats.categoriesCount} categories`,
    },
    {
      label: "Low stock",
      value: String(stats.lowStock),
      icon: AlertTriangle,
      hint: "Under 5 units",
      accent: true,
    },
    {
      label: "Revenue",
      value: formatINR(stats.revenue),
      icon: IndianRupee,
      hint: "Confirmed sales",
    },
    {
      label: "Orders",
      value: String(stats.totalOrders),
      icon: ShoppingBag,
      hint: `${stats.orderCounts.pending} pending`,
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Overview of RN Saree Handlooms inventory & orders."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <AdminCard
                className={
                  card.accent
                    ? "border-[#c9a962]/25 bg-gradient-to-br from-[#4a0e1f]/40 to-[#141414]"
                    : ""
                }
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-white/40">
                      {card.label}
                    </p>
                    <p className="mt-2 font-serif text-2xl text-[#e8d5a3] md:text-3xl">
                      {card.value}
                    </p>
                    <p className="mt-1 text-xs text-white/35">{card.hint}</p>
                  </div>
                  <div className="rounded-lg bg-white/[0.04] p-2.5 ring-1 ring-white/10">
                    <Icon className="h-4 w-4 text-[#c9a962]" />
                  </div>
                </div>
              </AdminCard>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <AdminCard>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-serif text-lg text-[#e8d5a3]">
              <AlertTriangle className="h-4 w-4 text-[#c9a962]" />
              Low stock alerts
            </h3>
            <Link
              href="/admin/products"
              className="flex items-center gap-1 text-xs text-[#c9a962] hover:underline"
            >
              Manage <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {lowStockProducts.length === 0 ? (
            <p className="text-sm text-white/40">All products well stocked.</p>
          ) : (
            <ul className="space-y-3">
              {lowStockProducts.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-3 border-b border-white/5 pb-3 last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-white/85">{p.name}</p>
                    <p className="text-xs text-white/35">{p.category}</p>
                  </div>
                  <span
                    className={
                      p.stock === 0
                        ? "rounded-full bg-red-500/15 px-2 py-0.5 text-xs text-red-200"
                        : "rounded-full bg-amber-500/15 px-2 py-0.5 text-xs text-amber-200"
                    }
                  >
                    {p.stock} left
                  </span>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>

        <AdminCard>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-serif text-lg text-[#e8d5a3]">
              <TrendingUp className="h-4 w-4 text-[#c9a962]" />
              Recent orders
            </h3>
            <Link
              href="/admin/orders"
              className="flex items-center gap-1 text-xs text-[#c9a962] hover:underline"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <ul className="space-y-3">
            {recentOrders.map((o) => (
              <li
                key={o.id}
                className="flex items-center justify-between gap-3 border-b border-white/5 pb-3 last:border-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-white/85">
                    {o.customerName}
                  </p>
                  <p className="text-xs text-white/35">
                    {o.id} · {formatINR(o.total)}
                  </p>
                </div>
                <StatusBadge status={o.status} />
              </li>
            ))}
          </ul>
        </AdminCard>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Link href="/admin/products">
          <AdminCard className="transition hover:border-[#c9a962]/30 hover:bg-[#141414]">
            <Package className="mb-3 h-5 w-5 text-[#c9a962]" />
            <p className="font-medium text-white/90">Manage products</p>
            <p className="mt-1 text-xs text-white/40">
              Add, edit, or remove catalogue items
            </p>
          </AdminCard>
        </Link>
        <Link href="/admin/categories">
          <AdminCard className="transition hover:border-[#c9a962]/30 hover:bg-[#141414]">
            <Tags className="mb-3 h-5 w-5 text-[#c9a962]" />
            <p className="font-medium text-white/90">Categories</p>
            <p className="mt-1 text-xs text-white/40">
              Organise silk, bridal & more
            </p>
          </AdminCard>
        </Link>
        <Link href="/admin/analytics">
          <AdminCard className="transition hover:border-[#c9a962]/30 hover:bg-[#141414]">
            <TrendingUp className="mb-3 h-5 w-5 text-[#c9a962]" />
            <p className="font-medium text-white/90">Analytics</p>
            <p className="mt-1 text-xs text-white/40">
              Sales, stock & category mix
            </p>
          </AdminCard>
        </Link>
      </div>
    </div>
  );
}
