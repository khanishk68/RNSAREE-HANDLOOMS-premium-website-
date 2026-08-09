"use client";

import { useMemo } from "react";
import { useAdminStore } from "@/lib/admin-store";
import { useAuthStore, useOrderStore } from "@/lib/store";
import { formatINR } from "@/lib/utils";
import { AdminCard, AdminPageHeader } from "@/components/admin/ui";
import { Users } from "lucide-react";

type CustomerRow = {
  key: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  spent: number;
  lastOrder: string;
};

export default function AdminCustomersPage() {
  const adminOrders = useAdminStore((s) => s.orders);
  const customerOrders = useOrderStore((s) => s.orders);
  const user = useAuthStore((s) => s.user);

  const customers = useMemo(() => {
    const map = new Map<string, CustomerRow>();

    for (const o of adminOrders) {
      const key = o.customerEmail.toLowerCase();
      const existing = map.get(key);
      if (existing) {
        existing.orders += 1;
        existing.spent += o.status === "cancelled" ? 0 : o.total;
        if (new Date(o.createdAt) > new Date(existing.lastOrder)) {
          existing.lastOrder = o.createdAt;
          existing.phone = o.phone || existing.phone;
        }
      } else {
        map.set(key, {
          key,
          name: o.customerName,
          email: o.customerEmail,
          phone: o.phone,
          orders: 1,
          spent: o.status === "cancelled" ? 0 : o.total,
          lastOrder: o.createdAt,
        });
      }
    }

    // Include logged-in auth user if they have checkout orders
    if (user && customerOrders.length) {
      const key = user.email.toLowerCase();
      const existing = map.get(key);
      const spent = customerOrders
        .filter((o) => o.status !== "cancelled")
        .reduce((s, o) => s + o.total, 0);
      if (existing) {
        // already counted via sync; ensure name
        existing.name = user.name || existing.name;
        existing.phone = user.phone || existing.phone;
      } else {
        map.set(key, {
          key,
          name: user.name,
          email: user.email,
          phone: user.phone || customerOrders[0]?.phone || "—",
          orders: customerOrders.length,
          spent,
          lastOrder: customerOrders[0]?.createdAt || new Date().toISOString(),
        });
      }
    } else if (user) {
      const key = user.email.toLowerCase();
      if (!map.has(key)) {
        map.set(key, {
          key,
          name: user.name,
          email: user.email,
          phone: user.phone || "—",
          orders: 0,
          spent: 0,
          lastOrder: "—",
        });
      }
    }

    return [...map.values()].sort((a, b) => b.spent - a.spent);
  }, [adminOrders, customerOrders, user]);

  return (
    <div>
      <AdminPageHeader
        title="Customers"
        description="Customers from store orders and account sign-ins."
      />

      <div className="mb-4 flex items-center gap-2 text-sm text-white/45">
        <Users className="h-4 w-4 text-[#c9a962]" />
        {customers.length} customers
      </div>

      <AdminCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/5 text-xs uppercase tracking-wider text-white/35">
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Orders</th>
                <th className="px-4 py-3 font-medium">Spent</th>
                <th className="px-4 py-3 font-medium">Last order</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr
                  key={c.key}
                  className="border-b border-white/[0.04] hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-white/90">{c.name}</p>
                    <p className="text-xs text-white/35">{c.email}</p>
                  </td>
                  <td className="px-4 py-3 text-white/60">{c.phone}</td>
                  <td className="px-4 py-3 text-white/70">{c.orders}</td>
                  <td className="px-4 py-3 text-[#e8d5a3]">
                    {formatINR(c.spent)}
                  </td>
                  <td className="px-4 py-3 text-xs text-white/40">
                    {c.lastOrder === "—"
                      ? "—"
                      : new Date(c.lastOrder).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {customers.length === 0 && (
            <p className="p-8 text-center text-sm text-white/40">
              No customers yet.
            </p>
          )}
        </div>
      </AdminCard>
    </div>
  );
}
