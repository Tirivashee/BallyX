import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deletePost } from "@/lib/actions/blog";
import { getAdminPosts } from "@/lib/blog-admin-data";

export const metadata: Metadata = {
  title: "Blog",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function DashboardBlogPage() {
  const posts = await getAdminPosts();

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-ink">Blog</h1>
          <p className="mt-1 text-sm text-ink-soft">Write and publish posts to /blog.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/blog/new">New post</Link>
        </Button>
      </div>

      <div className="mt-8 space-y-3">
        {posts.length === 0 && <p className="text-sm text-ink-soft">No posts yet.</p>}

        {posts.map((post) => (
          <div
            key={post.id}
            className="flex items-center justify-between gap-4 rounded-md border border-ink/10 bg-paper-soft p-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-ink">{post.title}</p>
                <Badge variant={post.status === "published" ? "teal" : "outline"}>
                  {post.status === "published" ? "Published" : "Draft"}
                </Badge>
              </div>
              <p className="text-xs text-ink-soft">/blog/{post.slug}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/dashboard/blog/${post.id}`}>Edit</Link>
              </Button>
              <form action={deletePost.bind(null, post.id)}>
                <Button type="submit" variant="ghost" size="sm">
                  Delete
                </Button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
