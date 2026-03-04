import { setRequestLocale } from "next-intl/server";
import { ExperienceTimeline } from "@/components/experience/experience-timeline";

type Props = { params: Promise<{ locale: string }> };

export default async function ExperiencePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="container relative z-10 mx-auto max-w-4xl px-4 py-16 md:py-24">
      <ExperienceTimeline />
    </div>
  );
}
