"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { mockInvoices } from "@/lib/dashboard-mock";
import { hosting } from "@/lib/site-config";

const currentPlan = hosting.plans.find((p) => p.id === "standard")!;

export default function DashboardBillingPage() {
  const [autoPay, setAutoPay] = useState(true);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-ink">
          Billing
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          Illustrative demo data — no real payment method is stored or
          charged here.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-heading text-lg font-medium tracking-tight text-ink">
            Current plan
          </h2>
          <p className="mt-1 text-sm text-ink-soft">
            {currentPlan.name} — {currentPlan.tagline}
          </p>
          <p className="mt-4 font-heading text-2xl font-semibold text-ink">
            {currentPlan.price}
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="font-heading text-lg font-medium tracking-tight text-ink">
            Payment method
          </h2>
          <p className="mt-1 text-sm text-ink-soft">Visa •••• 4242 (demo)</p>
          <div className="mt-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-ink">Auto-pay</p>
              <p className="text-xs text-ink-soft">
                Automatically charge this card each billing cycle.
              </p>
            </div>
            <Switch
              checked={autoPay}
              onCheckedChange={setAutoPay}
              aria-label="Auto-pay"
            />
          </div>
        </Card>
      </div>

      <div>
        <h2 className="font-heading text-lg font-medium tracking-tight text-ink">
          Invoices
        </h2>
        <div className="mt-4 overflow-x-auto rounded-lg border border-ink/10 bg-paper-soft">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-xs uppercase tracking-wider text-ink-soft/70">
                <th className="px-4 py-3 font-medium">Invoice</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-ink/10 last:border-b-0">
                  <td className="px-4 py-3 font-mono text-xs text-ink">
                    {invoice.id}
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{invoice.date}</td>
                  <td className="px-4 py-3 text-ink-soft">
                    {invoice.description}
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{invoice.amount}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        invoice.status === "Paid"
                          ? "teal"
                          : invoice.status === "Due"
                            ? "accent"
                            : "outline"
                      }
                    >
                      {invoice.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
