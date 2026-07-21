"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContactForm, type ContactFormState } from "@/lib/actions/contact";

const initialState: ContactFormState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {pending ? "Sending…" : "Send message"}
    </Button>
  );
}

export function ContactForm({ initialMessage }: { initialMessage?: string }) {
  const [state, formAction] = useActionState(submitContactForm, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  if (state.status === "success") {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-teal/30 bg-teal-soft p-6">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
        <p className="text-sm leading-relaxed text-ink">
          {state.message ?? "Thanks — we've received your message."}
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-5" noValidate>
      {/* Honeypot — hidden from real visitors via CSS, not display:none
          (some bots skip display:none fields), left in the tab order
          only for automated fillers. */}
      <div className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required autoComplete="name" />
          {state.fieldErrors?.name && (
            <p className="text-xs text-accent-deep">{state.fieldErrors.name[0]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
          {state.fieldErrors?.email && (
            <p className="text-xs text-accent-deep">{state.fieldErrors.email[0]}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">Company (optional)</Label>
        <Input id="company" name="company" autoComplete="organization" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          required
          minLength={10}
          defaultValue={initialMessage}
        />
        {state.fieldErrors?.message && (
          <p className="text-xs text-accent-deep">{state.fieldErrors.message[0]}</p>
        )}
      </div>

      {state.status === "error" && state.message && (
        <p className="text-sm text-accent-deep">{state.message}</p>
      )}

      <SubmitButton />
    </form>
  );
}
