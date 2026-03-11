"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { getRelevantLinks } from "@/lib/data";

import IvoChat from "./IvoChat";

type Props = { locale: "en" | "es" };

type SessionState = "unknown" | "authorized" | "unauthorized";

export default function TalkToIvoContent({ locale }: Props) {
  const t = useTranslations("talkToIvo");
  const [sessionState, setSessionState] = useState<SessionState>("unknown");
  const [inviteCode, setInviteCode] = useState("");
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  const links = getRelevantLinks(locale);
  const linkedin = links.find((l) => l.type === "linkedin");

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/ivo/session");
        if (!res.ok) {
          setSessionState("unauthorized");
          return;
        }
        const data = (await res.json()) as { authorized?: boolean };
        setSessionState(data.authorized ? "authorized" : "unauthorized");
      } catch {
        setSessionState("unauthorized");
      } finally {
        setCheckingSession(false);
      }
    };

    void checkSession();
  }, []);

  const handleInviteSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setInviteError(null);

    const code = inviteCode.trim();
    if (!code) {
      setInviteError(t("inviteError.required"));
      return;
    }

    try {
      const res = await fetch("/api/ivo/authorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode: code }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setInviteError(data?.error ?? t("inviteError.invalid"));
        setSessionState("unauthorized");
        return;
      }

      setSessionState("authorized");
      setInviteCode("");
      setInviteError(null);
    } catch {
      setInviteError(t("inviteError.network"));
    }
  };

  const showInviteDialog = !checkingSession && sessionState !== "authorized";

  return (
    <div className="container relative z-10 mx-auto max-w-3xl px-4 py-16 md:py-24">
      {showInviteDialog && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/80">
          <div className="w-full max-w-sm rounded-lg border border-border/60 bg-background p-4 shadow-lg">
            <h2 className="font-mono text-sm font-semibold">{t("invite.title")}</h2>
            <p className="mt-1 text-xs text-foreground/70">
              {t("invite.descriptionBeforeLink")}
              {linkedin ? (
                <a
                  href={linkedin.URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-foreground"
                >
                  {t("invite.linkedInLinkText")}
                </a>
              ) : (
                t("invite.linkedInLinkText")
              )}
              {t("invite.descriptionAfterLink")}
            </p>

            <form onSubmit={handleInviteSubmit} className="mt-3 space-y-2">
              <input
                type="password"
                autoComplete="off"
                className="w-full rounded-md border border-border/60 bg-background px-2 py-1 text-sm text-foreground outline-none focus:border-foreground"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder={t("invite.placeholder")}
              />
              {inviteError && (
                <p className="text-[11px] text-destructive">{inviteError}</p>
              )}
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="submit"
                  className="rounded-md bg-foreground px-3 py-1 text-xs font-medium text-background transition hover:bg-foreground/90"
                >
                  {t("invite.continue")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="sticky top-(--header-height) z-40 -mx-4 border-b border-border/40 bg-background/95 px-4 py-4 backdrop-blur supports-backdrop-filter:bg-background/60 lg:top-0">
        <h1 className="font-mono text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {t("title")}
        </h1>
        <p className="mt-2 font-mono text-sm text-foreground/70">{t("intro")}</p>
      </div>

      <div className="mt-8">
        <IvoChat authorized={sessionState === "authorized"} />
      </div>
    </div>
  );
}
