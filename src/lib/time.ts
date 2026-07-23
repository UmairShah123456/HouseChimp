/** Half-hour clock options in 24h format: "00:00", "00:30", … "23:30". */
export const TIME_OPTIONS: string[] = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2);
  const m = i % 2 === 0 ? "00" : "30";
  return `${String(h).padStart(2, "0")}:${m}`;
});

/**
 * Builds a guest chip label from a stored 24h time — a "HH:MM" value gets the
 * fixed prefix ("Check-in from 15:00"). A legacy full phrase is shown as-is so
 * old data never double-labels. Returns null when empty.
 */
export function timeChip(value: string | undefined | null, prefix: string): string | null {
  const t = (value ?? "").trim();
  if (!t) return null;
  if (!/^\d{1,2}:\d{2}$/.test(t)) return t;
  return `${prefix} ${t}`;
}
