/**
 * Decorative right-hand panel for the split-screen auth pages. A brand-teal
 * gradient with crisp geometric shapes (rings, diamonds, a dot grid and a gold
 * spark) plus a short marketing line. Purely visual — hidden on small screens.
 */
export function AuthArt() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-accent via-accent-hover to-ink">
      {/* Large soft ring, bottom-right */}
      <div className="absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full border-[56px] border-white/[0.06]" />
      {/* Filled circle, top-right */}
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/[0.07]" />
      {/* Rotated diamond */}
      <div className="absolute left-16 top-1/2 h-28 w-28 -translate-y-1/2 rotate-45 rounded-[18px] bg-accent-soft/25" />
      {/* Quarter-arc accent */}
      <div className="absolute bottom-24 left-[-3rem] h-56 w-56 rounded-full border-[28px] border-accent-gold/30 [clip-path:polygon(0_0,100%_0,100%_100%)]" />

      {/* Dot grid, top-left */}
      <svg
        className="absolute left-12 top-14 text-white/25"
        width="132"
        height="132"
        fill="currentColor"
        aria-hidden="true"
      >
        <defs>
          <pattern id="authDots" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="2.5" cy="2.5" r="2.5" />
          </pattern>
        </defs>
        <rect width="132" height="132" fill="url(#authDots)" />
      </svg>

      {/* Gold spark */}
      <svg
        className="absolute right-24 top-1/3 text-accent-gold"
        width="88"
        height="88"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 0c.7 5.2 1.8 6.3 12 12-10.2 5.7-11.3 6.8-12 12-.7-5.2-1.8-6.3-12-12C10.2 6.3 11.3 5.2 12 0Z" />
      </svg>

      {/* Thin lines */}
      <div className="absolute right-16 bottom-1/3 h-px w-40 rotate-[-20deg] bg-white/15" />
      <div className="absolute right-16 bottom-1/3 mt-2 h-px w-40 translate-y-2 rotate-[-20deg] bg-white/15" />

      {/* Marketing copy */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-12 text-white">
        <h2 className="max-w-sm text-[28px] font-extrabold leading-tight">
          Guest guides that feel like you.
        </h2>
        <p className="max-w-sm text-[15px] leading-relaxed text-white/70">
          Check-in, Wi-Fi, parking and your local picks — everything your guests
          need, in one beautiful branded link.
        </p>
      </div>
    </div>
  );
}
