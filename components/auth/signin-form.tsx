"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitSignin, type SigninState } from "@/lib/actions/signin";
import { auth } from "@/lib/site-config";

const initialState: SigninState = { status: "idle" };

export function SigninForm({ next, confirmed }: { next: string; confirmed: boolean }) {
  const [state, formAction, pending] = useActionState(submitSignin, initialState);

  return (
    <form action={formAction} className="mt-6 space-y-4" noValidate>
      <input type="hidden" name="next" value={next} />

      {confirmed && (
        <p className="rounded-md border border-teal/30 bg-teal-soft p-3 text-sm text-ink" role="status">
          {auth.signin.confirmedBanner}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">{auth.signin.emailLabel}</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">{auth.signin.passwordLabel}</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>

      {state.status === "error" && (
        <p className="text-sm text-accent-deep" role="alert">
          {state.message}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? auth.signin.submitPendingLabel : auth.signin.submitLabel}
      </Button>

      <div className="space-y-1 text-sm text-ink-soft">
        <p>
          <Link href="/signup" className="text-accent-deep underline underline-offset-4">
            {auth.signin.signupLinkLabel}
          </Link>
        </p>
        <p>
          <Link href="/login" className="text-ink-soft underline underline-offset-4">
            {auth.signin.adminLinkLabel}
          </Link>
        </p>
      </div>
    </form>
  );
}
