"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { confirmEmail, type ConfirmState } from "@/lib/actions/confirm";
import { auth } from "@/lib/site-config";

const initialState: ConfirmState = { status: "idle" };

export function ConfirmButton({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(confirmEmail, initialState);

  if (state.status === "invalid") {
    return (
      <div className="mt-6 space-y-2">
        <h2 className="font-heading text-lg font-semibold text-ink">
          {auth.confirm.invalidHeading}
        </h2>
        <p className="text-sm leading-relaxed text-ink-soft">{auth.confirm.invalidMessage}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-6">
      <input type="hidden" name="token" value={token} />
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? auth.confirm.submitPendingLabel : auth.confirm.submitLabel}
      </Button>
    </form>
  );
}
