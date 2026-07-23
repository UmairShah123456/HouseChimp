import { requireAccount } from "@/lib/auth/session";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { AccountForm } from "@/components/dashboard/AccountForm";

export default async function AccountPage() {
  const account = await requireAccount();

  return (
    <>
      <PageHeader title="Account" description="Your profile and guest-portal branding." />
      <div className="mx-auto max-w-3xl px-8 py-8">
        <AccountForm account={account} />
      </div>
    </>
  );
}
