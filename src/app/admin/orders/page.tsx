"use client";

import { useEffect, useMemo } from "react";
import { useAdminStore, type AdminOrder, type AdminOrderStatus } from "@/lib/admin-store";
import { useAuthStore, useOrderStore } from "@/lib/store";
import { formatINR } from "@/lib/utils";
import {
  AdminCard,
  AdminPageHeader,
  AdminSelect,
  StatusBadge,
} from "@/components/admin/ui";
import { toast } from "sonner";

const STATUSES: AdminOrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminOrdersPage() {
  const adminOrders = useAdminStore((s) => s.orders);
  const updateOrderStatus = useAdminStore((s) => s.updateOrderStatus);
  const upsertOrder = useAdminStore((s) => s.upsertOrder);
  const customerOrders = useOrderStore((s) => s.orders);
  const updateCustomerStatus = useOrderStore((s) => s.updateStatus);
  const user = useAuthStore((s) => s.user);

  // Sync customer checkout orders into admin store
  useEffect(() => {
    for (const o of customerOrders) {
      const mapped: AdminOrder = {
        id: o.id,
        customerName: user?.name || "Store customer",
        customerEmail: user?.email || "customer@rnsareehandlooms.com",
        phone: o.phone,
        address: o.address,
        total: o.total,
        status: o.status,
        createdAt: o.createdAt,
        notes: o.notes,
        items: o.items.map((i) => ({
          name: i.product.name,
          quantity: i.quantity,
          price: i.product.price,
          image: i.product.images[0],
        })),
      };
      upsertOrder(mapped);
    }
  }, [customerOrders, user, upsertOrder]);

  // Load orders saved on the server (local / non-Vercel hosts)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/orders", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled || !Array.isArray(data.orders)) return;
        for (const o of data.orders as AdminOrder[]) {
          upsertOrder(o);
        }
      } catch {
        /* keep local */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [upsertOrder]);

  const orders = useMemo(
    () =>
      [...adminOrders].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [adminOrders]
  );

  function setStatus(id: string, status: AdminOrderStatus) {
    updateOrderStatus(id, status);
    if (customerOrders.some((o) => o.id === id)) {
      updateCustomerStatus(id, status);
    }
    void fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    }).then(async (res) => {
      if (!res.ok) {
        toast.error("Could not save status to database");
        return;
      }
      toast.success(`Order ${id} → ${status}`);
    });
  }

  return (
    <div>
      <AdminPageHeader
        title="Orders"
        description="COD orders from the live storefront — stored in your Postgres database."
      />

      <div className="mb-4 flex flex-wrap gap-2 text-xs text-white/40">
        {STATUSES.map((s) => (
          <span key={s} className="rounded-full bg-white/5 px-3 py-1 capitalize">
            {s}: {orders.filter((o) => o.status === s).length}
          </span>
        ))}
      </div>

      <div className="space-y-3">
        {orders.map((o) => (
          <AdminCard key={o.id}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-white/90">{o.id}</p>
                  <StatusBadge status={o.status} />
                </div>
                <p className="mt-1 text-sm text-white/70">
                  {o.customerName} · {o.customerEmail}
                </p>
                <p className="mt-0.5 text-xs text-white/40">
                  {o.phone} · {o.address}
                </p>
                <ul className="mt-3 space-y-1 text-sm text-white/55">
                  {o.items.map((item, i) => (
                    <li key={i}>
                      {item.quantity}× {item.name} — {formatINR(item.price)}
                    </li>
                  ))}
                </ul>
                {o.notes && (
                  <p className="mt-2 text-xs italic text-[#c9a962]/80">
                    Note: {o.notes}
                  </p>
                )}
                <p className="mt-2 text-xs text-white/30">
                  {new Date(o.createdAt).toLocaleString("en-IN")}
                </p>
              </div>
              <div className="flex w-full flex-col gap-2 sm:w-48">
                <p className="font-serif text-xl text-[#e8d5a3]">
                  {formatINR(o.total)}
                </p>
                <AdminSelect
                  label="Status"
                  value={o.status}
                  onChange={(e) =>
                    setStatus(o.id, e.target.value as AdminOrderStatus)
                  }
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </AdminSelect>
              </div>
            </div>
          </AdminCard>
        ))}
        {orders.length === 0 && (
          <AdminCard>
            <p className="text-sm text-white/40">No orders yet.</p>
          </AdminCard>
        )}
      </div>
    </div>
  );
}
