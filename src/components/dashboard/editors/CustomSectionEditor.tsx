"use client";

import { useState } from "react";
import { EditorShell, EditorGroup } from "./EditorShell";
import { EditorField, TextInput, TextArea } from "./ui";
import { CustomSection } from "@/components/guest/sections/CustomSection";
import { saveCustomSection } from "@/lib/dashboard/custom-section-actions";

export function CustomSectionEditor({
  propertyId,
  sectionId,
  hue,
  initial,
}: {
  propertyId: string;
  sectionId: string;
  hue: number;
  initial: { title: string; subtitle: string; body: string };
}) {
  const [c, setC] = useState(initial);
  const set = (patch: Partial<typeof c>) => setC((p) => ({ ...p, ...patch }));

  return (
    <EditorShell
      propertyId={propertyId}
      title="Custom section"
      hue={hue}
      onSave={() => saveCustomSection(propertyId, sectionId, c)}
      preview={<CustomSection section={c} />}
      form={
        <>
          <EditorGroup title="Section">
            <p className="text-[13px] text-body">
              A section of your own. It appears as a tile on the guest home screen and opens its
              own page.
            </p>
            <EditorField label="Title" hint="Shown on the home tile and as the page heading.">
              <TextInput value={c.title} onChange={(v) => set({ title: v })} placeholder="e.g. Pool access" />
            </EditorField>
            <EditorField label="Subtitle" hint="Optional — the small line under the tile title.">
              <TextInput
                value={c.subtitle}
                onChange={(v) => set({ subtitle: v })}
                placeholder="e.g. Gate code & towels"
              />
            </EditorField>
          </EditorGroup>

          <EditorGroup title="Content">
            <EditorField label="Body" hint="Line breaks are kept.">
              <TextArea
                value={c.body}
                onChange={(v) => set({ body: v })}
                placeholder="Everything the guest needs to know for this section…"
                rows={8}
              />
            </EditorField>
          </EditorGroup>
        </>
      }
    />
  );
}
