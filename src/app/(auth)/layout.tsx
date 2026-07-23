import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-page">
      <header className="mx-auto w-full max-w-5xl px-6 py-5">
        <Link href="/" className="text-lg font-extrabold tracking-tight text-ink">
          Home<span className="text-accent">Hawk</span>
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-6 py-8">
        <div className="w-full max-w-sm rounded-[var(--radius-lg)] border-[1.5px] border-border bg-surface p-7 shadow-[0_6px_24px_rgba(23,36,46,0.06)]">
          {children}
        </div>
      </main>
    </div>
  );
}
