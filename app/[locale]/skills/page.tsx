import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import {
  getStudies,
  getRecommendations,
  getHardSkills,
  getLanguages,
} from "@/lib/data";

type Props = { params: Promise<{ locale: string }> };

export default async function SkillsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const studies = getStudies(locale as "en" | "es");
  const recommendations = getRecommendations(locale as "en" | "es");
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
  const sortedRecommendations = [...recommendations].sort((a, b) => {
    const dateA = a.publicationDate
      ? new Date(a.publicationDate).getTime()
      : 0;
    const dateB = b.publicationDate
      ? new Date(b.publicationDate).getTime()
      : 0;
    return dateB - dateA;
  });

  const sections: { id: string; label: string }[] = [
    { id: "languages", label: t("languages") },
    { id: "education", label: t("education") },
    ...(certifications.length > 0
      ? [{ id: "courses", label: t("courses") }]
      : []),
    { id: "books", label: t("books") },
  ];

  return (
    <div className="container relative z-10 mx-auto max-w-3xl px-4 py-16 md:py-24">
      <div className="sticky top-[var(--header-height)] z-40 -mx-4 border-b border-border/40 bg-background/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <h1 className="font-mono text-2xl font-bold md:text-3xl">{t("title")}</h1>
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

      <section id="languages" className="mt-12 scroll-mt-40">
        <h2 className="font-mono text-lg font-semibold">{t("languages")}</h2>
        <ul className="mt-4 space-y-2">
          {languages.map((lang) => (
            <li key={lang.name}>
              {lang.fullName} — {lang.level}
            </li>
          ))}
        </ul>
      </section>

      <section id="education" className="mt-12 scroll-mt-40">
        <h2 className="font-mono text-lg font-semibold">{t("education")}</h2>
        <ul className="mt-4 space-y-4">
          {degrees.map((s) => (
            <li key={s.name} className="rounded-lg border border-border p-4">
              <h3 className="font-medium">{s.name}</h3>
              <p className="text-sm text-foreground/70">{s.institution.name}</p>
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
        <section id="courses" className="mt-12 scroll-mt-40">
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
                <p className="text-sm text-foreground/70">{s.institution.name}</p>
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

      <section id="books" className="mt-12 scroll-mt-40">
        <h2 className="font-mono text-lg font-semibold">{t("books")}</h2>
        <ul className="mt-4 space-y-4">
          {sortedRecommendations.map((r) => (
            <li key={r.title} className="rounded-lg border border-border p-4">
              <a
                href={r.URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:underline"
              >
                {r.title}
              </a>
              {r.authors?.length && (
                <p className="mt-1 text-sm text-foreground/70">
                  {r.authors.map((a) => `${a.name} ${a.surnames}`).join(", ")}
                </p>
              )}
              {r.publicationDate && (
                <p className="mt-1 text-xs text-foreground/50">
                  {new Date(r.publicationDate).getFullYear()}
                </p>
              )}
              {r.summary && (
                <p className="mt-2 text-sm text-foreground/60">{r.summary}</p>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
