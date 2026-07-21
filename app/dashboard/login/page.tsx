"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setHostingDemoAuthed } from "@/lib/dashboard-auth";

export default function DashboardLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setHostingDemoAuthed(true);
    router.push("/dashboard");
  }

  return (
    <section className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center py-16">
      <Container className="max-w-md">
        <div className="rounded-lg border border-ink/10 bg-paper-soft p-8">
          <Badge variant="teal">Demo preview</Badge>
          <h1 className="mt-4 font-heading text-2xl font-semibold tracking-tight text-ink">
            Sign in to BallyX Hosting
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            This is a front-end preview of the client dashboard — enter
            anything below to continue. No account or real data is
            required yet.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" size="lg" className="w-full">
              Sign in
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-ink-soft">
            <Link
              href="/hosting"
              className="underline underline-offset-4 hover:text-accent-deep"
            >
              Back to Hosting overview
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
}
