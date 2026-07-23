"use client";

import { useActionState, useState } from "react";
import { updatePropertyAction } from "@/lib/dashboard/actions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Field } from "@/components/ui/Field";
import { MediaUploader } from "./MediaUploader";
import type { PropertyRow } from "@/lib/guide/types";

export function PropertyDetailsForm({ property }: { property: PropertyRow }) {
  const [state, action] = useActionState(updatePropertyAction, {});
  const [heroUrl, setHeroUrl] = useState(property.hero_image_url ?? "");

  return (
    <form action={action} className="flex flex-col gap-1">
      <input type="hidden" name="id" value={property.id} />
      <input type="hidden" name="hero_image_url" value={heroUrl} />

      <div className="mb-3">
        <span className="text-[13px] font-semibold text-ink">Hero photo</span>
        <div className="mt-1.5">
          <MediaUploader
            pathPrefix={property.id}
            value={heroUrl}
            onUploaded={setHeroUrl}
            label="Upload photo"
          />
        </div>
      </div>

      <Field label="Property name" name="name" defaultValue={property.name} required />
      <Field
        label="Address"
        name="address"
        defaultValue={property.address ?? ""}
        placeholder="e.g. 1-bed apartment · Slough SL1 2EZ"
      />

      <div className="mt-4 flex items-center gap-3">
        <SubmitButton pendingLabel="Saving…">Save details</SubmitButton>
        {state.ok && <span className="text-[13px] font-semibold text-success">Saved ✓</span>}
        {state.error && <span className="text-[13px] font-semibold text-danger">{state.error}</span>}
      </div>
    </form>
  );
}
