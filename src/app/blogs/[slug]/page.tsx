import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogs } from "@/lib/data";
import { Reveal } from "@/components/ui/reveal";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return blogs.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogs.find((b) => b.slug === slug);
  if (!post) return { title: "Journal" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
      type: "article",
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = blogs.find((b) => b.slug === slug);
  if (!post) notFound();

  const paragraphs = post.content
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const related = blogs.filter((b) => b.id !== post.id).slice(0, 2);

  return (
    <>
      <article>
        <header className="relative min-h-[60vh] flex items-end overflow-hidden bg-maroon-deep text-pearl">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-matte via-maroon-deep/70 to-maroon-deep/20" />
          <div className="relative section-pad w-full max-w-[900px] mx-auto pb-14 md:pb-20">
            <Reveal>
              <p className="text-[11px] tracking-[0.35em] uppercase text-gold mb-5">
                {formatDate(post.date)} · {post.author}
              </p>
              <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.05] text-balance">
                {post.title}
              </h1>
              <p className="mt-6 text-pearl/60 text-lg md:text-xl leading-relaxed max-w-2xl">
                {post.excerpt}
              </p>
            </Reveal>
          </div>
        </header>

        <div className="bg-ivory">
          <div className="section-pad max-w-[720px] mx-auto">
            <Reveal>
              <div className="h-px w-24 bg-gradient-to-r from-gold to-transparent mb-12" />
              <div className="space-y-6">
                {paragraphs.map((p, i) => (
                  <p
                    key={i}
                    className="font-serif text-xl md:text-2xl text-charcoal/90 leading-relaxed"
                  >
                    {p}
                  </p>
                ))}
                <p className="font-serif text-xl md:text-2xl text-charcoal/90 leading-relaxed">
                  At RN Saree Handlooms, we hold that every thread carries
                  culture. May this essay deepen your eye for craft — and the
                  quiet splendour of Indian handloom.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.15} className="mt-16 pt-10 border-t border-gold/25">
              <Link
                href="/blogs"
                className="text-[11px] tracking-[0.28em] uppercase text-maroon hover:text-maroon-soft transition-colors"
              >
                ← Back to Journal
              </Link>
            </Reveal>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-cream">
          <div className="section-pad max-w-[1400px] mx-auto">
            <Reveal>
              <p className="text-[11px] tracking-[0.35em] uppercase text-maroon mb-4 text-center">
                Continue Reading
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-charcoal text-center mb-12">
                More from the atelier
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {related.map((r, i) => (
                <Reveal key={r.id} delay={i * 0.1}>
                  <Link href={`/blogs/${r.slug}`} className="group block">
                    <div className="relative aspect-[16/10] overflow-hidden img-reveal mb-5">
                      <Image
                        src={r.image}
                        alt={r.title}
                        fill
                        sizes="(max-width:768px) 100vw, 40vw"
                        className="object-cover"
                      />
                    </div>
                    <h3 className="font-serif text-2xl text-charcoal group-hover:text-maroon transition-colors">
                      {r.title}
                    </h3>
                    <p className="mt-2 text-muted text-sm">{r.excerpt}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
