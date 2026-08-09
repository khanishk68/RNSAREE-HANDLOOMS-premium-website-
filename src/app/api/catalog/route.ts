import { NextRequest, NextResponse } from "next/server";
import { readCatalog, writeCatalog } from "@/lib/catalog-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const catalog = await readCatalog();
  return NextResponse.json({ ok: true, catalog });
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
          "Could not save catalogue. On Vercel’s read-only filesystem, publish locally then redeploy, or connect a database.",
      },
      { status: 500 }
    );
  }
}
