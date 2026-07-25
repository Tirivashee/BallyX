import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { ClosingCTA } from "@/components/sections/home/closing-cta";
import { getPublishedPosts } from "@/lib/blog";
import { brand } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Blog",
  description: `Updates and writing from ${brand.shortName}.`,
  alternates: { canonical: "/blog" },
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <section className="border-b border-ink/10 py-20 md:py-28">
        <Container>
          <span className="font-mono-eyebrow text-xs uppercase tracking-wider text-accent-deep">
            Blog
          </span>
          <h1 className="mt-4 max-w-2xl font-heading text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Updates from {brand.shortName}
          </h1>
        </Container>
      </section>

      <section className="py-20 md:py-28">
        <Container>
          {posts.length === 0 ? (
            <p className="text-ink-soft">Nothing published yet — check back soon.</p>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="flex flex-col rounded-lg border border-ink/10 bg-paper-soft p-6 transition-colors hover:border-ink/20"
                >
                  {post.coverImageUrl && (
                    <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-md bg-paper-dim">
                      <Image
                        src={post.coverImageUrl}
                        alt=""
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="(min-width: 1024px) 33vw, 100vw"
                      />
                    </div>
                  )}
                  <h2 className="font-heading text-lg font-semibold tracking-tight text-ink">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{post.excerpt}</p>
                  )}
                  <p className="mt-4 text-xs uppercase tracking-wider text-ink-soft/70">
                    {post.authorName} ·{" "}
                    {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>

      <ClosingCTA />
    </>
  );
}
