import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Only the authenticated host app needs a session refresh + auth gate. Guest
  // routes (/g/*), the landing page and auth pages use the service-role client
  // or no auth at all, so keeping middleware off them avoids a Supabase
  // auth round-trip on every navigation.
  matcher: ["/dashboard/:path*", "/properties/:path*", "/account/:path*"],
};
