"use client";

import { useActionState } from "react";
import { onboardingAction } from "@/lib/dashboard/actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Field } from "@/components/ui/Field";

export function OnboardingForm() {
  const [state, action] = useActionState(onboardingAction, {});

  return (
    <form action={action} className="flex flex-col gap-4">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
          Your account
        </div>
        <Field
          label="Business or account name"
          name="accountName"
          placeholder="e.g. Airhosts"
          required
        />
      </div>

      <div className="border-t border-border pt-4">
        <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
          Your first property
        </div>
        <Field label="Property name" name="propertyName" placeholder="e.g. Aspects Court" required />
        <Field
          label="Address"
          name="address"
          placeholder="e.g. 1-bed apartment · Slough SL1 2EZ"
        />
      </div>

      {state.error && (
        <p className="rounded-[var(--radius-sm)] border-[1.5px] border-danger-ring bg-danger-subtle px-3.5 py-2.5 text-[13px] text-danger">
          {state.error}
        </p>
      )}

      <SubmitButton pendingLabel="Setting up…" className="w-full">
        Create account & property
      </SubmitButton>
    </form>
  );
}
