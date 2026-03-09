import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getPosts, getTalks, getRecommendations } from "@/lib/data";
import { getYouTubeVideoId } from "@/lib/utils";

type Props = { params: Promise<{ locale: string }> };

export default async function WritingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const posts = getPosts(locale as "en" | "es");
  const talks = getTalks(locale as "en" | "es");
  const recommendations = getRecommendations(locale as "en" | "es");
  const t = await getTranslations("writing");

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
    { id: "posts", label: t("posts") },
    { id: "talks", label: t("talks") },
    { id: "readings", label: t("readings") },
  ];

  return (
    <div className="container relative z-10 mx-auto max-w-3xl px-4 py-16 md:py-24">
      <div className="sticky top-[var(--header-height)] z-40 -mx-4 border-b border-border/40 bg-background/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:top-0">
        <h1 className="font-mono text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {t("title")}
        </h1>
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

      <section
        id="posts"
        className="mt-12 scroll-mt-[calc(var(--header-height)+8rem)]"
      >
        <h2 className="font-mono text-lg font-semibold">{t("posts")}</h2>
        <ul className="mt-4 space-y-6">
          {posts.map((post) => (
            <li key={post.details.URL || post.details.name}>
              <a
                href={post.details.URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg border border-border p-4 transition-colors hover:bg-accent"
              >
                <h3 className="font-medium">{post.details.name}</h3>
                {post.details.description && (
                  <p className="mt-1 text-base text-foreground/70">
                    {post.details.description}
                  </p>
                )}
                {post.publishingDate && (
                  <p className="mt-2 text-xs text-foreground/50">
                    {new Date(post.publishingDate).toLocaleDateString(
                      locale,
                      {
                        year: "numeric",
                        month: "short",
                      }
                    )}
                  </p>
                )}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="talks"
        className="mt-12 scroll-mt-[calc(var(--header-height)+8rem)]"
      >
        <h2 className="font-mono text-lg font-semibold">{t("talks")}</h2>
        <ul className="mt-4 space-y-6">
          {talks.map((talk) => {
            const videoId = talk.details.URL
              ? getYouTubeVideoId(talk.details.URL)
              : null;
            return (
              <li
                key={talk.details.URL || talk.details.name}
                className="rounded-lg border border-border p-4"
              >
                <h3 className="font-medium">{talk.details.name}</h3>
                {talk.details.description && (
                  <p className="mt-1 text-base text-foreground/70">
                    {talk.details.description}
                  </p>
                )}
                {talk.publishingDate && (
                  <p className="mt-2 text-xs text-foreground/50">
                    {new Date(talk.publishingDate).toLocaleDateString(locale, {
                      year: "numeric",
                      month: "short",
                    })}
                  </p>
                )}
                {videoId && (
                  <div className="mt-4 aspect-video w-full overflow-hidden rounded-lg">
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={talk.details.name}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="h-full w-full"
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section
        id="readings"
        className="mt-12 scroll-mt-[calc(var(--header-height)+8rem)]"
      >
        <h2 className="font-mono text-lg font-semibold">{t("readings")}</h2>
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
                <p className="mt-1 text-base text-foreground/70">
                  {r.authors.map((a) => `${a.name} ${a.surnames}`).join(", ")}
                </p>
              )}
              {r.publicationDate && (
                <p className="mt-1 text-xs text-foreground/50">
                  {new Date(r.publicationDate).getFullYear()}
                </p>
              )}
              {r.summary && (
                <p className="mt-2 text-base text-foreground/70">{r.summary}</p>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
