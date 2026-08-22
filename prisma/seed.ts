/**
 * Seed Postgres from data/catalog.json
 * Run: npx tsx prisma/seed.ts
 */
import { readFileSync } from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type CatalogJson = {
  products?: Array<{
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAt?: number;
    category: string;
    fabric: string;
    color: string;
    occasion: string;
    description: string;
    story?: string;
    care?: string[];
    images?: string[];
    tags?: string[];
    stock?: number;
    featured?: boolean;
    bestSeller?: boolean;
    limited?: boolean;
    isNew?: boolean;
  }>;
  categories?: Array<{
    id: string;
    name: string;
    slug: string;
    description?: string;
    banner?: string;
  }>;
  testimonials?: Array<{
    id: string;
    name: string;
    location: string;
    rating: number;
    text: string;
    image?: string;
    saree?: string;
  }>;
  banners?: Array<{
    id: string;
    title: string;
    subtitle?: string;
    image: string;
    link?: string;
    order?: number;
    active?: boolean;
  }>;
};

async function main() {
  const catalogPath = path.join(process.cwd(), "data", "catalog.json");
  const raw = readFileSync(catalogPath, "utf8");
  const data = JSON.parse(raw) as CatalogJson;

  const categories = data.categories ?? [];
  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      create: {
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description || null,
        banner: c.banner || null,
      },
      update: {
        name: c.name,
        description: c.description || null,
        banner: c.banner || null,
      },
    });
  }

  const categoryRows = await prisma.category.findMany();
  const bySlug = new Map(categoryRows.map((c) => [c.slug, c.id]));

  for (const p of data.products ?? []) {
    const categoryId = bySlug.get(p.category) || null;
    await prisma.product.upsert({
      where: { slug: p.slug },
      create: {
        id: p.id,
        name: p.name.trim(),
        slug: p.slug,
        price: p.price,
        compareAt: p.compareAt ?? null,
        fabric: (p.fabric || "").trim(),
        color: p.color,
        occasion: p.occasion,
        description: p.description,
        story: p.story || null,
        care: JSON.stringify(p.care ?? []),
        images: JSON.stringify(p.images ?? []),
        tags: JSON.stringify(p.tags ?? []),
        stock: p.stock ?? 0,
        featured: !!p.featured,
        bestSeller: !!p.bestSeller,
        limited: !!p.limited,
        isNew: !!p.isNew,
        categoryId,
      },
      update: {
        name: p.name.trim(),
        price: p.price,
        compareAt: p.compareAt ?? null,
        fabric: (p.fabric || "").trim(),
        color: p.color,
        occasion: p.occasion,
        description: p.description,
        story: p.story || null,
        care: JSON.stringify(p.care ?? []),
        images: JSON.stringify(p.images ?? []),
        tags: JSON.stringify(p.tags ?? []),
        stock: p.stock ?? 0,
        featured: !!p.featured,
        bestSeller: !!p.bestSeller,
        limited: !!p.limited,
        isNew: !!p.isNew,
        categoryId,
      },
    });
  }

  for (const t of data.testimonials ?? []) {
    await prisma.testimonial.upsert({
      where: { id: t.id },
      create: {
        id: t.id,
        name: t.name,
        location: t.location,
        rating: t.rating,
        text: t.text,
        image: t.image || null,
        saree: t.saree || null,
      },
      update: {
        name: t.name,
        location: t.location,
        rating: t.rating,
        text: t.text,
        image: t.image || null,
        saree: t.saree || null,
      },
    });
  }

  for (const b of data.banners ?? []) {
    await prisma.banner.upsert({
      where: { id: b.id },
      create: {
        id: b.id,
        title: b.title,
        subtitle: b.subtitle || null,
        image: b.image,
        link: b.link || null,
        order: b.order ?? 0,
        active: b.active ?? true,
      },
      update: {
        title: b.title,
        subtitle: b.subtitle || null,
        image: b.image,
        link: b.link || null,
        order: b.order ?? 0,
        active: b.active ?? true,
      },
    });
  }

  const counts = {
    categories: await prisma.category.count(),
    products: await prisma.product.count(),
    testimonials: await prisma.testimonial.count(),
    banners: await prisma.banner.count(),
  };
  console.log("Seed complete:", counts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
