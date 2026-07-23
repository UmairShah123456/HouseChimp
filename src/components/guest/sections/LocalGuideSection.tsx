import { GuestHeader } from "@/components/guest/GuestHeader";
import { LocalGuideView } from "@/components/guest/LocalGuideView";
import { EmptyHint } from "./CheckInSection";
import type { LocalGuideEntryRow } from "@/lib/guide/types";

/** Guest "Local guide" screen — filter chips + host-picked places. */
export function LocalGuideSection({
  token,
  heading = "Local guide",
  entries,
}: {
  token?: string;
  heading?: string;
  entries: LocalGuideEntryRow[];
}) {
  return (
    <>
      <GuestHeader
        backHref={token ? `/g/${token}` : undefined}
        title={heading}
      />
      <div className="px-4.5 pb-8 pt-4">
        {entries.length > 0 ? (
          <LocalGuideView entries={entries} />
        ) : (
          <EmptyHint>Add a few nearby spots you actually recommend.</EmptyHint>
        )}
      </div>
    </>
  );
}
