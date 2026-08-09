import type { Metadata } from "next";
import { categories } from "@/lib/data";
import { CollectionPageClient } from "@/components/collections/collection-page-client";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = true;

export async function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) return { title: "Collection" };
  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  return <CollectionPageClient slug={slug} />;
}
