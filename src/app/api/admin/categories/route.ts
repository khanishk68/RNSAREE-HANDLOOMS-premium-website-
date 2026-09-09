import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { mapCategory, uniqueCategorySlug } from "@/lib/catalog-server";
import type { Category } from "@/lib/data";

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
    const body = (await req.json()) as Omit<Category, "id"> & { id?: string };
    if (!body.name?.trim()) {
      return NextResponse.json(
        { ok: false, error: "Name is required" },
        { status: 400 }
      );
    }
    const slug = await uniqueCategorySlug(body.slug || slugFromName(body.name));
    const created = await prisma.category.create({
      data: {
        ...(body.id ? { id: body.id } : {}),
        name: body.name,
        slug,
        description: body.description || null,
        banner: body.banner || null,
      },
    });
    return NextResponse.json({ ok: true, category: mapCategory(created) });
  } catch (err) {
    console.error("Create category failed:", err);
    return NextResponse.json(
      { ok: false, error: "Could not create category" },
      { status: 500 }
    );
  }
}
