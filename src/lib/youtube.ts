/**
 * Extracts a YouTube video id from the common URL shapes:
 *   youtube.com/watch?v=ID · youtu.be/ID · youtube.com/embed/ID · /shorts/ID
 * Returns null for anything that isn't a recognisable YouTube link.
 */
export function youTubeId(url?: string | null): string | null {
  const u = (url ?? "").trim();
  if (!u) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?[^#]*\bv=)([A-Za-z0-9_-]{11})/,
    /(?:youtu\.be\/)([A-Za-z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = p.exec(u);
    if (m) return m[1];
  }
  return null;
}

/** Privacy-friendly embed URL for a YouTube link, or null if not YouTube. */
export function youTubeEmbedUrl(url?: string | null): string | null {
  const id = youTubeId(url);
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}
