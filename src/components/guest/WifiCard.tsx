import { CopyButton } from "./CopyButton";
import type { WifiContent } from "@/lib/guide/types";

/**
 * Wi-Fi "key info" card — the dark network/password panel with a one-tap copy.
 * Shown directly on the guest home screen (under the hero), the most-asked
 * question answered without a tap through.
 */
export function WifiCard({ wifi }: { wifi: WifiContent | null }) {
  if (!wifi?.network) return null;

  return (
    <div className="rounded-[var(--radius-lg)] bg-dark p-4.5 text-white">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-extrabold tracking-[0.1em] text-accent-gold">
          WI-FI
        </span>
      </div>
      <div className="mt-3 flex gap-2.5">
        <div className="flex-1 rounded-[var(--radius-code)] bg-white/[0.08] px-3.5 py-3">
          <div className="text-[10.5px] font-bold tracking-[0.06em] text-white/50">NETWORK</div>
          <div className="mt-0.5 text-[14.5px] font-bold">{wifi.network}</div>
        </div>
        {wifi.password && (
          <div className="flex-1 rounded-[var(--radius-code)] bg-white/[0.08] px-3.5 py-3">
            <div className="text-[10.5px] font-bold tracking-[0.06em] text-white/50">PASSWORD</div>
            <div className="mt-0.5 text-[14.5px] font-bold tracking-[0.04em]">{wifi.password}</div>
          </div>
        )}
      </div>
      {wifi.password && (
        <div className="mt-3">
          <CopyButton
            value={wifi.password}
            variant="primary"
            label="Tap to copy password"
            copiedLabel="Password copied"
          />
        </div>
      )}
    </div>
  );
}
