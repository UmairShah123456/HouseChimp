import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getGuestGuide } from "./queries";

/** Cache tag for a token's resolved guide, so host saves can invalidate it. */
export function guideTag(token: string): string {
  return `guide:${token}`;
}

/**
 * Guest guide resolver with two cache layers:
 *  - `unstable_cache`: cross-request Data Cache so repeated guest views and tab
 *    switches reuse the same DB read instead of round-tripping to Supabase every
 *    time. Keyed + tagged per token; host saves call {@link revalidateGuide} to
 *    invalidate it, and a 5-minute window bounds staleness as a safety net.
 *    (Safe to cache — the guest path uses the service-role client with no
 *    cookies/headers.)
 *  - React `cache()`: per-request memoisation across nested server components.
 */
export const getGuide = cache((token: string) =>
  unstable_cache(() => getGuestGuide(token), ["guest-guide", token], {
    tags: [guideTag(token)],
    revalidate: 300,
  })(),
);
