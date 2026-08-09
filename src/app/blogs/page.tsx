import type { Metadata } from "next";
import Link from "next/link";
import { blogs } from "@/lib/data";
import { PageHero, EmptyCatalog } from "@/components/ui/page-hero";
import { Reveal, SectionHeading } from "@/components/ui/reveal";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "The RN Saree Handlooms journal — essays on handloom craft, bridal silk, and living tradition.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogsPage() {
  return (
    <>
      <PageHero
        eyebrow="Atelier Notes"
        title="Journal"
        subtitle="Essays on craft, culture, and the sarees that carry them."
      />

      <section className="bg-ivory">
        <div className="section-pad max-w-[1400px] mx-auto">
          {blogs.length === 0 ? (
            <EmptyCatalog
              title="Journal coming soon"
              subtitle="Our atelier notes will appear here. Meanwhile, explore heritage and collections."
              ctaHref="/heritage"
              ctaLabel="Our Heritage"
            />
          ) : (
            <>
              <SectionHeading
                eyebrow="From the House"
                title="Stories worth reading slowly"
                subtitle="Curated reflections from the RN atelier."
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                {blogs.map((post, i) => (
                  <Reveal key={post.id} delay={i * 0.1}>
                    <article className="group flex flex-col h-full">
                      <Link
                        href={`/blogs/${post.slug}`}
                        className="relative aspect-[4/5] overflow-hidden img-reveal block"
                      >
                        {post.image ? (
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            sizes="(max-width:768px) 100vw, 33vw"
                            className="object-cover"
                            unoptimized={post.image.startsWith("/uploads/")}
                          />
                        ) : (
                          <div className="absolute inset-0 bg-maroon-deep" />
                        )}
                      </Link>
                      <div className="mt-6 flex flex-col flex-1">
                        <p className="text-[10px] tracking-[0.3em] uppercase text-maroon">
                          {formatDate(post.date)} · {post.author}
                        </p>
                        <h2 className="font-serif text-2xl md:text-3xl text-charcoal mt-3 leading-snug group-hover:text-maroon transition-colors">
                          <Link href={`/blogs/${post.slug}`}>{post.title}</Link>
                        </h2>
                        <p className="mt-4 text-muted text-sm md:text-base leading-relaxed flex-1">
                          {post.excerpt}
                        </p>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
