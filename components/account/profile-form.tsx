"use client";

import Image from "next/image";
import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AVATAR_PRESETS } from "@/lib/account/avatars";
import { updateProfile, type ActionState } from "@/lib/actions/account";
import { cn } from "@/lib/utils";

const initialState: ActionState = { status: "idle" };

export function ProfileForm({
  email,
  displayName,
  avatarKey,
  newsletterSubscribed,
}: {
  email: string;
  displayName: string | null;
  avatarKey: string | null;
  newsletterSubscribed: boolean;
}) {
  const [state, formAction, pending] = useActionState(updateProfile, initialState);
  const [selectedAvatar, setSelectedAvatar] = useState(avatarKey ?? AVATAR_PRESETS[0].key);
  const [subscribed, setSubscribed] = useState(newsletterSubscribed);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="avatarKey" value={selectedAvatar} />
      <input type="hidden" name="newsletterSubscribed" value={subscribed ? "true" : "false"} />

      <p className="text-sm text-ink-soft">Signed in as {email}</p>

      <div className="space-y-2">
        <Label>Avatar</Label>
        <div className="flex flex-wrap gap-3">
          {AVATAR_PRESETS.map((preset) => (
            <button
              key={preset.key}
              type="button"
              onClick={() => setSelectedAvatar(preset.key)}
              aria-label={preset.label}
              aria-pressed={selectedAvatar === preset.key}
              className={cn(
                "h-14 w-14 overflow-hidden rounded-full border-2 transition-colors",
                selectedAvatar === preset.key
                  ? "border-accent"
                  : "border-transparent hover:border-ink/20",
              )}
            >
              <Image
                src={preset.src}
                alt={preset.label}
                width={56}
                height={56}
                unoptimized
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="displayName">Display name</Label>
        <Input
          id="displayName"
          name="displayName"
          defaultValue={displayName ?? ""}
          maxLength={100}
          placeholder="Optional"
        />
      </div>

      <div className="flex items-center justify-between gap-4 rounded-md border border-ink/10 bg-paper-soft p-4">
        <div>
          <p className="text-sm font-medium text-ink">Newsletter &amp; product updates</p>
          <p className="text-xs text-ink-soft">
            Occasional emails about new BallyX apps and updates.
          </p>
        </div>
        <Switch
          checked={subscribed}
          onCheckedChange={setSubscribed}
          aria-label="Newsletter subscription"
        />
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
        {pending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
