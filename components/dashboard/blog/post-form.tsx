"use client";

import { useActionState, useState } from "react";

import { BlogEditor } from "@/components/dashboard/blog/blog-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { ActionState } from "@/lib/actions/blog";
import type { AdminBlogPost } from "@/lib/blog-admin-data";

const initialState: ActionState = { status: "idle" };

export function PostForm({
  post,
  action,
  submitLabel,
}: {
  post?: AdminBlogPost;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [published, setPublished] = useState(post?.status === "published");
  const [contentHtml, setContentHtml] = useState(post?.contentHtml ?? "");

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <input type="hidden" name="status" value={published ? "published" : "draft"} />
      <input type="hidden" name="contentHtml" value={contentHtml} />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" defaultValue={post?.title} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            defaultValue={post?.slug}
            placeholder="my-post-title"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          name="excerpt"
          defaultValue={post?.excerpt}
          rows={2}
          placeholder="Shown on the /blog listing card."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="coverImageUrl">Cover image URL</Label>
        <Input
          id="coverImageUrl"
          name="coverImageUrl"
          defaultValue={post?.coverImageUrl ?? ""}
          placeholder="https://…"
        />
        <p className="text-xs text-ink-soft">
          Optional. A real upload widget lands once Vercel Blob is provisioned.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="authorName">Author name</Label>
        <Input
          id="authorName"
          name="authorName"
          defaultValue={post?.authorName ?? "BallyX Team"}
        />
      </div>

      <div className="space-y-2">
        <Label>Content</Label>
        <BlogEditor content={contentHtml} onChange={setContentHtml} />
      </div>

      <div className="flex items-center justify-between gap-4 rounded-md border border-ink/10 bg-paper-soft p-4">
        <div>
          <p className="text-sm font-medium text-ink">Published</p>
          <p className="text-xs text-ink-soft">Visible on the public /blog page.</p>
        </div>
        <Switch checked={published} onCheckedChange={setPublished} aria-label="Published" />
      </div>

      {state.status === "error" && state.message && (
        <p className="text-sm text-accent-deep" role="alert">
          {state.message}
        </p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
