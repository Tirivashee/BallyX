import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { brand } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${brand.shortName} handles the information you share with us.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <section className="py-20 md:py-28">
      <Container className="max-w-2xl">
        <span className="font-mono-eyebrow text-xs uppercase tracking-wider text-accent-deep">
          Legal
        </span>
        <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-ink">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-ink-soft">
          {/* Replace with a real, reviewed privacy policy before launch —
              this is a plain-language placeholder only. */}
          Last updated: {"{{LAST_UPDATED_DATE}}"}
        </p>

        <div className="prose-content mt-10 space-y-6 text-base leading-relaxed text-ink-soft">
          <p>
            This is placeholder text. {brand.legalName} ({brand.shortName})
            respects your privacy. When you contact us through this site —
            by form, WhatsApp, or email — we use the information you provide
            solely to respond to your enquiry and, where relevant, to
            deliver services you&apos;ve requested.
          </p>
          <p>
            We do not sell your personal information. We do not share it
            with third parties except where required to operate the
            service you&apos;ve asked for, or where required by law.
          </p>
          <p>
            {"{{PLACEHOLDER — replace with your actual data handling, retention, and third-party processor details (e.g. email provider, hosting) before this site goes live.}}"}
          </p>
          <p>
            Questions about this policy can be sent to{" "}
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
