import { requireAccount } from "@/lib/auth/session";
import { listProperties } from "@/lib/dashboard/queries";
import { PageHeader } from "@/components/dashboard/PageHeader";

export default async function BillingPage() {
  await requireAccount();
  const properties = await listProperties();

  return (
    <>
      <PageHeader title="Billing" description="Your plan and usage." />
      <div className="mx-auto max-w-3xl px-8 py-8">
        <div className="rounded-[var(--radius-lg)] border-[1.5px] border-border bg-surface p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-accent">
                Current plan
              </div>
              <div className="mt-1 text-2xl font-extrabold text-ink">Free</div>
            </div>
            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-[var(--radius-pill)] bg-accent px-5 py-2.5 text-sm font-bold text-white opacity-60"
              title="Coming soon"
            >
              Upgrade
            </button>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4">
            <div className="rounded-[var(--radius-card)] border-[1.5px] border-border bg-page p-4">
              <div className="text-2xl font-extrabold text-ink">{properties.length}</div>
              <div className="text-[13px] text-muted">Properties</div>
            </div>
            <div className="rounded-[var(--radius-card)] border-[1.5px] border-border bg-page p-4">
              <div className="text-2xl font-extrabold text-ink">Unlimited</div>
              <div className="text-[13px] text-muted">Guests per link</div>
            </div>
          </div>
          <p className="mt-5 text-[13px] text-body">
            Billing is a stub for now — everything is free while HouseChimp is in
            development. Paid plans and invoicing come later.
          </p>
        </div>
      </div>
    </>
  );
}
