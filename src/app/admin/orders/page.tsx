"use client";

import { useEffect } from "react";
import {
  useAdminStore,
  type AdminOrderStatus,
} from "@/lib/admin-store";
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
  const orders = useAdminStore((s) => s.orders);
  const updateOrderStatus = useAdminStore((s) => s.updateOrderStatus);
  const loadOrders = useAdminStore((s) => s.loadOrders);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const sorted = [...orders].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  async function setStatus(id: string, status: AdminOrderStatus) {
    try {
      await updateOrderStatus(id, status);
      toast.success(`Order ${id} → ${status}`);
    } catch {
      toast.error("Could not save status to database");
      await loadOrders();
    }
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
            {s}: {sorted.filter((o) => o.status === s).length}
          </span>
        ))}
      </div>

      <div className="space-y-3">
        {sorted.map((o) => (
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
        {sorted.length === 0 && (
          <AdminCard>
            <p className="text-sm text-white/40">No orders yet.</p>
          </AdminCard>
        )}
      </div>
    </div>
  );
}
