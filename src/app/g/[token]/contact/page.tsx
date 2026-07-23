import { getGuide } from "@/lib/guide/resolve";
import { sectionContent } from "@/lib/guide/types";
import { sectionDisplayName } from "@/lib/guide/defaults";
import { GuestScreen } from "@/components/guest/GuestScreen";
import { GuestFallback } from "@/components/guest/GuestFallback";
import { ContactSection } from "@/components/guest/sections/ContactSection";

export const dynamic = "force-dynamic";

export default async function ContactScreen({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const res = await getGuide(token);
  if (res.status !== "ok") return <GuestFallback status={res.status} />;

  const { guide } = res;
  return (
    <GuestScreen token={token} hue={guide.account.accent_hue} active="contact" sectionTitles={guide.property.section_titles}>
      <ContactSection
        token={token}
        heading={sectionDisplayName("emergency_contacts", guide.property.section_titles)}
        contact={sectionContent(guide, "emergency_contacts")}
      />
    </GuestScreen>
  );
}
