import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { listCustomers } from "@/lib/orders-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const gate = requireAdmin(req);
  if (gate.error) return gate.error;

  try {
    const customers = await listCustomers();
    return NextResponse.json({ ok: true, customers });
  } catch (err) {
    console.error("Customers list failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not load customers from database" },
      { status: 500 }
    );
  }
}
