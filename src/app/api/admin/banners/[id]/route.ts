import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { mapBanner, type CatalogBanner } from "@/lib/catalog-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, ctx: Ctx) {
  const gate = requireAdmin(req);
  if (gate.error) return gate.error;
  const { id } = await ctx.params;

  try {
    const body = (await req.json()) as Partial<CatalogBanner>;
    const existing = await prisma.banner.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Banner not found" },
        { status: 404 }
      );
    }
    const updated = await prisma.banner.update({
      where: { id },
      data: {
        title: body.title ?? existing.title,
        subtitle:
          body.subtitle === undefined
            ? existing.subtitle
            : body.subtitle || null,
        image: body.image ?? existing.image,
        link: body.link === undefined ? existing.link : body.link || null,
        order: body.order ?? existing.order,
        active: body.active ?? existing.active,
      },
    });
    return NextResponse.json({ ok: true, banner: mapBanner(updated) });
  } catch (err) {
    console.error("Update banner failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not update banner" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const gate = requireAdmin(req);
  if (gate.error) return gate.error;
  const { id } = await ctx.params;

  try {
    await prisma.banner.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Delete banner failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not delete banner" },
      { status: 500 }
    );
  }
}
