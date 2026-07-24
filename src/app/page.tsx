import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-page">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Logo className="h-7 w-auto" />
        <nav className="flex items-center gap-2 text-sm font-semibold">
          <Link
            href="/login"
            className="rounded-[var(--radius-pill)] px-4 py-2 text-ink transition-colors hover:text-accent"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-[var(--radius-pill)] bg-accent px-4 py-2 text-white"
          >
            Get started
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-6">
        <section className="py-16 md:py-24">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-accent">
            For short-let & serviced accommodation hosts
          </p>
          <h1 className="mt-4 max-w-3xl text-[44px] font-extrabold leading-[1.05] text-ink md:text-6xl">
            A beautiful digital guidebook for every guest, every stay.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-body">
            Parking, check-in, Wi-Fi, house rules and your favourite local spots —
            branded to you, shared with one magic link, viewed on any phone.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="rounded-[var(--radius-pill)] bg-accent px-6 py-3.5 text-[15px] font-bold text-white"
            >
              Build your first guide
            </Link>
            <Link
              href="/g/demo-aspects-court"
              className="rounded-[var(--radius-pill)] border-[1.5px] border-border bg-surface px-6 py-3.5 text-[15px] font-bold text-ink"
            >
              View a live demo
            </Link>
          </div>
        </section>

        <section className="grid gap-4 pb-20 md:grid-cols-3">
          {[
            {
              title: "One link per property",
              body: "Every property gets a unique magic link and QR code. No apps, no logins for guests.",
            },
            {
              title: "Video how-tos, not manuals",
              body: "Upload short clips for the heating, the TV, the washer — whatever always gets asked.",
            },
            {
              title: "Your brand, your voice",
              body: "Your accent colour and your local picks, with commentary that sounds like you.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-[var(--radius-lg)] border-[1.5px] border-border bg-surface p-6"
            >
              <div className="text-lg font-bold text-ink">{f.title}</div>
              <p className="mt-2 text-[14px] leading-relaxed text-body">{f.body}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-muted">
          © {new Date().getFullYear()} GuideChimp
        </div>
      </footer>
    </div>
  );
}
