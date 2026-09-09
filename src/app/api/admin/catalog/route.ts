import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { CatalogDbError, readCatalog } from "@/lib/catalog-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const gate = requireAdmin(req);
  if (gate.error) return gate.error;

  try {
    const catalog = await readCatalog({ forAdmin: true });
    return NextResponse.json(
      { ok: true, catalog },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (err) {
    console.error("Admin catalog read failed:", err);
    const message =
      err instanceof CatalogDbError
        ? err.message
        : "Could not load catalogue from database";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
