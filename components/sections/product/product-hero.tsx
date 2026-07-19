import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScreenshotFrame } from "@/components/sections/screenshot-frame";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { pluto } from "@/lib/site-config";

export function ProductHero() {
  return (
    <section className="relative overflow-hidden border-b border-border-on-ink bg-ink text-paper">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-[-8%] h-[520px] w-[520px] rounded-full bg-accent/15 blur-[140px]"
      />

      <Container className="relative grid grid-cols-1 gap-16 py-24 md:py-32 lg:grid-cols-2 lg:items-center">
        <div>
          <Badge variant="ink" className="border border-paper/20">
            {pluto.statusDisplay} · {pluto.platform}
          </Badge>

          <h1 className="mt-6 font-heading text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
            {pluto.tagline}
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-paper/75">
            {pluto.subhead}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="#early-access">
                Get early access
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline-light" size="lg">
              <a href={getWhatsAppLink("Hi — I'd like to find out more about early access to Pluto.")} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" />
                Ask on WhatsApp
              </a>
            </Button>
          </div>
        </div>

        <ScreenshotFrame
          src="/images/screenshots/dashboard.svg"
          alt="Placeholder screenshot of the Pluto reports dashboard"
          priority
        />
      </Container>
    </section>
  );
}
