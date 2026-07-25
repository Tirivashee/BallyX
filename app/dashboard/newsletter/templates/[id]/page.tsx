import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TemplateForm } from "@/components/dashboard/newsletter/template-form";
import { updateTemplate } from "@/lib/actions/newsletter";
import { getTemplateById } from "@/lib/newsletter-admin-data";

export const metadata: Metadata = {
  title: "Edit template",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EditTemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const template = await getTemplateById(Number(id));
  if (!template) notFound();

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold tracking-tight text-ink">
        Edit {template.name}
      </h1>
      <div className="mt-8">
        <TemplateForm
          template={template}
          action={updateTemplate.bind(null, template.id)}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
