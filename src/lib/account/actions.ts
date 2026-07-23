"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getActiveAccount } from "@/lib/auth/session";
import { revalidateAccountGuides } from "@/lib/dashboard/revalidate";
import type { FormState } from "@/lib/forms";

/** Update account profile + branding (name, accent hue). */
export async function updateAccountAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const account = await getActiveAccount();
  if (!account) return { error: "No account found." };

  const name = String(formData.get("name") ?? "").trim();
  const hueRaw = Number(formData.get("accent_hue"));
  if (!name) return { error: "Account name can't be empty." };
  const accentHue = Number.isFinite(hueRaw) ? Math.max(0, Math.min(360, Math.round(hueRaw))) : account.accent_hue;

  const supabase = await createClient();
  const { error } = await supabase
    .from("accounts")
    .update({ name, accent_hue: accentHue })
    .eq("id", account.id);
  if (error) return { error: error.message };

  await revalidateAccountGuides(account.id);
  revalidatePath("/account");
  revalidatePath("/dashboard");
  return { ok: true, message: "Branding saved." };
}
