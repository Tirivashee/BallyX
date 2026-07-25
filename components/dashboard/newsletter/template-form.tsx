"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ActionState } from "@/lib/actions/newsletter";
import type { EmailTemplate } from "@/lib/newsletter-admin-data";

const initialState: ActionState = { status: "idle" };

export function TemplateForm({
  template,
  action,
  submitLabel,
}: {
  template?: EmailTemplate;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Template name</Label>
        <Input id="name" name="name" defaultValue={template?.name} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" defaultValue={template?.subject} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bodyHtml">Body (HTML)</Label>
        <Textarea
          id="bodyHtml"
          name="bodyHtml"
          defaultValue={template?.bodyHtml}
          rows={10}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bodyText">Body (plain text, optional)</Label>
        <Textarea id="bodyText" name="bodyText" defaultValue={template?.bodyText} rows={4} />
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
