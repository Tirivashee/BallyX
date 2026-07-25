import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PostForm } from "@/components/dashboard/blog/post-form";
import { updatePost } from "@/lib/actions/blog";
import { getAdminPostById } from "@/lib/blog-admin-data";

export const metadata: Metadata = {
  title: "Edit post",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getAdminPostById(Number(id));
  if (!post) notFound();

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold tracking-tight text-ink">
        Edit {post.title}
      </h1>
      <div className="mt-8">
        <PostForm post={post} action={updatePost.bind(null, post.id)} submitLabel="Save changes" />
      </div>
    </div>
  );
}
