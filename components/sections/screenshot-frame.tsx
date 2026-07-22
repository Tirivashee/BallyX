import Image from "next/image";
import { Expand } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Frames a product screenshot in a simple browser-style chrome.
 * See public/images/screenshots for sources — some are still
 * illustrative SVG mockups pending a real screenshot.
 */
export function ScreenshotFrame({
  src,
  alt,
  priority = false,
  className,
  onClick,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  const frameClassName = cn(
    "group relative block w-full overflow-hidden rounded-lg border border-ink/10 bg-paper-soft text-left shadow-[0_24px_60px_-24px_rgba(21,22,26,0.35)]",
    onClick && "cursor-zoom-in transition-shadow hover:shadow-[0_28px_70px_-20px_rgba(21,22,26,0.45)]",
    className,
  );

  const content = (
    <>
      <div className="flex items-center gap-1.5 border-b border-ink/10 bg-ink px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-accent/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-paper/25" />
        <span className="h-2.5 w-2.5 rounded-full bg-paper/25" />
      </div>
      <div className="relative aspect-video w-full bg-paper-dim">
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized
          priority={priority}
          className="object-cover"
          sizes="(min-width: 1024px) 640px, 100vw"
        />
        {onClick && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition-all group-hover:bg-ink/20 group-hover:opacity-100">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-paper/90 text-ink">
              <Expand className="h-5 w-5" />
            </span>
          </div>
        )}
      </div>
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} aria-label={`Expand: ${alt}`} className={frameClassName}>
        {content}
      </button>
    );
  }

  return <div className={frameClassName}>{content}</div>;
}
