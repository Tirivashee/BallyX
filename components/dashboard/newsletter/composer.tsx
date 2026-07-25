"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sendNewsletter, type ActionState } from "@/lib/actions/newsletter";
import type { EmailTemplate } from "@/lib/newsletter-admin-data";
import { cn } from "@/lib/utils";

const initialState: ActionState = { status: "idle" };

export function NewsletterComposer({ templates }: { templates: EmailTemplate[] }) {
  const [state, formAction, pending] = useActionState(sendNewsletter, initialState);
  const [templateId, setTemplateId] = useState("");
  const [subject, setSubject] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");

  const applyTemplate = (id: string) => {
    setTemplateId(id);
    const template = templates.find((t) => String(t.id) === id);
    if (template) {
      setSubject(template.subject);
      setBodyHtml(template.bodyHtml);
    }
  };

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <input type="hidden" name="templateId" value={templateId} />

      {templates.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="templatePicker">Start from a saved template</Label>
          <select
            id="templatePicker"
            value={templateId}
            onChange={(e) => applyTemplate(e.target.value)}
            className="flex h-11 w-full rounded-md border border-ink/20 bg-paper-soft px-4 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <option value="">— None —</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          name="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bodyHtml">Body (HTML)</Label>
        <Textarea
          id="bodyHtml"
          name="bodyHtml"
          value={bodyHtml}
          onChange={(e) => setBodyHtml(e.target.value)}
          rows={10}
          required
        />
        <p className="text-xs text-ink-soft">
          A one-click unsubscribe link is appended to every email automatically.
        </p>
      </div>

      {state.status !== "idle" && state.message && (
        <p
          className={cn("text-sm", state.status === "error" ? "text-accent-deep" : "text-teal")}
          role={state.status === "error" ? "alert" : "status"}
        >
          {state.message}
        </p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Sending…" : "Send to all subscribers"}
      </Button>
    </form>
  );
}
