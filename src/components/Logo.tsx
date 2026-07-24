/* eslint-disable @next/next/no-img-element */

/** GuideChimp wordmark + mascot. Fixed brand colour; size via `className` height. */
export function Logo({ className = "h-8 w-auto" }: { className?: string }) {
  return <img src="/guidechimp-logo-prim.svg" alt="GuideChimp" className={className} />;
}
