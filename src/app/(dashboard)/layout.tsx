import { requireUser, getActiveAccount } from "@/lib/auth/session";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Logo } from "@/components/Logo";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const account = await getActiveAccount();

  return (
    <>
      {/* Mobile: the host dashboard needs a larger screen. The guest guide is
          fully mobile-friendly — this notice is only for hosts editing. */}
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-page px-8 text-center lg:hidden">
        <Logo className="h-8 w-auto" />
        <h1 className="text-xl font-extrabold text-ink">Best on a bigger screen</h1>
        <p className="max-w-xs text-sm leading-relaxed text-body">
          The GuideChimp dashboard is built for a laptop or desktop. Open it on a
          larger screen to set up and edit your guides.
        </p>
        <p className="max-w-xs text-[13px] text-muted">
          Your guests&apos; guide works perfectly on mobile — this is just for you.
        </p>
      </div>

      {/* Desktop dashboard */}
      <div className="hidden lg:block">
        {!account ? (
          <div className="min-h-dvh bg-page">{children}</div>
        ) : (
          <div className="flex min-h-dvh bg-page">
            <Sidebar accountName={account.name} userEmail={user.email} />
            <main className="min-w-0 flex-1">{children}</main>
          </div>
        )}
      </div>
    </>
  );
}
