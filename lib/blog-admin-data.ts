// Read-side queries for /dashboard/blog. See lib/apps-admin-data.ts for
// why these live outside the "use server" lib/actions/blog.ts module.
import { query } from "@/lib/db";

export type AdminBlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string | null;
  contentHtml: string;
  authorName: string;
  status: "draft" | "published";
  publishedAt: string | null;
};

type PostRow = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  cover_image_url: string | null;
  content_html: string;
  author_name: string;
  status: "draft" | "published";
  published_at: string | null;
};

function rowToAdminPost(row: PostRow): AdminBlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    coverImageUrl: row.cover_image_url,
    contentHtml: row.content_html,
    authorName: row.author_name,
    status: row.status,
    publishedAt: row.published_at,
  };
}

export async function getAdminPosts(): Promise<AdminBlogPost[]> {
  const rows = await query<PostRow>(
    `SELECT id, slug, title, excerpt, cover_image_url, content_html, author_name, status, published_at
     FROM blog_posts ORDER BY created_at DESC`,
  );
  return rows.map(rowToAdminPost);
}

export async function getAdminPostById(id: number): Promise<AdminBlogPost | null> {
  const rows = await query<PostRow>(
    `SELECT id, slug, title, excerpt, cover_image_url, content_html, author_name, status, published_at
     FROM blog_posts WHERE id = $1`,
    [id],
  );
  return rows[0] ? rowToAdminPost(rows[0]) : null;
}
