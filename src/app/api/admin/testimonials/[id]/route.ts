import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { mapTestimonial } from "@/lib/catalog-server";
import type { Testimonial } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, ctx: Ctx) {
  const gate = requireAdmin(req);
  if (gate.error) return gate.error;
  const { id } = await ctx.params;

  try {
    const body = (await req.json()) as Partial<Testimonial>;
    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Testimonial not found" },
        { status: 404 }
      );
    }
    const updated = await prisma.testimonial.update({
      where: { id },
      data: {
        name: body.name ?? existing.name,
        location: body.location ?? existing.location,
        rating: body.rating ?? existing.rating,
        text: body.text ?? existing.text,
        image: body.image === undefined ? existing.image : body.image || null,
        saree: body.saree === undefined ? existing.saree : body.saree || null,
      },
    });
    return NextResponse.json({
      ok: true,
      testimonial: mapTestimonial(updated),
    });
  } catch (err) {
    console.error("Update testimonial failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not update testimonial" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const gate = requireAdmin(req);
  if (gate.error) return gate.error;
  const { id } = await ctx.params;

  try {
    await prisma.testimonial.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Delete testimonial failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not delete testimonial" },
      { status: 500 }
    );
  }
}
