import { Search } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { hosting } from "@/lib/site-config";

export function DomainSearch() {
  return (
    <section className="border-y border-ink/10 bg-paper-dim py-24 md:py-32">
      <Container>
        <div className="max-w-2xl">
          <span className="font-mono-eyebrow text-xs uppercase tracking-wider text-teal">
            Domains
          </span>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Have a domain in mind?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">
            Tell us the domain you want and we&apos;ll get back to you with
            availability and pricing. This isn&apos;t a live registrar
            lookup yet — a real person checks and replies.
          </p>
        </div>

        <form
          action="/contact"
          method="GET"
          className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row"
        >
          <Input
            name="domain"
            placeholder="yourbusiness.co.zw"
            aria-label="Domain name"
            required
            className="flex-1"
          />
          <Button type="submit" size="lg">
            <Search className="h-4 w-4" />
            Ask about this domain
          </Button>
        </form>

        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
          {hosting.domainPricing.map((entry) => (
            <div key={entry.tld} className="text-sm">
              <span className="font-mono-eyebrow text-ink">{entry.tld}</span>
              <span className="ml-2 text-ink-soft">from {entry.price}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
