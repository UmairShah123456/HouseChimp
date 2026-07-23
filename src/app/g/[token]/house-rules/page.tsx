import { getGuide } from "@/lib/guide/resolve";
import { sectionContent } from "@/lib/guide/types";
import { sectionDisplayName } from "@/lib/guide/defaults";
import { GuestScreen } from "@/components/guest/GuestScreen";
import { GuestFallback } from "@/components/guest/GuestFallback";
import { HouseRulesSection } from "@/components/guest/sections/HouseRulesSection";

export const dynamic = "force-dynamic";

export default async function HouseRulesScreen({
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
      <HouseRulesSection
        token={token}
        heading={sectionDisplayName("house_rules", guide.property.section_titles)}
        rules={sectionContent(guide, "house_rules")}
      />
    </GuestScreen>
  );
}
