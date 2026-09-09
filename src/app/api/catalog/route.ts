import { NextRequest, NextResponse } from "next/server";
import { CatalogDbError, readCatalog } from "@/lib/catalog-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const catalog = await readCatalog();
    return NextResponse.json(
      { ok: true, catalog },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (err) {
    console.error("Catalog read failed:", err);
    const message =
      err instanceof CatalogDbError
        ? err.message
        : "Could not load catalogue from database";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { requireAdmin } = await import("@/lib/admin-auth");
  const { writeCatalog } = await import("@/lib/catalog-server");
  const gate = requireAdmin(req);
  if (gate.error) return gate.error;

  try {
    const body = await req.json();
    const catalog = await writeCatalog({
      products: body.products ?? [],
      categories: body.categories ?? [],
      testimonials: body.testimonials ?? [],
      banners: body.banners ?? [],
    });
    return NextResponse.json({ ok: true, catalog });
  } catch (err) {
    console.error("Catalog save failed:", err);
    const message =
      err instanceof CatalogDbError
        ? err.message
        : "Could not save catalogue to the database. Check DATABASE_URL and try again.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
