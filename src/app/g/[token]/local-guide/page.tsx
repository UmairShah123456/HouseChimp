import { getGuide } from "@/lib/guide/resolve";
import { sectionDisplayName } from "@/lib/guide/defaults";
import { GuestScreen } from "@/components/guest/GuestScreen";
import { GuestFallback } from "@/components/guest/GuestFallback";
import { LocalGuideSection } from "@/components/guest/sections/LocalGuideSection";

export const dynamic = "force-dynamic";

export default async function LocalGuideScreen({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const res = await getGuide(token);
  if (res.status !== "ok") return <GuestFallback status={res.status} />;

  const { guide } = res;
  return (
    <GuestScreen token={token} hue={guide.account.accent_hue} active="local" sectionTitles={guide.property.section_titles}>
      <LocalGuideSection
        token={token}
        heading={sectionDisplayName("local_guide", guide.property.section_titles)}
        entries={guide.localEntries}
      />
    </GuestScreen>
  );
}
