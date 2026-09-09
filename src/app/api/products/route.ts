import { NextResponse } from "next/server";
import { readCatalog } from "@/lib/catalog-server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const catalog = await readCatalog();
    return NextResponse.json({
      ok: true,
      count: catalog.products.length,
      products: catalog.products,
      updatedAt: catalog.updatedAt,
    });
  } catch (err) {
    console.error("Products API failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not load products from database" },
      { status: 500 }
    );
  }
}
