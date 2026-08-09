import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { ShopCatalog } from "@/components/shop/shop-catalog";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Shop luxury handloom sarees from RN Saree Handlooms — silk, Banarasi, Kanjeevaram, bridal and more. Cash on Delivery.",
};

type Props = {
  searchParams: Promise<{ category?: string; search?: string }>;
};

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <div className="bg-ivory">
      <PageHero
        eyebrow="Atelier"
        title="Shop"
        subtitle="Discover pure handloom sarees — curated for weddings, festivals, and everyday grace."
        tall
      />
      <div className="section-pad max-w-[1400px] mx-auto">
        <ShopCatalog
          initialCategory={params.category || ""}
          initialSearch={params.search || ""}
        />
      </div>
    </div>
  );
}
