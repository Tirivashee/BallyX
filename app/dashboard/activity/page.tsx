import { BrandName } from "@/components/ui/brand-name";
import { getActivity } from "@/lib/dashboard-data";

// Reads live Postgres data on every request — must not be statically
// prerendered at build time (see README "Database" section).
export const dynamic = "force-dynamic";

export default async function DashboardActivityPage() {
  const activity = await getActivity();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-ink">
          Activity
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          Illustrative demo data — a log of recent account actions.
        </p>
      </div>

      <ol className="space-y-6 border-l border-ink/10 pl-6">
        {activity.map((entry) => (
          <li key={entry.id} className="relative">
            <span className="absolute -left-[29px] top-1 h-2.5 w-2.5 rounded-full bg-teal" />
            <p className="text-xs text-ink-soft">
              {entry.timestamp} · <BrandName text={entry.actor} />
            </p>
            <p className="mt-1 text-sm font-medium text-ink">
              {entry.action}
            </p>
            <p className="text-sm text-ink-soft">{entry.detail}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
