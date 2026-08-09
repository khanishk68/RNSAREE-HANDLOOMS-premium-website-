import { Hero } from "@/components/home/hero";
import { BrandStory } from "@/components/home/brand-story";
import { WhyRNHandlooms } from "@/components/home/why-handlooms";
import { CollectionsGrid } from "@/components/home/collections-grid";
import { FeaturedProducts } from "@/components/home/featured-products";
import { TestimonialsSection } from "@/components/home/testimonials";
import { InstagramGallery } from "@/components/home/instagram-gallery";
import { Newsletter } from "@/components/home/newsletter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandStory />
      <WhyRNHandlooms />
      <CollectionsGrid />
      <FeaturedProducts />
      <TestimonialsSection />
      <InstagramGallery />
      <Newsletter />
    </>
  );
}
