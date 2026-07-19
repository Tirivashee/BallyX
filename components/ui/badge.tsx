import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-xs font-medium font-mono-eyebrow uppercase tracking-wider",
  {
    variants: {
      variant: {
        accent: "bg-accent-soft text-accent-deep",
        teal: "bg-teal-soft text-teal",
        ink: "bg-ink text-paper",
        outline: "border border-ink/20 text-ink-soft",
      },
    },
    defaultVariants: {
      variant: "accent",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
