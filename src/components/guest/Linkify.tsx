import type { ReactNode } from "react";

// Matches http(s):// URLs and bare www. links.
const URL_RE = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;

/**
 * Renders plain text, turning any URLs into clickable links. Trailing sentence
 * punctuation is kept out of the link. Long URLs wrap instead of overflowing.
 */
export function Linkify({ children }: { children: string }) {
  const text = children ?? "";
  const parts: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  URL_RE.lastIndex = 0;

  while ((m = URL_RE.exec(text)) !== null) {
    let url = m[0];
    // Don't swallow trailing punctuation that's really part of the sentence.
    const trailing = url.match(/[.,;:!?)\]]+$/);
    let tail = "";
    if (trailing) {
      tail = trailing[0];
      url = url.slice(0, -tail.length);
    }
    if (m.index > last) parts.push(text.slice(last, m.index));
    const href = url.startsWith("http") ? url : `https://${url}`;
    parts.push(
      <a
        key={m.index}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="break-all font-semibold text-accent underline underline-offset-2"
      >
        {url}
      </a>,
    );
    if (tail) parts.push(tail);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));

  return <>{parts}</>;
}
