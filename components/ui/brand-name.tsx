/**
 * Renders any string containing "BallyX" with the X in brand orange.
 * Pass `className` to set the X's color for the surrounding background
 * (defaults to `text-accent-deep`, the AA-safe orange for paper
 * backgrounds — use `text-accent` on `--ink` backgrounds instead).
 */
import { Fragment } from "react";

export function BrandName({
  text,
  className = "text-accent-deep",
}: {
  text: string;
  className?: string;
}) {
  const parts = text.split("BallyX");

  return parts.map((part, i) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 && (
        <>
          Bally
          <span className={className}>X</span>
        </>
      )}
    </Fragment>
  ));
}
