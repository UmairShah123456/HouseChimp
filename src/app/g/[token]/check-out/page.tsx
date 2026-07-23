import { getGuide } from "@/lib/guide/resolve";
import { sectionContent } from "@/lib/guide/types";
import { sectionDisplayName } from "@/lib/guide/defaults";
import { GuestScreen } from "@/components/guest/GuestScreen";
import { GuestFallback } from "@/components/guest/GuestFallback";
import { CheckOutSection } from "@/components/guest/sections/CheckOutSection";

export const dynamic = "force-dynamic";

export default async function CheckOutScreen({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const res = await getGuide(token);
  if (res.status !== "ok") return <GuestFallback status={res.status} />;

  const { guide } = res;
  return (
    <GuestScreen token={token} hue={guide.account.accent_hue} active="rules" sectionTitles={guide.property.section_titles}>
      <CheckOutSection
        token={token}
        heading={sectionDisplayName("check_out", guide.property.section_titles)}
        checkout={sectionContent(guide, "check_out")}
      />
    </GuestScreen>
  );
}
