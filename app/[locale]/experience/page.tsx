import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { ExperienceTimeline } from "@/components/experience/experience-timeline";

type Props = { params: Promise<{ locale: string }> };

export default async function ExperiencePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("experience");

  return (
    <div className="container relative z-10 mx-auto max-w-4xl px-4 py-16 md:py-24">
      <h1 className="font-mono text-2xl font-bold md:text-3xl">{t("title")}</h1>
      <div className="mt-12">
        <ExperienceTimeline />
      </div>
    </div>
  );
}
