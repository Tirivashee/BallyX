// Public reads for /blog + /blog/[slug]. Only ever returns status='published'
// rows — draft posts must never leak onto the public site.
import { query } from "@/lib/db";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string | null;
  contentHtml: string;
  authorName: string;
  publishedAt: string;
};

type PostRow = {
  slug: string;
  title: string;
  excerpt: string;
  cover_image_url: string | null;
  content_html: string;
  author_name: string;
  published_at: string;
};

function rowToPost(row: PostRow): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    coverImageUrl: row.cover_image_url,
    contentHtml: row.content_html,
    authorName: row.author_name,
    publishedAt: row.published_at,
  };
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const rows = await query<PostRow>(
    `SELECT slug, title, excerpt, cover_image_url, content_html, author_name, published_at
     FROM blog_posts WHERE status = 'published' ORDER BY published_at DESC`,
  );
  return rows.map(rowToPost);
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogPost | null> {
  const rows = await query<PostRow>(
    `SELECT slug, title, excerpt, cover_image_url, content_html, author_name, published_at
     FROM blog_posts WHERE slug = $1 AND status = 'published'`,
    [slug],
  );
  return rows[0] ? rowToPost(rows[0]) : null;
}
