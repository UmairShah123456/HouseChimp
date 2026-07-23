import { Card } from "@/components/guest/primitives";
import { DirectionsIcon } from "@/components/guest/icons";

/**
 * An address card with an embedded map and a "Directions" button.
 * Uses Google's keyless `?output=embed` map and a `dir/?api=1` deep link, so no
 * API key or coordinates are needed — just the address string.
 */
export function MapCard({ address }: { address: string }) {
  const q = encodeURIComponent(address);
  return (
    <Card className="overflow-hidden">
      <iframe
        src={`https://maps.google.com/maps?q=${q}&z=15&output=embed`}
        title={`Map showing ${address}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-[170px] w-full border-0"
      />
      <div className="flex items-center justify-between gap-3 px-4 py-3.5">
        <div className="min-w-0">
          <div className="truncate text-[15px] font-bold text-ink">{address}</div>
        </div>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${q}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-none items-center gap-1.5 rounded-[var(--radius-pill)] bg-accent-subtle px-3.5 py-2 text-xs font-bold text-accent"
        >
          <DirectionsIcon className="h-3.5 w-3.5" />
          Directions
        </a>
      </div>
    </Card>
  );
}
