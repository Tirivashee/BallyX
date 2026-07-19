import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { brand } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms that apply to using ${brand.shortName}'s website and services.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <section className="py-20 md:py-28">
      <Container className="max-w-2xl">
        <span className="font-mono-eyebrow text-xs uppercase tracking-wider text-accent-deep">
          Legal
        </span>
        <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-ink">
          Terms of Service
        </h1>
        <p className="mt-4 text-sm text-ink-soft">
          {/* Replace with real, reviewed terms before launch — this is a
              plain-language placeholder only. */}
          Last updated: {"{{LAST_UPDATED_DATE}}"}
        </p>

        <div className="mt-10 space-y-6 text-base leading-relaxed text-ink-soft">
          <p>
            This is placeholder text. By using this website or engaging{" "}
            {brand.legalName} ({brand.shortName}) for services, you agree to
            these terms. Pluto and any custom software delivered by{" "}
            {brand.shortName} are subject to a separate agreement signed
            with each customer.
          </p>
          <p>
            {"{{PLACEHOLDER — replace with real terms covering service delivery, payment, warranties, liability, and intellectual property before this site goes live.}}"}
          </p>
          <p>
            Questions about these terms can be sent to{" "}
            <a href={`mailto:${brand.email}`} className="text-accent-deep underline underline-offset-2">
              {brand.email}
            </a>
            .
          </p>
        </div>
      </Container>
    </section>
  );
}
