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
        <p className="mt-4 text-sm text-ink-soft">Last updated: 26 July 2026</p>

        <div className="mt-10 space-y-8 text-base leading-relaxed text-ink-soft">
          <p>
            By using this website, creating an account, or engaging{" "}
            {brand.legalName} ({brand.shortName}) for services, you agree to
            these terms. Pluto, Mars, Venus, and any custom software
            delivered by {brand.shortName} may also be subject to a separate
            written agreement signed with each customer — where the two
            conflict, that agreement takes precedence over this page.
          </p>

          <div className="space-y-2">
            <h2 className="font-heading text-lg font-semibold text-ink">
              Who we are
            </h2>
            <p>
              {brand.legalName} is a software studio based in{" "}
              {brand.location.display}. References to &quot;we&quot;,
              &quot;us&quot;, or &quot;{brand.shortName}&quot; mean{" "}
              {brand.legalName}.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-heading text-lg font-semibold text-ink">
              Accounts
            </h2>
            <p>
              Some parts of this site — including the customer account area
              and the {brand.shortName} team dashboard — require an account.
              You&apos;re responsible for keeping your login credentials
              confidential and for anything that happens under your account.
              Tell us straight away at{" "}
              <a
                href={`mailto:${brand.email}`}
                className="text-accent-deep underline underline-offset-2"
              >
                {brand.email}
              </a>{" "}
              if you suspect unauthorized access.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-heading text-lg font-semibold text-ink">
              Early-access software
            </h2>
            <p>
              Pluto, Mars, and Venus are under active development. Software
              made available during early access is provided &quot;as
              is&quot;, without warranty of uptime, fitness for a particular
              purpose, or freedom from bugs, and features or pricing may
              change before general release. Founding customers who join
              during early access keep any pricing explicitly promised to
              them at signup, as described on the relevant product page.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-heading text-lg font-semibold text-ink">
              Acceptable use
            </h2>
            <p>
              You agree not to misuse this site or our software — that
              includes attempting to gain unauthorized access to any account
              or system, reverse-engineering our software beyond what the
              law allows, interfering with the service&apos;s normal
              operation, or using it for anything unlawful.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-heading text-lg font-semibold text-ink">
              Intellectual property
            </h2>
            <p>
              The {brand.shortName} name, logo, and the Pluto, Mars, and
              Venus software are our property or licensed to us. Nothing on
              this site grants you rights to our trademarks or source code
              beyond what&apos;s needed to use the service as intended. Data
              you enter into Pluto, Mars, or Venus — your stock records,
              sales, invoices, or payroll data — remains yours.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-heading text-lg font-semibold text-ink">
              Liability
            </h2>
            <p>
              To the fullest extent permitted by law, {brand.shortName} isn&apos;t
              liable for indirect or consequential losses arising from your
              use of this site or, during early access, our software. This
              doesn&apos;t limit any liability that can&apos;t lawfully be
              excluded.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-heading text-lg font-semibold text-ink">
              Governing law
            </h2>
            <p>
              These terms are governed by the laws of Zimbabwe, and any
              dispute is subject to the exclusive jurisdiction of the
              Zimbabwean courts.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-heading text-lg font-semibold text-ink">
              Changes
            </h2>
            <p>
              We may update these terms as the business and our products
              grow. We&apos;ll update the date above when we do — material
              changes affecting existing customers will be communicated
              directly.
            </p>
          </div>

          <p>
            Questions about these terms can be sent to{" "}
            <a
              href={`mailto:${brand.email}`}
              className="text-accent-deep underline underline-offset-2"
            >
              {brand.email}
            </a>
            .
          </p>
        </div>
      </Container>
    </section>
  );
}
