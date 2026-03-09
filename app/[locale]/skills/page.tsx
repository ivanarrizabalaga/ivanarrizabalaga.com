import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import {
  getStudies,
  getHardSkills,
  getLanguages,
} from "@/lib/data";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "skills" });
  return { title: t("title") };
}

export default async function SkillsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const studies = getStudies(locale as "en" | "es");
  const hardSkills = getHardSkills(locale as "en" | "es");
  const languages = getLanguages(locale as "en" | "es");
  const t = await getTranslations("skills");

  const degrees = studies
    .filter((s) => s.studyType === "officialDegree")
    .sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );
  const certifications = studies
    .filter((s) => s.studyType === "certification")
    .sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );

  const sections: { id: string; label: string }[] = [
    { id: "languages", label: t("languages") },
    { id: "education", label: t("education") },
    ...(certifications.length > 0
      ? [{ id: "courses", label: t("courses") }]
      : []),
  ];

  return (
    <div className="container relative z-10 mx-auto max-w-3xl px-4 py-16 md:py-24">
      <div className="sticky top-[var(--header-height)] z-40 -mx-4 border-b border-border/40 bg-background/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:top-0">
        <h1 className="font-mono text-2xl font-bold tracking-tight text-foreground md:text-3xl">{t("title")}</h1>
        <nav
          className="mt-6 flex flex-wrap gap-2"
          aria-label={t("navLabel")}
        >
          {sections.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className="rounded-md bg-foreground/10 px-3 py-1.5 font-mono text-sm transition-colors hover:bg-foreground/20"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>

      <section id="languages" className="mt-12 scroll-mt-[calc(var(--header-height)+8rem)]">
        <h2 className="font-mono text-lg font-semibold">{t("languages")}</h2>
        <ul className="mt-4 space-y-2 text-base text-foreground/80">
          {languages.map((lang) => (
            <li key={lang.name}>
              {lang.fullName} — {lang.description}
            </li>
          ))}
        </ul>
      </section>

      <section id="education" className="mt-12 scroll-mt-[calc(var(--header-height)+8rem)]">
        <h2 className="font-mono text-lg font-semibold">{t("education")}</h2>
        <ul className="mt-4 space-y-4">
          {degrees.map((s) => (
            <li key={s.name} className="rounded-lg border border-border p-4">
              <h3 className="font-medium">{s.name}</h3>
              <p className="text-base text-foreground/70">{s.institution.name}</p>
              {s.finishDate && (
                <p className="mt-1 text-xs text-foreground/50">
                  {new Date(s.finishDate).getFullYear()}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>

      {certifications.length > 0 && (
        <section id="courses" className="mt-12 scroll-mt-[calc(var(--header-height)+8rem)]">
          <h2 className="font-mono text-lg font-semibold">{t("courses")}</h2>
          <ul className="mt-4 space-y-4">
            {certifications.map((s) => (
              <li key={s.name} className="rounded-lg border border-border p-4">
                <a
                  href={s.institution.URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:underline"
                >
                  {s.name}
                </a>
                <p className="text-base text-foreground/70">{s.institution.name}</p>
                {(s.finishDate || s.startDate) && (
                  <p className="mt-1 text-xs text-foreground/50">
                    {new Date(s.finishDate ?? s.startDate).getFullYear()}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
