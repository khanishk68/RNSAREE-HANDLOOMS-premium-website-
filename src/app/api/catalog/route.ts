import { NextRequest, NextResponse } from "next/server";
import { readCatalog, writeCatalog } from "@/lib/catalog-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const catalog = await readCatalog();
    return NextResponse.json({ ok: true, catalog });
  } catch (err) {
    console.error("Catalog read failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not load catalogue from database" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
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
    return NextResponse.json(
      {
        ok: false,
        error:
          "Could not save catalogue to the database. Check DATABASE_URL and try again.",
      },
      { status: 500 }
    );
  }
}
