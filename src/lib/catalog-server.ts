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

export class CatalogDbError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "CatalogDbError";
    if (options?.cause !== undefined) {
      (this as Error & { cause?: unknown }).cause = options.cause;
    }
  }
}

function dbRequiredMessage(action: string) {
  return `Could not ${action}: Postgres is required (set DATABASE_URL). catalog.json is seed/backup only.`;
}

export function parseJsonArray(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function mapProduct(row: {
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

export function mapCategory(row: {
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

export function mapTestimonial(row: {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  image: string | null;
  saree: string | null;
}): Testimonial {
  return {
    id: row.id,
    name: row.name,
    location: row.location,
    rating: row.rating,
    text: row.text,
    image: row.image || "",
    saree: row.saree || "",
  };
}

export function mapBanner(row: {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  link: string | null;
  order: number;
  active: boolean;
}): CatalogBanner {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle || "",
    image: row.image,
    link: row.link || undefined,
    order: row.order,
    active: row.active,
  };
}

function assertDatabaseUrl() {
  if (!process.env.DATABASE_URL) {
    throw new CatalogDbError(
      "DATABASE_URL is not set. Connect Neon or Prisma Postgres before using the store."
    );
  }
}

export async function readCatalog(opts?: {
  forAdmin?: boolean;
}): Promise<CatalogData> {
  assertDatabaseUrl();
  try {
    const [categories, products, testimonials, banners] = await Promise.all([
      prisma.category.findMany({ orderBy: { name: "asc" } }),
      prisma.product.findMany({
        include: { category: true },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.testimonial.findMany({
        where: opts?.forAdmin ? undefined : { published: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.banner.findMany({
        where: opts?.forAdmin ? undefined : { active: true },
        orderBy: { order: "asc" },
      }),
    ]);

    return {
      products: products.map(mapProduct),
      categories:
        categories.length > 0
          ? categories.map(mapCategory)
          : seedCategories.map((c) => ({ ...c })),
      testimonials: testimonials.map(mapTestimonial),
      banners: banners.map(mapBanner),
      updatedAt: new Date().toISOString(),
    };
  } catch (err) {
    if (err instanceof CatalogDbError) throw err;
    console.error("Catalog DB read failed:", err);
    throw new CatalogDbError(dbRequiredMessage("load catalogue"), {
      cause: err,
    });
  }
}

export async function writeCatalog(
  data: Omit<CatalogData, "updatedAt">
): Promise<CatalogData> {
  assertDatabaseUrl();
  const categories = data.categories?.length
    ? data.categories
    : seedCategories.map((c) => ({ ...c }));

  try {
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

    return readCatalog({ forAdmin: true });
  } catch (err) {
    if (err instanceof CatalogDbError) throw err;
    console.error("Catalog DB save failed:", err);
    throw new CatalogDbError(dbRequiredMessage("save catalogue"), {
      cause: err,
    });
  }
}

export async function resolveCategoryId(slug: string | undefined) {
  if (!slug) return null;
  const row = await prisma.category.findUnique({ where: { slug } });
  return row?.id ?? null;
}

export async function uniqueProductSlug(base: string, excludeId?: string) {
  let slug = base;
  let n = 2;
  while (true) {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${base}-${n}`;
    n += 1;
  }
}

export async function uniqueCategorySlug(base: string, excludeId?: string) {
  let slug = base;
  let n = 2;
  while (true) {
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${base}-${n}`;
    n += 1;
  }
}

export function productWriteData(
  p: Omit<Product, "id"> & { id?: string },
  categoryId: string | null
) {
  return {
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
  };
}
