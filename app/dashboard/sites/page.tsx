import { Badge } from "@/components/ui/badge";
import { mockSites } from "@/lib/dashboard-mock";

export default function DashboardSitesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-ink">
          Sites
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          Illustrative demo data — sites and plans shown here are examples,
          not real accounts.
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-ink/10 bg-paper-soft">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-xs uppercase tracking-wider text-ink-soft/70">
              <th className="px-4 py-3 font-medium">Site</th>
              <th className="px-4 py-3 font-medium">Domain</th>
              <th className="px-4 py-3 font-medium">Plan</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Last deploy</th>
            </tr>
          </thead>
          <tbody>
            {mockSites.map((site) => (
              <tr key={site.id} className="border-b border-ink/10 last:border-b-0">
                <td className="px-4 py-3 font-medium text-ink">{site.name}</td>
                <td className="px-4 py-3 text-ink-soft">{site.domain}</td>
                <td className="px-4 py-3 text-ink-soft">{site.plan}</td>
                <td className="px-4 py-3">
                  <Badge variant={site.status === "Live" ? "teal" : "outline"}>
                    {site.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-ink-soft">{site.lastDeploy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
