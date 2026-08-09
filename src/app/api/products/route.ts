import { NextResponse } from "next/server";
import { readCatalog } from "@/lib/catalog-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const catalog = await readCatalog();
  return NextResponse.json({
    ok: true,
    count: catalog.products.length,
    products: catalog.products,
    updatedAt: catalog.updatedAt,
  });
}
