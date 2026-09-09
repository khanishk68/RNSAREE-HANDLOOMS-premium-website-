"use client";

import { useEffect, useState } from "react";
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
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/customers", {
          cache: "no-store",
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok || !Array.isArray(data.customers)) {
          if (!cancelled) {
            setError(data.error || "Could not load customers");
          }
          return;
        }
        if (!cancelled) {
          setCustomers(data.customers);
          setError(null);
        }
      } catch {
        if (!cancelled) setError("Could not load customers");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <AdminPageHeader
        title="Customers"
        description="Customers from store orders in Postgres (User records + COD checkout)."
      />

      <div className="mb-4 flex items-center gap-2 text-sm text-white/45">
        <Users className="h-4 w-4 text-[#c9a962]" />
        {customers.length} customers
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-300/80">{error}</p>
      )}

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
          {customers.length === 0 && !error && (
            <p className="p-8 text-center text-sm text-white/40">
              No customers yet.
            </p>
          )}
        </div>
      </AdminCard>
    </div>
  );
}
