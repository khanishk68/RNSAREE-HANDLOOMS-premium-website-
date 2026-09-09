import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import {
  mapProduct,
  productWriteData,
  resolveCategoryId,
  uniqueProductSlug,
} from "@/lib/catalog-server";
import type { Product } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function slugFromName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(req: NextRequest) {
  const gate = requireAdmin(req);
  if (gate.error) return gate.error;

  try {
    const body = (await req.json()) as Omit<Product, "id"> & { id?: string };
    if (!body.name?.trim() || !body.price) {
      return NextResponse.json(
        { ok: false, error: "Name and price are required" },
        { status: 400 }
      );
    }
    const baseSlug = body.slug || slugFromName(body.name);
    const slug = await uniqueProductSlug(baseSlug);
    const categoryId = await resolveCategoryId(body.category);
    const created = await prisma.product.create({
      data: {
        ...(body.id ? { id: body.id } : {}),
        ...productWriteData({ ...body, slug }, categoryId),
      },
      include: { category: true },
    });
    return NextResponse.json({ ok: true, product: mapProduct(created) });
  } catch (err) {
    console.error("Create product failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not create product" },
      { status: 500 }
    );
  }
}
