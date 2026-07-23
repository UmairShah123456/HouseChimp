"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { revalidateGuide } from "./revalidate";
import { generateToken } from "./token";
import type { FormState } from "@/lib/forms";

async function latestLinkId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  propertyId: string,
): Promise<string | null> {
  const { data } = await supabase
    .from("magic_links")
    .select("id")
    .eq("property_id", propertyId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<{ id: string }>();
  return data?.id ?? null;
}

/** Issue a fresh token (invalidates the old URL) or create the first link. */
export async function regenerateLinkAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const propertyId = String(formData.get("propertyId") ?? "");
  if (!propertyId) return { error: "Missing property." };

  const supabase = await createClient();
  const id = await latestLinkId(supabase, propertyId);
  const token = generateToken();

  const { error } = id
    ? await supabase.from("magic_links").update({ token, view_count: 0 }).eq("id", id)
    : await supabase.from("magic_links").insert({ property_id: propertyId, token });
  if (error) return { error: error.message };

  await revalidateGuide(propertyId);
  revalidatePath(`/properties/${propertyId}/link-settings`);
  revalidatePath(`/properties/${propertyId}`);
  return { ok: true, message: "New link generated. The old URL no longer works." };
}

/** Update expiry + optional PIN on the current link. */
export async function updateLinkSettingsAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const propertyId = String(formData.get("propertyId") ?? "");
  const expiry = String(formData.get("expires_at") ?? "").trim();
  const pin = String(formData.get("pin") ?? "").trim();
  if (!propertyId) return { error: "Missing property." };

  const supabase = await createClient();
  const id = await latestLinkId(supabase, propertyId);
  if (!id) return { error: "No link to update. Generate one first." };

  const { error } = await supabase
    .from("magic_links")
    .update({
      expires_at: expiry ? new Date(`${expiry}T23:59:59`).toISOString() : null,
      pin: pin || null,
    })
    .eq("id", id);
  if (error) return { error: error.message };

  await revalidateGuide(propertyId);
  revalidatePath(`/properties/${propertyId}/link-settings`);
  revalidatePath(`/properties/${propertyId}`);
  return { ok: true, message: "Link settings saved." };
}
