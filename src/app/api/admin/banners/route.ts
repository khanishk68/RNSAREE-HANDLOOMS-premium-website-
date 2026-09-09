import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { mapBanner, type CatalogBanner } from "@/lib/catalog-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const gate = requireAdmin(req);
  if (gate.error) return gate.error;

  try {
    const body = (await req.json()) as Omit<CatalogBanner, "id"> & {
      id?: string;
    };
    if (!body.title?.trim() || !body.image?.trim()) {
      return NextResponse.json(
        { ok: false, error: "Title and image are required" },
        { status: 400 }
      );
    }
    const created = await prisma.banner.create({
      data: {
        ...(body.id ? { id: body.id } : {}),
        title: body.title,
        subtitle: body.subtitle || null,
        image: body.image,
        link: body.link || null,
        order: body.order ?? 0,
        active: body.active ?? true,
      },
    });
    return NextResponse.json({ ok: true, banner: mapBanner(created) });
  } catch (err) {
    console.error("Create banner failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not create banner" },
      { status: 500 }
    );
  }
}
