import type { Metadata } from "next";

import { ChangePasswordForm } from "@/components/account/change-password-form";

export const metadata: Metadata = {
  title: "Security",
};

export default function AccountSecurityPage() {
  return (
    <div className="max-w-lg">
      <h1 className="font-heading text-2xl font-semibold tracking-tight text-ink">Security</h1>
      <p className="mt-1 text-sm text-ink-soft">Change your password.</p>
      <div className="mt-8">
        <ChangePasswordForm />
      </div>
    </div>
  );
}
