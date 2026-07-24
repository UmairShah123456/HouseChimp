import Link from "next/link";
import { Logo } from "@/components/Logo";
import { AuthArt } from "@/components/auth/AuthArt";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-surface">
      {/* Left: form */}
      <div className="flex w-full flex-col px-6 py-8 sm:px-10 lg:w-1/2 lg:px-16 xl:px-24">
        <header>
          <Link href="/" className="inline-block">
            <Logo className="h-8 w-auto" />
          </Link>
        </header>

        <main className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">{children}</div>
        </main>

        <footer className="text-xs text-muted">
          © {new Date().getFullYear()} GuideChimp
        </footer>
      </div>

      {/* Right: decorative brand panel */}
      <div className="hidden lg:block lg:w-1/2">
        <AuthArt />
      </div>
    </div>
  );
}
