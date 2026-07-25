import type { Metadata } from "next";

import { TemplateForm } from "@/components/dashboard/newsletter/template-form";
import { createTemplate } from "@/lib/actions/newsletter";

export const metadata: Metadata = {
  title: "New template",
  robots: { index: false, follow: false },
};

export default function NewTemplatePage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold tracking-tight text-ink">
        New template
      </h1>
      <div className="mt-8">
        <TemplateForm action={createTemplate} submitLabel="Create template" />
      </div>
    </div>
  );
}
