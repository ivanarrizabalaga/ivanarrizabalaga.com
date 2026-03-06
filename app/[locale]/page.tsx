import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getProfile } from "@/lib/data";
import ReactMarkdown from "react-markdown";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const profile = getProfile(locale as "en" | "es");
  const t = await getTranslations("home");

  return (
    <div className="container relative z-10 mx-auto max-w-3xl px-4 py-16 md:py-24">
      <section className="space-y-6">
        <h1 className="font-mono text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {t("title")}
        </h1>
        <p className="text-xl text-foreground/80">{profile.title}</p>
      </section>

      <section className="mt-12 space-y-4">
        <div className="prose prose-neutral dark:prose-invert max-w-none text-foreground/80 prose-headings:text-foreground prose-strong:text-foreground">
          <ReactMarkdown>{profile.description}</ReactMarkdown>
        </div>
      </section>

    </div>
  );
}
