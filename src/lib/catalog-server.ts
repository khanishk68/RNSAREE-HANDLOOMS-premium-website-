import { promises as fs } from "fs";
import path from "path";
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

const emptyCatalog = (): CatalogData => ({
  products: [],
  categories: seedCategories.map((c) => ({ ...c })),
  testimonials: [],
  banners: [],
  updatedAt: null,
});

export async function readCatalog(): Promise<CatalogData> {
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

export async function writeCatalog(
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
