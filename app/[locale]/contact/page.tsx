import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getProfile, getRelevantLinks } from "@/lib/data";

type Props = { params: Promise<{ locale: string }> };

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const profile = getProfile(locale as "en" | "es");
  const links = getRelevantLinks(locale as "en" | "es");
  const t = await getTranslations("contact");

  const linkedin = links.find((l) => l.type === "linkedin");
  const github = links.find((l) => l.type === "github");

  return (
    <div className="container relative z-10 mx-auto max-w-3xl px-4 py-16 md:py-24">
      <h1 className="font-mono text-2xl font-bold md:text-3xl">{t("title")}</h1>

      <div className="mt-12 space-y-8">
        <div>
          <h2 className="font-mono text-lg font-semibold">{t("location")}</h2>
          {profile.location && (
            <p className="mt-2 text-foreground/80">
              {profile.location.municipality}, {profile.location.region},{" "}
              {profile.location.country}
            </p>
          )}
        </div>

        <div>
          <h2 className="font-mono text-lg font-semibold">Links</h2>
          <div className="mt-4 flex gap-4">
            {linkedin && (
              <a
                href={linkedin.URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-foreground/10 px-4 py-2 font-medium transition-colors hover:bg-foreground/20"
              >
                LinkedIn
              </a>
            )}
            {github && (
              <a
                href={github.URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-foreground/10 px-4 py-2 font-medium transition-colors hover:bg-foreground/20"
              >
                GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
