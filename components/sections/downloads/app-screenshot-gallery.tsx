import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { ScreenshotFrame } from "@/components/sections/screenshot-frame";
import type { DownloadApp } from "@/lib/downloads";

export function AppScreenshotGallery({
  appName,
  screenshots,
}: {
  appName: string;
  screenshots: DownloadApp["screenshots"];
}) {
  if (screenshots.length === 0) return null;

  return (
    <section className="border-y border-ink/10 bg-paper-dim py-24 md:py-32">
      <Container>
        <span className="font-mono-eyebrow text-xs uppercase tracking-wider text-accent-deep">
          Inside {appName}
        </span>
        <h2 className="mt-4 max-w-xl font-heading text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Placeholder screenshots — real product shots go here.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
          {screenshots.map((shot, i) => (
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
