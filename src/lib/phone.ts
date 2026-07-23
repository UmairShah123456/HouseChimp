/**
 * Dial-code picker data + helpers shared by the host editor and guest portal.
 * Numbers are stored as a local part plus a separate `dialCode` (e.g. "+44");
 * `fullPhone` recombines them into an international number so WhatsApp/tel/sms
 * links dial the right place.
 */

export interface DialCode {
  code: string; // "+44"
  country: string; // "United Kingdom"
}

/** Common dial codes, UK first (the app's primary market). */
export const DIAL_CODES: DialCode[] = [
  { code: "+44", country: "United Kingdom" },
  { code: "+353", country: "Ireland" },
  { code: "+1", country: "United States / Canada" },
  { code: "+33", country: "France" },
  { code: "+49", country: "Germany" },
  { code: "+34", country: "Spain" },
  { code: "+39", country: "Italy" },
  { code: "+351", country: "Portugal" },
  { code: "+31", country: "Netherlands" },
  { code: "+32", country: "Belgium" },
  { code: "+41", country: "Switzerland" },
  { code: "+43", country: "Austria" },
  { code: "+45", country: "Denmark" },
  { code: "+46", country: "Sweden" },
  { code: "+47", country: "Norway" },
  { code: "+358", country: "Finland" },
  { code: "+48", country: "Poland" },
  { code: "+30", country: "Greece" },
  { code: "+91", country: "India" },
  { code: "+61", country: "Australia" },
  { code: "+64", country: "New Zealand" },
  { code: "+971", country: "United Arab Emirates" },
  { code: "+27", country: "South Africa" },
  { code: "+52", country: "Mexico" },
  { code: "+55", country: "Brazil" },
  { code: "+81", country: "Japan" },
  { code: "+65", country: "Singapore" },
  { code: "+852", country: "Hong Kong" },
];

export const DEFAULT_DIAL_CODE = "+44";

/** Digits only — for wa.me, which wants a bare international number, no "+". */
export const phoneDigits = (v?: string) => (v ?? "").replace(/[^\d]/g, "");

/**
 * Combine a dial code and a local number into a full international number.
 * If the local part already starts with "+", it's treated as already-complete
 * (keeps older entries that stored the whole number working).
 */
export function fullPhone(dialCode: string | undefined, local: string | undefined): string {
  const l = (local ?? "").trim();
  if (!l) return "";
  if (l.startsWith("+")) return l;
  return `${(dialCode ?? "").trim()}${l}`;
}
