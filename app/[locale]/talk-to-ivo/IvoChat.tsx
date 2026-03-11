"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { ArrowUp } from "lucide-react";
import { DefaultChatTransport } from "ai";
import { useTranslations } from "next-intl";
import ReactMarkdown from "react-markdown";

type Props = { authorized: boolean };

function getMessageText(message: { parts: Array<{ type: string; text?: string }> }): string {
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text" && "text" in p)
    .map((p) => p.text)
    .join("");
}

export default function IvoChat({ authorized }: Props) {
  const t = useTranslations("talkToIvo");
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/ivo/chat" }),
  });

  const isLoading = status === "streaming" || status === "submitted";

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault?.();
    const value = input.trim();
    if (!value) return;
    void sendMessage({ text: value });
    setInput("");
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="min-h-[320px] space-y-3 overflow-y-auto rounded-md bg-background/80 p-3 text-sm">

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-md px-3 py-2 leading-relaxed ${
                message.role === "user"
                  ? "bg-foreground text-background"
                  : "bg-muted text-foreground"
              }`}
            >
              {message.role === "assistant" ? (
                <div className="leading-relaxed [&_p]:my-1 [&_p]:whitespace-pre-wrap [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-foreground/40 hover:[&_a]:decoration-foreground [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_code]:font-mono [&_pre]:my-2 [&_pre]:rounded [&_pre]:bg-background/60 [&_pre]:p-2">
                  <ReactMarkdown>{getMessageText(message)}</ReactMarkdown>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{getMessageText(message)}</p>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-foreground/60">
            <span className="h-2 w-2 animate-pulse rounded-full bg-foreground/60" />
            <span>{t("chat.thinking")}</span>
          </div>
        )}

        {error && (
          <div className="rounded border border-destructive/60 bg-destructive/5 p-2 text-xs text-destructive">
            {error.message}
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 rounded-md border border-border/60 bg-background/90 px-2 py-1"
      >
        <input
          className="flex-1 bg-transparent px-2 py-1 text-foreground outline-none placeholder:text-foreground/50"
          placeholder={t("chat.inputPlaceholder")}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={!authorized}
        />
        <button
          type="submit"
          disabled={isLoading || !authorized}
          title={t("chat.sendTooltip")}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArrowUp className="h-4 w-4" aria-hidden />
        </button>
      </form>

      {!authorized && (
        <p className="text-[11px] text-foreground/60">{t("chat.inviteHint")}</p>
      )}
    </div>
  );
}
