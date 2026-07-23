"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitSignup, type SignupState } from "@/lib/actions/signup";
import { auth } from "@/lib/site-config";

const initialState: SignupState = { status: "idle" };

export function SignupForm() {
  const [state, formAction, pending] = useActionState(submitSignup, initialState);

  if (state.status === "success") {
    return (
      <p className="mt-6 text-sm leading-relaxed text-ink" role="status">
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="mt-6 space-y-4" noValidate>
      {/* Honeypot — hidden via CSS (not display:none), same convention as
          the contact form (lib/actions/contact.ts). */}
      <div className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{auth.signup.emailLabel}</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
        {state.fieldErrors?.email && (
          <p className="text-xs text-accent-deep">{state.fieldErrors.email[0]}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">{auth.signup.passwordLabel}</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
        />
        {state.fieldErrors?.password && (
          <p className="text-xs text-accent-deep">{state.fieldErrors.password[0]}</p>
        )}
      </div>

      {state.status === "error" && state.message && (
        <p className="text-sm text-accent-deep" role="alert">
          {state.message}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? auth.signup.submitPendingLabel : auth.signup.submitLabel}
      </Button>

      <p className="text-sm text-ink-soft">
        <Link href="/signin" className="text-accent-deep underline underline-offset-4">
          {auth.signup.signinLinkLabel}
        </Link>
      </p>
    </form>
  );
}
