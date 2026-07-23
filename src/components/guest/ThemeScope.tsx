import type { CSSProperties, ReactNode } from "react";

/**
 * Per-account accent theming. The design tokens live in Tailwind's `@theme`
 * block as `oklch(L C var(--h))`, but `@theme` snapshots `var(--h)` at :root, so
 * overriding `--h` alone on a subtree does NOT recolour the accent utilities.
 *
 * To make theming actually cascade, we set the concrete `--color-accent*`
 * variables inline from the hue — these override the :root tokens for this
 * subtree, and every `bg-accent` / `text-accent` utility reads them. The L/C
 * values mirror globals.css so a given hue looks identical everywhere.
 */
export function accentVars(hue: number): Record<string, string> {
  const h = String(hue);
  return {
    "--h": h,
    "--color-accent": `oklch(0.5 0.12 ${h})`,
    "--color-accent-hover": `oklch(0.42 0.12 ${h})`,
    "--color-accent-subtle": `oklch(0.95 0.02 ${h})`,
    "--color-accent-tint": `oklch(0.97 0.01 ${h})`,
    "--color-accent-ring": `oklch(0.88 0.04 ${h})`,
    "--color-accent-gold": `oklch(0.78 0.09 ${h})`,
    "--color-accent-soft": `oklch(0.9 0.04 ${h})`,
  };
}

export function ThemeScope({
  hue,
  children,
  className,
  style,
}: {
  hue: number;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={className}
      style={{ ...accentVars(hue), ...style } as CSSProperties}
    >
      {children}
    </div>
  );
}
