import { GuestHeader } from "@/components/guest/GuestHeader";
import { SectionLabel } from "@/components/guest/primitives";
import { VideoCard } from "@/components/guest/VideoCard";
import { EmptyHint } from "./CheckInSection";
import type { AmenitiesContent } from "@/lib/guide/types";

export interface PreviewVideo {
  id?: string;
  title: string;
  subtitle?: string;
  url?: string;
}

/** Guest "How stuff works" screen — amenity video guides. */
export function WifiAmenitiesSection({
  token,
  heading = "How stuff works",
  amenities,
  videos,
}: {
  token?: string;
  heading?: string;
  amenities: AmenitiesContent | null;
  videos: PreviewVideo[];
}) {
  return (
    <>
      <GuestHeader
        backHref={token ? `/g/${token}` : undefined}
        title={heading}
      />

      <div className="flex flex-col gap-3 px-4.5 pb-8 pt-4.5">
        {videos.length > 0 ? (
          <div className="flex flex-col gap-2">
            <SectionLabel>Video guides</SectionLabel>
            <div className="grid grid-cols-2 gap-2.5">
              {videos.map((v, i) => (
                <VideoCard
                  key={v.id ?? i}
                  title={v.title || "Guide"}
                  subtitle={v.subtitle}
                  url={v.url || undefined}
                  href={token && v.id ? `/g/${token}/video/${v.id}` : undefined}
                />
              ))}
            </div>
          </div>
        ) : (
          <EmptyHint>Add short video guides for the things guests always ask about.</EmptyHint>
        )}

        {amenities?.askNote && (
          <div className="flex items-center justify-between rounded-[var(--radius-card)] border-[1.5px] border-border bg-surface px-4 py-3.5">
            <span className="text-[13px] text-body">{amenities.askNote}</span>
            <span className="text-[12.5px] font-bold text-accent">
              {amenities.askLabel || "Ask the host"} →
            </span>
          </div>
        )}
      </div>
    </>
  );
}
