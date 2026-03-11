/**
 * Helpers to normalize incoming chat payloads (e.g. from useChat) into model messages.
 */

export type IncomingMessage = {
  id?: string;
  role: string;
  content?: string;
  parts?: Array<{ type: string; text?: string }>;
};

export type ModelMessage = { role: "user" | "assistant"; content: string };

/** Extract plain text from a message (useChat sends parts, not content). */
export function getMessageText(m: IncomingMessage): string {
  if (typeof m.content === "string") return m.content;
  if (Array.isArray(m.parts))
    return m.parts
      .filter(
        (p): p is { type: "text"; text: string } =>
          p.type === "text" && "text" in p && typeof p.text === "string"
      )
      .map((p) => p.text)
      .join("");
  return "";
}

/** Map and filter incoming messages to model shape; drops empty content. */
export function toModelMessages(messages: IncomingMessage[]): ModelMessage[] {
  return messages
    .map((m) => {
      const role = m.role === "user" || m.role === "assistant" ? m.role : "user";
      const content = getMessageText(m);
      return { role, content };
    })
    .filter((m): m is ModelMessage => m.content.length > 0);
}
