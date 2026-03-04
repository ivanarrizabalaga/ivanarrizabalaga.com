import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getProfile, getInterestingFacts } from "@/lib/data";
import { Link } from "@/i18n/navigation";
import ReactMarkdown from "react-markdown";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const profile = getProfile(locale as "en" | "es");
  const interestingFacts = getInterestingFacts(locale as "en" | "es");
  const t = await getTranslations("home");

  return (
    <div className="container relative z-10 mx-auto max-w-3xl px-4 py-16 md:py-24">
      <section className="space-y-6">
        <h1 className="font-mono text-3xl font-bold tracking-tight md:text-4xl">
          {profile.name} {profile.surnames}
        </h1>
        <p className="text-xl text-foreground/80">{profile.title}</p>
        <p className="text-lg leading-relaxed text-foreground/70">
          {interestingFacts[0] && (
            <span className="rounded-md bg-foreground/5 px-2 py-1 font-mono text-sm">
              {t("firstComputer")}: {interestingFacts[0].fact}
            </span>
          )}{" "}
          — {t("bio")}
        </p>
      </section>

      <section className="mt-12 space-y-4">
        <h2 className="font-mono text-lg font-semibold">{t("about")}</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none text-foreground/80">
          <ReactMarkdown>{profile.description}</ReactMarkdown>
        </div>
      </section>

      <section className="mt-12 flex flex-wrap gap-4">
        <Link
          href="/experience"
          className="inline-flex h-11 items-center justify-center rounded-md bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
        >
          {t("cta.experience")}
        </Link>
        <Link
          href="/skills"
          className="inline-flex h-11 items-center justify-center rounded-md border border-border px-6 text-sm font-medium transition-colors hover:bg-accent"
        >
          {t("cta.skills")}
        </Link>
        <Link
          href="/contact"
          className="inline-flex h-11 items-center justify-center rounded-md border border-border px-6 text-sm font-medium transition-colors hover:bg-accent"
        >
          {t("cta.contact")}
        </Link>
      </section>
    </div>
  );
}
