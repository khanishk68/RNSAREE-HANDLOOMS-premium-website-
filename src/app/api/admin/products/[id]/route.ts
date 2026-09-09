import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import {
  mapProduct,
  parseJsonArray,
  productWriteData,
  resolveCategoryId,
  uniqueProductSlug,
} from "@/lib/catalog-server";
import type { Product } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, ctx: Ctx) {
  const gate = requireAdmin(req);
  if (gate.error) return gate.error;
  const { id } = await ctx.params;

  try {
    const body = (await req.json()) as Partial<Product>;
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Product not found" },
        { status: 404 }
      );
    }

    const slug = body.slug
      ? await uniqueProductSlug(body.slug, id)
      : existing.slug;
    const categoryId =
      body.category !== undefined
        ? await resolveCategoryId(body.category)
        : existing.categoryId;

    const merged = {
      name: body.name ?? existing.name,
      slug,
      price: body.price ?? existing.price,
      compareAt:
        body.compareAt === undefined
          ? existing.compareAt ?? undefined
          : body.compareAt,
      fabric: body.fabric ?? existing.fabric,
      color: body.color ?? existing.color,
      occasion: body.occasion ?? existing.occasion,
      description: body.description ?? existing.description,
      story: body.story ?? existing.story ?? "",
      care: body.care ?? parseJsonArray(existing.care),
      images: body.images ?? parseJsonArray(existing.images),
      tags: body.tags ?? parseJsonArray(existing.tags),
      stock: body.stock ?? existing.stock,
      featured: body.featured ?? existing.featured,
      bestSeller: body.bestSeller ?? existing.bestSeller,
      limited: body.limited ?? existing.limited,
      isNew: body.isNew ?? existing.isNew,
      category: body.category || "",
    };

    const updated = await prisma.product.update({
      where: { id },
      data: productWriteData(merged, categoryId),
      include: { category: true },
    });
    return NextResponse.json({ ok: true, product: mapProduct(updated) });
  } catch (err) {
    console.error("Update product failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const gate = requireAdmin(req);
  if (gate.error) return gate.error;
  const { id } = await ctx.params;

  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Delete product failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not delete product" },
      { status: 500 }
    );
  }
}
