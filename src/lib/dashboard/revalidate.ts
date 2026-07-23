import "server-only";
import { revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { guideTag } from "@/lib/guide/resolve";

/**
 * Invalidate the cached guest guide for every magic-link token of a property,
 * so host edits show up for guests immediately instead of waiting out the
 * Data Cache window. Call after any mutation that changes guest-visible content.
 */
export async function revalidateGuide(propertyId: string): Promise<void> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("magic_links")
    .select("token")
    .eq("property_id", propertyId);
  for (const row of (data ?? []) as { token: string }[]) {
    revalidateTag(guideTag(row.token));
  }
}

/**
 * Invalidate cached guides for every property in an account. Used after
 * account-wide changes (e.g. accent colour) that affect every guest guide.
 */
export async function revalidateAccountGuides(accountId: string): Promise<void> {
  const supabase = await createClient();
  const { data: props } = await supabase
    .from("properties")
    .select("id")
    .eq("account_id", accountId);
  const ids = ((props ?? []) as { id: string }[]).map((p) => p.id);
  if (ids.length === 0) return;

  const { data: links } = await supabase
    .from("magic_links")
    .select("token")
    .in("property_id", ids);
  for (const row of (links ?? []) as { token: string }[]) {
    revalidateTag(guideTag(row.token));
  }
}
