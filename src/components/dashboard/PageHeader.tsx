import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronLeft } from "@/components/guest/icons";

/** Consistent dashboard page header with optional back link + action slot. */
export function PageHeader({
  title,
  description,
  backHref,
  backLabel,
  actions,
}: {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="border-b border-border bg-surface">
      <div className="mx-auto max-w-5xl px-8 py-6">
        {backHref && (
          <Link
            href={backHref}
            className="mb-2 inline-flex items-center gap-1 text-[13px] font-semibold text-muted hover:text-ink"
          >
            <ChevronLeft className="h-4 w-4" />
            {backLabel ?? "Back"}
          </Link>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-extrabold text-ink">{title}</h1>
            {description && <p className="mt-1 text-sm text-body">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
