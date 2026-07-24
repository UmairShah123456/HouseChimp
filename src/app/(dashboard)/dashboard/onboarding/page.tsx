import { redirect } from "next/navigation";
import { requireUser, getActiveAccount } from "@/lib/auth/session";
import { OnboardingForm } from "@/components/dashboard/OnboardingForm";

export default async function OnboardingPage() {
  await requireUser();
  const account = await getActiveAccount();
  if (account) redirect("/dashboard");

  return (
    <div className="flex min-h-dvh items-center justify-center px-6 py-10">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-extrabold text-ink">Welcome to GuideChimp 👋</h1>
        <p className="mt-1.5 text-sm text-body">
          Let&apos;s set up your account and your first property. You can add more
          properties and fill in the guide right after.
        </p>
        <div className="mt-6 rounded-[var(--radius-lg)] border-[1.5px] border-border bg-surface p-6">
          <OnboardingForm />
        </div>
      </div>
    </div>
  );
}
