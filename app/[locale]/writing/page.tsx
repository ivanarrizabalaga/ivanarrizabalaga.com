import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getPublicArtifacts } from "@/lib/data";

type Props = { params: Promise<{ locale: string }> };

export default async function WritingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const artifacts = getPublicArtifacts(locale as "en" | "es");
  const t = await getTranslations("writing");

  return (
    <div className="container relative z-10 mx-auto max-w-3xl px-4 py-16 md:py-24">
      <div className="sticky top-[var(--header-height)] z-40 -mx-4 border-b border-border/40 bg-background/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <h1 className="font-mono text-2xl font-bold tracking-tight text-foreground md:text-3xl">{t("title")}</h1>
      </div>
      <ul className="mt-8 space-y-6">
        {artifacts.map((artifact) => (
          <li key={artifact.details.URL || artifact.details.name}>
            <a
              href={artifact.details.URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border border-border p-4 transition-colors hover:bg-accent"
            >
              <h3 className="font-medium">{artifact.details.name}</h3>
              {artifact.details.description && (
                <p className="mt-1 text-base text-foreground/70">
                  {artifact.details.description}
                </p>
              )}
              {artifact.publishingDate && (
                <p className="mt-2 text-xs text-foreground/50">
                  {new Date(artifact.publishingDate).toLocaleDateString(locale, {
                    year: "numeric",
                    month: "short",
                  })}
                </p>
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
