import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getAdminApps } from "@/lib/apps-admin-data";
import { getAdminPosts } from "@/lib/blog-admin-data";
import { getRecentSends, getSubscriberCount } from "@/lib/newsletter-admin-data";

export const dynamic = "force-dynamic";

export default async function DashboardOverviewPage() {
  const [apps, posts, subscriberCount, sends] = await Promise.all([
    getAdminApps(),
    getAdminPosts(),
    getSubscriberCount(),
    getRecentSends(),
  ]);

  const publishedApps = apps.filter((a) => a.published).length;
  const publishedPosts = posts.filter((p) => p.status === "published").length;
  const lastSend = sends[0];

  const stats = [
    { label: "Apps published", value: `${publishedApps} / ${apps.length}` },
    { label: "Posts published", value: `${publishedPosts} / ${posts.length}` },
    { label: "Newsletter subscribers", value: String(subscriberCount) },
    {
      label: "Last newsletter send",
      value: lastSend ? `${lastSend.sentCount}/${lastSend.totalRecipients} sent` : "None yet",
    },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-ink">Overview</h1>
        <p className="mt-1 text-sm text-ink-soft">Site content and email at a glance.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <p className="font-mono-eyebrow text-xs uppercase tracking-wider text-ink-soft/70">
              {stat.label}
            </p>
            <p className="mt-2 font-heading text-2xl font-semibold text-ink">{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-medium tracking-tight text-ink">
              Recent apps
            </h2>
            <Link
              href="/dashboard/apps"
              className="inline-flex items-center gap-1 text-sm font-medium text-accent-deep hover:underline"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {apps.length === 0 && <p className="text-sm text-ink-soft">No apps added yet.</p>}
            {apps.slice(0, 4).map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-ink/10 bg-paper-soft p-4"
              >
                <p className="text-sm font-medium text-ink">{app.name}</p>
                <Badge variant={app.published ? "teal" : "outline"}>
                  {app.published ? "Published" : "Draft"}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-medium tracking-tight text-ink">
              Recent posts
            </h2>
            <Link
              href="/dashboard/blog"
              className="inline-flex items-center gap-1 text-sm font-medium text-accent-deep hover:underline"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {posts.length === 0 && <p className="text-sm text-ink-soft">No posts yet.</p>}
            {posts.slice(0, 4).map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-ink/10 bg-paper-soft p-4"
              >
                <p className="text-sm font-medium text-ink">{post.title}</p>
                <Badge variant={post.status === "published" ? "teal" : "outline"}>
                  {post.status === "published" ? "Published" : "Draft"}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
