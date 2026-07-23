"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { FormState } from "@/lib/forms";
import type { GuideSectionType, SectionTitles } from "@/lib/guide/types";

/**
 * Rename a built-in section. The override is stored on the property and drives
 * both the host dashboard list and the guest home tile, so there is a single
 * name per section. Blank values clear the override (falling back to defaults).
 */
export async function renameSection(
  propertyId: string,
  type: GuideSectionType,
  title: string,
  subtitle: string,
): Promise<FormState> {
  const supabase = await createClient();

  const { data: property, error: readErr } = await supabase
    .from("properties")
    .select("section_titles")
    .eq("id", propertyId)
    .single<{ section_titles: SectionTitles | null }>();
  if (readErr) return { error: readErr.message };

  const titles: SectionTitles = { ...(property?.section_titles ?? {}) };
  const t = title.trim();
  const s = subtitle.trim();
  // Preserve any other keys on this section (e.g. the `enabled` toggle).
  const next = { ...(titles[type] ?? {}) };
  if (t) next.title = t;
  else delete next.title;
  if (s) next.subtitle = s;
  else delete next.subtitle;
  if (Object.keys(next).length === 0) delete titles[type];
  else titles[type] = next;

  const { error } = await supabase
    .from("properties")
    .update({ section_titles: titles })
    .eq("id", propertyId);
  if (error) return { error: error.message };

  revalidatePath(`/properties/${propertyId}`);
  return { ok: true };
}

/** Turn a built-in section's home tile on or off. Stored on the property. */
export async function setSectionEnabled(
  propertyId: string,
  type: GuideSectionType,
  enabled: boolean,
): Promise<FormState> {
  const supabase = await createClient();

  const { data: property, error: readErr } = await supabase
    .from("properties")
    .select("section_titles")
    .eq("id", propertyId)
    .single<{ section_titles: SectionTitles | null }>();
  if (readErr) return { error: readErr.message };

  const titles: SectionTitles = { ...(property?.section_titles ?? {}) };
  titles[type] = { ...(titles[type] ?? {}), enabled };

  const { error } = await supabase
    .from("properties")
    .update({ section_titles: titles })
    .eq("id", propertyId);
  if (error) return { error: error.message };

  revalidatePath(`/properties/${propertyId}`);
  return { ok: true };
}

/** Create a blank custom section and return its id so the caller can open it. */
export async function createCustomSection(
  propertyId: string,
): Promise<{ id?: string; error?: string }> {
  const supabase = await createClient();

  const { data: last } = await supabase
    .from("custom_sections")
    .select("position")
    .eq("property_id", propertyId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle<{ position: number }>();

  const { data, error } = await supabase
    .from("custom_sections")
    .insert({ property_id: propertyId, title: "", position: (last?.position ?? -1) + 1 })
    .select("id")
    .single<{ id: string }>();
  if (error || !data) return { error: error?.message ?? "Could not create section." };

  revalidatePath(`/properties/${propertyId}`);
  return { id: data.id };
}

/** Turn a custom section's home tile on or off. */
export async function setCustomSectionEnabled(
  propertyId: string,
  id: string,
  enabled: boolean,
): Promise<FormState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("custom_sections")
    .update({ enabled })
    .eq("id", id)
    .eq("property_id", propertyId);
  if (error) return { error: error.message };

  revalidatePath(`/properties/${propertyId}`);
  return { ok: true };
}

/** Update a custom section's title / subtitle / body. */
export async function saveCustomSection(
  propertyId: string,
  id: string,
  content: { title: string; subtitle: string; body: string },
): Promise<FormState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("custom_sections")
    .update({
      title: content.title.trim(),
      subtitle: content.subtitle.trim() || null,
      body: content.body.trim() || null,
    })
    .eq("id", id)
    .eq("property_id", propertyId);
  if (error) return { error: error.message };

  revalidatePath(`/properties/${propertyId}`);
  return { ok: true };
}

/** Delete a custom section. */
export async function deleteCustomSection(
  propertyId: string,
  id: string,
): Promise<FormState> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("custom_sections")
    .delete()
    .eq("id", id)
    .eq("property_id", propertyId);
  if (error) return { error: error.message };

  revalidatePath(`/properties/${propertyId}`);
  return { ok: true };
}
