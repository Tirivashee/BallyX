import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { hosting } from "@/lib/site-config";

export function HostingHero() {
  return (
    <section className="border-b border-ink/10 py-20 md:py-28">
      <Container>
        <Badge variant="teal">{hosting.statusDisplay}</Badge>

        <h1 className="mt-6 max-w-2xl font-heading text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          {hosting.tagline}
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
          {hosting.subhead}
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/contact">
              Ask about hosting
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">Preview the client dashboard</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
