import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

import TalkToIvoContent from "./TalkToIvoContent";

type Props = { params: Promise<{ locale: "en" | "es" }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "talkToIvo" });
  const contactT = await getTranslations({ locale, namespace: "contact" });

  return {
    title: `${t("pageTitle")} – ${contactT("title")}`,
  };
}

export default async function TalkToIvoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <TalkToIvoContent locale={locale} />;
}
