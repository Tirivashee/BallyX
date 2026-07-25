"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sanitizeHtml from "sanitize-html";
import { z } from "zod";

import { query } from "@/lib/db";

export type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

// The real trust boundary: a direct POST to this action must be safe
// regardless of what the Tiptap client sent (see components/dashboard/blog/
// blog-editor.tsx) — this is the site's first user-generated content, and
// next.config.ts's CSP was deliberately strict specifically because there
// was none before.
const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "h2",
    "h3",
    "h4",
    "p",
    "br",
    "strong",
    "em",
    "s",
    "ul",
    "ol",
    "li",
    "blockquote",
    "code",
    "pre",
    "a",
    "img",
    "hr",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    img: ["src", "alt"],
  },
  allowedSchemes: ["http", "https", "mailto"],
};

function sanitize(html: string): string {
  return sanitizeHtml(html, SANITIZE_OPTIONS);
}

const PostSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only."),
  title: z.string().trim().min(1, "Title is required.").max(300),
  excerpt: z.string().trim().max(500).optional().or(z.literal("")),
  coverImageUrl: z.string().trim().max(2000).optional().or(z.literal("")),
  contentHtml: z.string(),
  authorName: z.string().trim().max(200).optional().or(z.literal("")),
  status: z.enum(["draft", "published"]),
});

function parseForm(formData: FormData) {
  return PostSchema.safeParse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    excerpt: formData.get("excerpt"),
    coverImageUrl: formData.get("coverImageUrl"),
    contentHtml: formData.get("contentHtml"),
    authorName: formData.get("authorName"),
    status: formData.get("status"),
  });
}

export async function createPost(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Please check the highlighted fields.",
    };
  }
  const d = parsed.data;
  const contentHtml = sanitize(d.contentHtml);

  try {
    await query(
      `INSERT INTO blog_posts
         (slug, title, excerpt, cover_image_url, content_html, author_name, status, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, CASE WHEN $7 = 'published' THEN now() ELSE NULL END)`,
      [
        d.slug,
        d.title,
        d.excerpt || "",
        d.coverImageUrl || null,
        contentHtml,
        d.authorName || "BallyX Team",
        d.status,
      ],
    );
  } catch (err) {
    console.error("Failed to create post:", err);
    return { status: "error", message: "Could not save — is the slug already used?" };
  }

  revalidatePath("/dashboard/blog");
  revalidatePath("/blog");
  redirect("/dashboard/blog");
}

export async function updatePost(
  id: number,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Please check the highlighted fields.",
    };
  }
  const d = parsed.data;
  const contentHtml = sanitize(d.contentHtml);

  try {
    await query(
      `UPDATE blog_posts SET
         slug = $1, title = $2, excerpt = $3, cover_image_url = $4, content_html = $5,
         author_name = $6, status = $7,
         published_at = CASE WHEN $7 = 'published' THEN COALESCE(blog_posts.published_at, now()) ELSE NULL END,
         updated_at = now()
       WHERE id = $8`,
      [
        d.slug,
        d.title,
        d.excerpt || "",
        d.coverImageUrl || null,
        contentHtml,
        d.authorName || "BallyX Team",
        d.status,
        id,
      ],
    );
  } catch (err) {
    console.error("Failed to update post:", err);
    return { status: "error", message: "Could not save — is the slug already used?" };
  }

  revalidatePath("/dashboard/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${d.slug}`);
  redirect("/dashboard/blog");
}

export async function deletePost(id: number): Promise<void> {
  await query(`DELETE FROM blog_posts WHERE id = $1`, [id]);
  revalidatePath("/dashboard/blog");
  revalidatePath("/blog");
}
