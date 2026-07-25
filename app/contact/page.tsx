import type { Metadata } from "next";
import { MessageCircle, Mail, MapPin } from "lucide-react";

import { Container } from "@/components/layout/container";
import { ContactForm } from "@/components/sections/contact/contact-form";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { brand, contact } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${brand.shortName} — WhatsApp, email, or the form below.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <span className="font-mono-eyebrow text-xs uppercase tracking-wider text-accent-deep">
              Contact
            </span>
            <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              {contact.heading}
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
              {contact.subhead}
            </p>

            <div className="mt-10 space-y-4">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-lg border border-ink/10 bg-paper-soft p-5 transition-colors hover:border-accent-deep/40"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-soft">
                  <MessageCircle className="h-5 w-5 text-accent-deep" />
                </span>
                <span>
                  <span className="block text-sm font-medium text-ink">
                    WhatsApp — fastest way to reach us
                  </span>
                  <span className="block text-sm text-ink-soft">
                    {brand.whatsapp.display}
                  </span>
                </span>
              </a>

              <a
                href={`mailto:${brand.email}`}
                className="flex items-center gap-4 rounded-lg border border-ink/10 bg-paper-soft p-5 transition-colors hover:border-accent-deep/40"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-soft">
                  <Mail className="h-5 w-5 text-teal" />
                </span>
                <span>
                  <span className="block text-sm font-medium text-ink">Email</span>
                  <span className="block text-sm text-ink-soft">{brand.email}</span>
                </span>
              </a>

              <div className="flex items-center gap-4 rounded-lg border border-ink/10 bg-paper-soft p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink/5">
                  <MapPin className="h-5 w-5 text-ink-soft" />
                </span>
                <span>
                  <span className="block text-sm font-medium text-ink">Location</span>
                  <span className="block text-sm text-ink-soft">
                    {brand.location.display}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-ink/10 bg-paper-soft p-8">
            <h2 className="font-heading text-xl font-medium tracking-tight text-ink">
              Send a message
            </h2>
            <p className="mt-2 text-sm text-ink-soft">
              Prefer writing it out? We read every message.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
