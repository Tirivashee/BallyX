import Link from "next/link";

import { brand, footerLinks } from "@/lib/site-config";

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="font-mono-eyebrow text-xs uppercase tracking-wider text-paper/50">
        {title}
      </h3>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-paper/80 transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border-on-ink bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <span className="font-heading text-xl font-semibold tracking-tight">
              {brand.shortName}
            </span>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-paper/70">
              {brand.tagline}
            </p>
            <p className="mt-6 font-mono-eyebrow text-xs uppercase tracking-wider text-paper/50">
              {brand.location.display}
            </p>
          </div>

          <FooterColumn title="Product" links={footerLinks.product} />
          <FooterColumn title="Services" links={footerLinks.services} />
          <FooterColumn title="Company" links={footerLinks.company} />
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-border-on-ink pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-paper/50">
            © {new Date().getFullYear()} {brand.legalName}. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-paper/50 hover:text-paper/80"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
