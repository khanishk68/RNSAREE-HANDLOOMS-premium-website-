import { NextRequest, NextResponse } from "next/server";
import {
  listOrders,
  getOrderByCode,
  upsertOrderDb,
  updateOrderStatusDb,
} from "@/lib/orders-server";
import type { AdminOrder, AdminOrderStatus } from "@/lib/admin-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id")?.trim();
    if (id) {
      const order = await getOrderByCode(id);
      if (!order) {
        return NextResponse.json(
          { ok: false, error: "Order not found", order: null },
          { status: 404 }
        );
      }
      return NextResponse.json({ ok: true, order });
    }

    const orders = await listOrders();
    return NextResponse.json({ ok: true, orders });
  } catch (err) {
    console.error("Orders list failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not load orders from database", orders: [] },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const order = body.order as AdminOrder | undefined;
    if (!order?.id) {
      return NextResponse.json(
        { ok: false, error: "Order payload required" },
        { status: 400 }
      );
    }
    if (!order.phone || !order.address || !order.items?.length) {
      return NextResponse.json(
        { ok: false, error: "Phone, address, and items are required for COD" },
        { status: 400 }
      );
    }
    const saved = await upsertOrderDb(order);
    return NextResponse.json({ ok: true, order: saved });
  } catch (err) {
    console.error("Order save failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not save order to database" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const id = body.id as string | undefined;
    const status = body.status as AdminOrderStatus | undefined;
    if (!id || !status) {
      return NextResponse.json(
        { ok: false, error: "id and status required" },
        { status: 400 }
      );
    }
    const updated = await updateOrderStatusDb(id, status);
    if (!updated) {
      return NextResponse.json(
        { ok: false, error: "Order not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true, order: updated });
  } catch (err) {
    console.error("Order status update failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not update order" },
      { status: 500 }
    );
  }
}
