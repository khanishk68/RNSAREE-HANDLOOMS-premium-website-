"use client";

import { ProductDetail } from "@/components/product/product-detail";
import { useCatalog } from "@/lib/use-catalog";

export function ProductPageClient({ slug }: { slug: string }) {
  const { getProductBySlug, getRelatedProducts, hydrated } = useCatalog();
  const product = getProductBySlug(slug);

  if (!product) {
    return (
      <div className="min-h-[60vh] pt-32 flex flex-col items-center justify-center gap-4 px-6 text-center">
        {!hydrated ? (
          <div className="w-10 h-10 rounded-full border border-gold/40 border-t-gold animate-spin" />
        ) : (
          <>
            <p className="font-serif text-3xl text-charcoal">Saree not found</p>
            <a href="/shop" className="luxury-btn">
              Back to shop
            </a>
          </>
        )}
      </div>
    );
  }

  const related = getRelatedProducts(product, 4);
  return <ProductDetail product={product} related={related} />;
}
