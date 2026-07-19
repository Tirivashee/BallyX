import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { getWhatsAppLink } from "@/lib/whatsapp";

export function ClosingCTA() {
  return (
    <section className="bg-ink py-24 text-paper md:py-32">
      <Container className="text-center">
        <h2 className="mx-auto max-w-2xl font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
          Let&apos;s build something your business can rely on.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-paper/70">
          Early access to Pluto is open, and we&apos;re taking on a small
          number of custom software projects. Reach out — WhatsApp is
          fastest.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg">
            <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </a>
          </Button>
          <Button asChild variant="outline-light" size="lg">
            <Link href="/contact">
              Book a consultation
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
