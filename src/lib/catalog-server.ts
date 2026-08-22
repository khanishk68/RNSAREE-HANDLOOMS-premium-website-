import { promises as fs } from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import {
  categories as seedCategories,
  type Product,
  type Category,
  type Testimonial,
} from "@/lib/data";

export type CatalogBanner = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link?: string;
  order: number;
  active: boolean;
};

export type CatalogData = {
  products: Product[];
  categories: Category[];
  testimonials: Testimonial[];
  banners: CatalogBanner[];
  updatedAt: string | null;
};

const catalogPath = path.join(process.cwd(), "data", "catalog.json");

function parseJsonArray(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function mapProduct(row: {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAt: number | null;
  fabric: string;
  color: string;
  occasion: string;
  description: string;
  story: string | null;
  care: string;
  images: string;
  tags: string;
  stock: number;
  featured: boolean;
  bestSeller: boolean;
  limited: boolean;
  isNew: boolean;
  category: { slug: string } | null;
}): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    price: row.price,
    compareAt: row.compareAt ?? undefined,
    category: row.category?.slug || "",
    fabric: row.fabric,
    color: row.color,
    occasion: row.occasion,
    description: row.description,
    story: row.story || "",
    care: parseJsonArray(row.care),
    images: parseJsonArray(row.images),
    tags: parseJsonArray(row.tags),
    stock: row.stock,
    featured: row.featured,
    bestSeller: row.bestSeller,
    limited: row.limited,
    isNew: row.isNew,
  };
}

function mapCategory(row: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  banner: string | null;
}): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || "",
    banner: row.banner || "",
  };
}

const emptyCatalog = (): CatalogData => ({
  products: [],
  categories: seedCategories.map((c) => ({ ...c })),
  testimonials: [],
  banners: [],
  updatedAt: null,
});

async function readCatalogFile(): Promise<CatalogData> {
  try {
    const raw = await fs.readFile(catalogPath, "utf8");
    const parsed = JSON.parse(raw) as Partial<CatalogData>;
    return {
      products: Array.isArray(parsed.products) ? parsed.products : [],
      categories:
        Array.isArray(parsed.categories) && parsed.categories.length
          ? parsed.categories
          : seedCategories.map((c) => ({ ...c })),
      testimonials: Array.isArray(parsed.testimonials)
        ? parsed.testimonials
        : [],
      banners: Array.isArray(parsed.banners) ? parsed.banners : [],
      updatedAt: parsed.updatedAt ?? null,
    };
  } catch {
    return emptyCatalog();
  }
}

async function writeCatalogFile(
  data: Omit<CatalogData, "updatedAt">
): Promise<CatalogData> {
  const next: CatalogData = {
    products: data.products ?? [],
    categories:
      data.categories?.length > 0
        ? data.categories
        : seedCategories.map((c) => ({ ...c })),
    testimonials: data.testimonials ?? [],
    banners: data.banners ?? [],
    updatedAt: new Date().toISOString(),
  };
  await fs.mkdir(path.dirname(catalogPath), { recursive: true });
  await fs.writeFile(catalogPath, JSON.stringify(next, null, 2), "utf8");
  return next;
}

async function readCatalogDb(): Promise<CatalogData> {
  const [categories, products, testimonials, banners] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      include: { category: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.testimonial.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.banner.findMany({ orderBy: { order: "asc" } }),
  ]);

  return {
    products: products.map(mapProduct),
    categories:
      categories.length > 0
        ? categories.map(mapCategory)
        : seedCategories.map((c) => ({ ...c })),
    testimonials: testimonials.map((t) => ({
      id: t.id,
      name: t.name,
      location: t.location,
      rating: t.rating,
      text: t.text,
      image: t.image || "",
      saree: t.saree || "",
    })),
    banners: banners.map((b) => ({
      id: b.id,
      title: b.title,
      subtitle: b.subtitle || "",
      image: b.image,
      link: b.link || undefined,
      order: b.order,
      active: b.active,
    })),
    updatedAt: new Date().toISOString(),
  };
}

async function writeCatalogDb(
  data: Omit<CatalogData, "updatedAt">
): Promise<CatalogData> {
  const categories = data.categories?.length
    ? data.categories
    : seedCategories.map((c) => ({ ...c }));

  await prisma.$transaction(async (tx) => {
    for (const c of categories) {
      await tx.category.upsert({
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

    const categoryRows = await tx.category.findMany();
    const bySlug = new Map(categoryRows.map((c) => [c.slug, c.id]));
    const incomingProductIds = new Set(
      (data.products ?? []).map((p) => p.id).filter(Boolean)
    );

    const existingProducts = await tx.product.findMany({
      select: { id: true },
    });
    for (const row of existingProducts) {
      if (!incomingProductIds.has(row.id)) {
        await tx.product.delete({ where: { id: row.id } });
      }
    }

    for (const p of data.products ?? []) {
      const categoryId = bySlug.get(p.category) || null;
      await tx.product.upsert({
        where: { slug: p.slug },
        create: {
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          compareAt: p.compareAt ?? null,
          fabric: p.fabric,
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
          name: p.name,
          price: p.price,
          compareAt: p.compareAt ?? null,
          fabric: p.fabric,
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

    const incomingT = new Set((data.testimonials ?? []).map((t) => t.id));
    const existingT = await tx.testimonial.findMany({ select: { id: true } });
    for (const row of existingT) {
      if (!incomingT.has(row.id)) {
        await tx.testimonial.delete({ where: { id: row.id } });
      }
    }
    for (const t of data.testimonials ?? []) {
      await tx.testimonial.upsert({
        where: { id: t.id },
        create: {
          id: t.id,
          name: t.name,
          location: t.location,
          rating: t.rating,
          text: t.text,
          image: t.image || null,
          saree: t.saree || null,
          published: true,
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

    const incomingB = new Set((data.banners ?? []).map((b) => b.id));
    const existingB = await tx.banner.findMany({ select: { id: true } });
    for (const row of existingB) {
      if (!incomingB.has(row.id)) {
        await tx.banner.delete({ where: { id: row.id } });
      }
    }
    for (const b of data.banners ?? []) {
      await tx.banner.upsert({
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
  });

  return readCatalogDb();
}

/** Prefer Postgres; fall back to data/catalog.json when DB is down or empty. */
export async function readCatalog(): Promise<CatalogData> {
  try {
    const fromDb = await readCatalogDb();
    if (fromDb.products.length > 0) return fromDb;
    const fromFile = await readCatalogFile();
    if (fromFile.products.length > 0) return fromFile;
    return fromDb;
  } catch (err) {
    console.warn("Catalog DB unavailable, using catalog.json:", err);
    return readCatalogFile();
  }
}

export async function writeCatalog(
  data: Omit<CatalogData, "updatedAt">
): Promise<CatalogData> {
  try {
    return await writeCatalogDb(data);
  } catch (err) {
    console.warn("Catalog DB save failed, writing catalog.json:", err);
    return writeCatalogFile(data);
  }
}
