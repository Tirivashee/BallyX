import type { Metadata } from "next";

import { PostForm } from "@/components/dashboard/blog/post-form";
import { createPost } from "@/lib/actions/blog";

export const metadata: Metadata = {
  title: "New post",
  robots: { index: false, follow: false },
};

export default function NewPostPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold tracking-tight text-ink">New post</h1>
      <div className="mt-8">
        <PostForm action={createPost} submitLabel="Create post" />
      </div>
    </div>
  );
}
