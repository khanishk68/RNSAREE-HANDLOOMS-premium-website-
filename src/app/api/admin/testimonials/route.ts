import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { mapTestimonial } from "@/lib/catalog-server";
import type { Testimonial } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const gate = requireAdmin(req);
  if (gate.error) return gate.error;

  try {
    const body = (await req.json()) as Omit<Testimonial, "id"> & { id?: string };
    if (!body.name?.trim() || !body.text?.trim()) {
      return NextResponse.json(
        { ok: false, error: "Name and text are required" },
        { status: 400 }
      );
    }
    const created = await prisma.testimonial.create({
      data: {
        ...(body.id ? { id: body.id } : {}),
        name: body.name,
        location: body.location,
        rating: body.rating ?? 5,
        text: body.text,
        image: body.image || null,
        saree: body.saree || null,
        published: true,
      },
    });
    return NextResponse.json({
      ok: true,
      testimonial: mapTestimonial(created),
    });
  } catch (err) {
    console.error("Create testimonial failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not create testimonial" },
      { status: 500 }
    );
  }
}
