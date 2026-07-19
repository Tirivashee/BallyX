import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Frames a placeholder product screenshot in a simple browser-style
 * chrome. All current sources are illustrative SVG mockups (see
 * public/images/screenshots) — swap `src` for a real screenshot when
 * available, no layout changes needed.
 */
export function ScreenshotFrame({
  src,
  alt,
  priority = false,
  className,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-ink/10 bg-paper-soft shadow-[0_24px_60px_-24px_rgba(21,22,26,0.35)]",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-ink/10 bg-ink px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-accent/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-paper/25" />
        <span className="h-2.5 w-2.5 rounded-full bg-paper/25" />
      </div>
      <div className="relative aspect-[16/10] w-full bg-paper">
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized
          priority={priority}
          className="object-cover"
          sizes="(min-width: 1024px) 640px, 100vw"
        />
      </div>
    </div>
  );
}
