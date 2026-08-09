import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { CollectionsIndexClient } from "@/components/collections/collections-index-client";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Explore all RN Saree Handlooms collections — Silk, Banarasi, Kanjeevaram, Bridal, Designer & more.",
};

export default function CollectionsPage() {
  return (
    <div className="bg-ivory">
      <PageHero
        eyebrow="Worlds of weave"
        title="Collections"
        subtitle="From temple borders to soft everyday silks — every category a distinct language of craft."
      />
      <CollectionsIndexClient />
    </div>
  );
}
