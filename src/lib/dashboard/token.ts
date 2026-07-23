import "server-only";
import { randomBytes } from "crypto";

const ALPHABET = "abcdefghijkmnpqrstuvwxyz23456789"; // no ambiguous chars

/** Generates a short, URL-safe, hard-to-guess magic-link token. */
export function generateToken(length = 12): string {
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) out += ALPHABET[bytes[i] % ALPHABET.length];
  return out;
}
