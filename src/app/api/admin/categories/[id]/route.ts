import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { mapCategory, uniqueCategorySlug } from "@/lib/catalog-server";
import type { Category } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, ctx: Ctx) {
  const gate = requireAdmin(req);
  if (gate.error) return gate.error;
  const { id } = await ctx.params;

  try {
    const body = (await req.json()) as Partial<Category>;
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Category not found" },
        { status: 404 }
      );
    }
    const slug = body.slug
      ? await uniqueCategorySlug(body.slug, id)
      : existing.slug;
    const updated = await prisma.category.update({
      where: { id },
      data: {
        name: body.name ?? existing.name,
        slug,
        description:
          body.description === undefined
            ? existing.description
            : body.description || null,
        banner: body.banner === undefined ? existing.banner : body.banner || null,
      },
    });
    return NextResponse.json({ ok: true, category: mapCategory(updated) });
  } catch (err) {
    console.error("Update category failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const gate = requireAdmin(req);
  if (gate.error) return gate.error;
  const { id } = await ctx.params;

  try {
    await prisma.product.updateMany({
      where: { categoryId: id },
      data: { categoryId: null },
    });
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Delete category failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not delete category" },
      { status: 500 }
    );
  }
}
