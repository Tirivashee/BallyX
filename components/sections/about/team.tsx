import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { BrandName } from "@/components/ui/brand-name";
import { team } from "@/lib/site-config";

export function Team() {
  return (
    <section id="careers" className="py-20 md:py-28">
      <Container>
        <span className="font-mono-eyebrow text-xs uppercase tracking-wider text-teal">
          Team
        </span>
        <h2 className="mt-4 max-w-xl font-heading text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Founder-led, for now
        </h2>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-ink-soft">
          {team.length === 1 ? (
            <BrandName text="BallyX is currently a team of one — building deliberately, and looking to grow the team as Pluto grows." />
          ) : (
            <BrandName text="The people building BallyX." />
          )}
        </p>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <Reveal key={member.name}>
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-dashed border-ink/25 text-xs font-medium text-ink-soft">
                Photo
              </div>
              <h3 className="mt-4 font-heading text-lg font-medium tracking-tight text-ink">
                {member.name}
              </h3>
              <p className="text-sm text-accent-deep">{member.role}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {member.bio}
              </p>
            </Reveal>
          ))}

          <div className="rounded-lg border border-dashed border-ink/25 p-6">
            <h3 className="font-heading text-lg font-medium tracking-tight text-ink">
              We&apos;re hiring — eventually
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              <BrandName text="Future roles will be posted here once BallyX is ready to grow the team beyond its founder. Nothing open right now." />
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
