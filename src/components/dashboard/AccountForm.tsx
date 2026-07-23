"use client";

import { useActionState, useState } from "react";
import { updateAccountAction } from "@/lib/account/actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Field } from "@/components/ui/Field";
import { ThemeScope } from "@/components/guest/ThemeScope";
import type { AccountRow } from "@/lib/guide/types";

const PRESETS = [
  { name: "Teal", hue: 200 },
  { name: "Terracotta", hue: 45 },
  { name: "Forest", hue: 155 },
  { name: "Plum", hue: 320 },
];

export function AccountForm({ account }: { account: AccountRow }) {
  const [state, action] = useActionState(updateAccountAction, {});
  const [hue, setHue] = useState(account.accent_hue);

  return (
    <form
      action={action}
      className="rounded-[var(--radius-lg)] border-[1.5px] border-border bg-surface p-6"
    >
      <input type="hidden" name="accent_hue" value={hue} />

      <Field label="Account name" name="name" defaultValue={account.name} required />

      <div className="mt-5">
        <span className="text-[13px] font-semibold text-ink">Accent colour</span>
        <p className="text-xs text-muted">Recolours your entire guest portal.</p>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {PRESETS.map((p) => (
            <button
              key={p.hue}
              type="button"
              onClick={() => setHue(p.hue)}
              className={`flex items-center gap-2 rounded-[var(--radius-pill)] border-[1.5px] px-3 py-2 text-[13px] font-semibold ${
                hue === p.hue ? "border-ink text-ink" : "border-border text-body"
              }`}
            >
              <span
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: `oklch(0.5 0.12 ${p.hue})` }}
              />
              {p.name}
            </button>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={360}
            value={hue}
            onChange={(e) => setHue(Number(e.target.value))}
            className="flex-1 accent-[oklch(0.5_0.12_var(--h))]"
            style={{ ["--h" as string]: String(hue) }}
          />
          <span
            className="h-8 w-8 flex-none rounded-full border-[1.5px] border-border"
            style={{ backgroundColor: `oklch(0.5 0.12 ${hue})` }}
          />
          <span className="w-10 text-right text-[13px] font-semibold text-muted">{hue}°</span>
        </div>

        {/* Live preview — recolours instantly as the hue changes, exactly like
            the guest portal does. */}
        <ThemeScope hue={hue} className="mt-4">
          <div className="rounded-[var(--radius-card)] border-[1.5px] border-border bg-page p-4">
            <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted">
              Guest preview
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2.5">
              <span className="rounded-[var(--radius-pill)] bg-accent px-4 py-2 text-[13px] font-bold text-white">
                Primary button
              </span>
              <span className="rounded-[var(--radius-pill)] bg-accent-subtle px-3.5 py-2 text-[13px] font-bold text-accent">
                Directions
              </span>
              <span className="text-[13px] font-bold text-accent">Link text →</span>
              <span className="h-6 w-6 rounded-full border-[1.5px] border-accent-ring bg-accent-tint" />
            </div>
          </div>
        </ThemeScope>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <SubmitButton pendingLabel="Saving…">Save branding</SubmitButton>
        {state.ok && <span className="text-[13px] font-semibold text-success">{state.message}</span>}
        {state.error && <span className="text-[13px] font-semibold text-danger">{state.error}</span>}
      </div>
    </form>
  );
}
