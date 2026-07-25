"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteAccount, type ActionState } from "@/lib/actions/account";

const initialState: ActionState = { status: "idle" };

export function DeleteAccountForm({ email }: { email: string }) {
  const [state, formAction, pending] = useActionState(deleteAccount, initialState);

  return (
    <form action={formAction} className="max-w-sm space-y-4">
      <p className="text-sm text-ink-soft">
        This permanently deletes your BallyX account. To confirm, type your account email (
        <strong className="text-ink">{email}</strong>) below.
      </p>
      <div className="space-y-2">
        <Label htmlFor="confirmEmail">Account email</Label>
        <Input id="confirmEmail" name="confirmEmail" type="email" required />
      </div>

      {state.status === "error" && state.message && (
        <p className="text-sm text-accent-deep" role="alert">
          {state.message}
        </p>
      )}

      <Button
        type="submit"
        variant="outline"
        disabled={pending}
        className="border-accent-deep text-accent-deep hover:bg-accent-deep hover:text-paper"
      >
        {pending ? "Deleting…" : "Delete my BallyX account"}
      </Button>
    </form>
  );
}
