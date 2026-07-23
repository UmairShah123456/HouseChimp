import { notFound } from "next/navigation";
import { requireAccount } from "@/lib/auth/session";
import { getHostProperty } from "@/lib/dashboard/queries";
import { env } from "@/lib/env";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { MagicLinkCard } from "@/components/dashboard/MagicLinkCard";
import { LinkSettingsForm } from "@/components/dashboard/LinkSettingsForm";

export default async function LinkSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAccount();
  const { id } = await params;
  const data = await getHostProperty(id);
  if (!data) notFound();

  const { property, link } = data;

  return (
    <>
      <PageHeader
        title="Link settings"
        description={property.name}
        backHref={`/properties/${id}`}
        backLabel="Back to property"
      />
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-8 py-8">
        <MagicLinkCard
          propertyId={property.id}
          token={link?.token ?? null}
          appUrl={env.appUrl}
          viewCount={link?.view_count ?? 0}
          expiresAt={link?.expires_at ?? null}
          hasPin={Boolean(link?.pin)}
        />
        <LinkSettingsForm
          propertyId={property.id}
          expiresAt={link?.expires_at ?? null}
          pin={link?.pin ?? null}
        />
      </div>
    </>
  );
}
