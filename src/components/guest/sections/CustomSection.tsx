import { GuestHeader } from "@/components/guest/GuestHeader";
import { Linkify } from "@/components/guest/Linkify";
import { EmptyHint } from "./CheckInSection";
import type { CustomSectionRow } from "@/lib/guide/types";

/**
 * Guest render of a host-authored custom section: the title becomes the page
 * heading (no eyebrow), with the optional subtitle as a muted line beneath it,
 * above the free-text body. Shared by the guest route and the editor's live
 * preview, so `section` may be a partial draft.
 */
export function CustomSection({
  token,
  section,
}: {
  token?: string;
  section: Pick<CustomSectionRow, "title" | "subtitle" | "body">;
}) {
  const body = section.body?.trim();

  return (
    <>
      <GuestHeader
        backHref={token ? `/g/${token}` : undefined}
        title={section.title.trim() || "Untitled section"}
        subtitle={section.subtitle?.trim() || undefined}
      />

      <div className="flex flex-col gap-3 px-4.5 pb-8 pt-4.5">
        {body ? (
          <p className="whitespace-pre-line break-words text-[15px] leading-relaxed text-body">
            <Linkify>{body}</Linkify>
          </p>
        ) : (
          <EmptyHint>Add some details for this section.</EmptyHint>
        )}
      </div>
    </>
  );
}
