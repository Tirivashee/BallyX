import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { ScreenshotFrame } from "@/components/sections/screenshot-frame";

const shots = [
  {
    src: "/images/screenshots/pos-checkout.svg",
    alt: "Placeholder screenshot of the Pluto POS checkout screen",
    caption: "Checkout",
  },
  {
    src: "/images/screenshots/inventory.svg",
    alt: "Placeholder screenshot of the Pluto inventory list",
    caption: "Inventory",
  },
  {
    src: "/images/screenshots/dashboard.svg",
    alt: "Placeholder screenshot of the Pluto reports dashboard",
    caption: "Reports & dashboard",
  },
];

export function ScreenshotGallery() {
  return (
    <section className="border-y border-ink/10 bg-paper-dim py-24 md:py-32">
      <Container>
        <span className="font-mono-eyebrow text-xs uppercase tracking-wider text-accent-deep">
          Inside Pluto
        </span>
        <h2 className="mt-4 max-w-xl font-heading text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Placeholder screenshots — real product shots go here.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {shots.map((shot, i) => (
            <Reveal key={shot.caption} delay={i * 0.08}>
              <ScreenshotFrame src={shot.src} alt={shot.alt} />
              <p className="mt-3 font-mono-eyebrow text-xs uppercase tracking-wider text-ink-soft">
                {shot.caption}
              </p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
