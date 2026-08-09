import type { Metadata } from "next";
import { GalleryClient } from "@/components/gallery/gallery-client";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Luxury visual gallery of RN Saree Handlooms — handloom silks, bridal drapes, and heritage atmosphere.",
};

export default function GalleryPage() {
  return <GalleryClient />;
}
