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

  const degrees = studies.filter((s) => s.studyType === "officialDegree");
  const certifications = studies.filter((s) => s.studyType === "certification");

  return (
    <div className="container relative z-10 mx-auto max-w-3xl px-4 py-16 md:py-24">
      <h1 className="font-mono text-2xl font-bold md:text-3xl">{t("skills")}</h1>

      <section className="mt-12">
        <h2 className="font-mono text-lg font-semibold">{t("hardSkills")}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {hardSkills.map((h) => (
            <span
              key={h.skill.name}
              className="rounded-md bg-foreground/10 px-3 py-1 font-mono text-sm"
            >
              {h.skill.name}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-mono text-lg font-semibold">{t("languages")}</h2>
        <ul className="mt-4 space-y-2">
          {languages.map((lang) => (
            <li key={lang.name}>
              {lang.fullName} — {lang.level}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
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
        <section className="mt-12">
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
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-12">
        <h2 className="font-mono text-lg font-semibold">{t("books")}</h2>
        <ul className="mt-4 space-y-4">
          {recommendations.map((r) => (
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
