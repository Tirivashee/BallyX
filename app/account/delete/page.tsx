import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { DeleteAccountForm } from "@/components/account/delete-account-form";
import { getCurrentUser } from "@/lib/auth/current-user";

export const metadata: Metadata = {
  title: "Delete account",
};

export default async function DeleteAccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/signin");

  return (
    <div className="max-w-lg">
      <h1 className="font-heading text-2xl font-semibold tracking-tight text-ink">
        Delete account
      </h1>
      <p className="mt-1 text-sm text-ink-soft">This can&apos;t be undone.</p>
      <div className="mt-8">
        <DeleteAccountForm email={user.email} />
      </div>
    </div>
  );
}
