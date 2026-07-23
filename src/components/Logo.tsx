/* eslint-disable @next/next/no-img-element */

/** HouseChimp wordmark + mascot. Fixed brand colour; size via `className` height. */
export function Logo({ className = "h-8 w-auto" }: { className?: string }) {
  return <img src="/logo.svg" alt="HouseChimp" className={className} />;
}
