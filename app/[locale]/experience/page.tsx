import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { ExperiencePageContent } from "@/components/experience/experience-page-content";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "experience" });
  return { title: t("title") };
}

export default async function ExperiencePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("experience");

  return (
    <div className="container relative z-10 mx-auto max-w-4xl px-4 py-16 md:py-24">
      <ExperiencePageContent title={t("title")} />
    </div>
  );
}
