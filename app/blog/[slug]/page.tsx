import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { ClosingCTA } from "@/components/sections/home/closing-cta";
import { getPublishedPostBySlug } from "@/lib/blog";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt || undefined,
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <article className="py-20 md:py-28">
        <Container className="max-w-2xl">
          <p className="font-mono-eyebrow text-xs uppercase tracking-wider text-accent-deep">
            {post.authorName} ·{" "}
            {new Date(post.publishedAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {post.title}
          </h1>

          {post.coverImageUrl && (
            <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-lg bg-paper-dim">
              <Image
                src={post.coverImageUrl}
                alt=""
                fill
                unoptimized
                className="object-cover"
                sizes="(min-width: 1024px) 672px, 100vw"
                priority
              />
            </div>
          )}

          {/* content_html is sanitized server-side on every write — see
              lib/actions/blog.ts — before it ever reaches this page. No
              @tailwindcss/typography plugin is installed, so this content
              area is styled by hand via child selectors rather than `prose`. */}
          <div
            className="mt-10 text-base leading-relaxed text-ink-soft [&_a]:text-accent-deep [&_a]:underline [&_a]:underline-offset-4 [&_blockquote]:border-l-2 [&_blockquote]:border-ink/20 [&_blockquote]:pl-4 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-ink/5 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_h2]:mt-8 [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-ink [&_h3]:mt-6 [&_h3]:font-heading [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:tracking-tight [&_h3]:text-ink [&_h4]:mt-4 [&_h4]:font-heading [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-ink [&_hr]:my-8 [&_hr]:border-ink/10 [&_li]:ml-5 [&_ol]:my-4 [&_ol]:list-decimal [&_p]:my-4 [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-ink [&_pre]:p-4 [&_pre]:text-paper [&_ul]:my-4 [&_ul]:list-disc"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </Container>
      </article>

      <ClosingCTA />
    </>
  );
}
