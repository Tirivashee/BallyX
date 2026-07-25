import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ProfileForm } from "@/components/account/profile-form";
import { getCurrentUser } from "@/lib/auth/current-user";

export const metadata: Metadata = {
  title: "Profile",
};

// Access is already gated server-side by middleware.ts (sub === "user")
// before this page ever renders; getCurrentUser() re-checks anyway (see
// its own comment) and this still redirects defensively if it somehow
// returns null (e.g. the account was deleted in another tab mid-session).
export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/signin");

  return (
    <div className="max-w-lg">
      <h1 className="font-heading text-2xl font-semibold tracking-tight text-ink">Profile</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Manage your avatar, display name, and email preferences.
      </p>
      <div className="mt-8">
        <ProfileForm
          email={user.email}
          displayName={user.displayName}
          avatarKey={user.avatarKey}
          newsletterSubscribed={user.newsletterSubscribed}
        />
      </div>
    </div>
  );
}
