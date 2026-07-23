import "server-only";
import { cache } from "react";
import { getGuestGuide } from "./queries";

/**
 * Request-memoised guide resolver. Both the page and any nested server
 * components can call this for the same token and only one DB round-trip runs.
 */
export const getGuide = cache(getGuestGuide);
