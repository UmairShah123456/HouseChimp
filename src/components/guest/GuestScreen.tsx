import type { ReactNode } from "react";
import { ThemeScope } from "./ThemeScope";
import { GuestNav, type GuestTab } from "./GuestNav";
import type { SectionTitles } from "@/lib/guide/types";

/**
 * Mobile-first guest portal chrome: a centred phone-width column, per-account
 * theming, and the persistent bottom tab bar. Built and tuned at 375px first.
 */
export function GuestScreen({
  token,
  hue,
  active,
  sectionTitles,
  children,
}: {
  token: string;
  hue: number;
  active: GuestTab;
  sectionTitles?: SectionTitles;
  children: ReactNode;
}) {
  return (
    <ThemeScope hue={hue}>
      <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col bg-page">
        <main className="flex flex-1 flex-col">{children}</main>
        <GuestNav token={token} active={active} sectionTitles={sectionTitles} />
      </div>
    </ThemeScope>
  );
}
