import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { streamText } from "ai";
import { createTogetherAI } from "@ai-sdk/togetherai";

import resumeData from "@/data/resume.json";
import { IVO_SYSTEM_PROMPT } from "@/lib/ai/ivo-system-prompt";

const AUTH_COOKIE_NAME = "ivo_authorized";
const AUTH_COOKIE_VALUE = "v1";
const DEFAULT_MODEL = "moonshotai/Kimi-K2.5";

function jsonError(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME);

  if (authCookie?.value !== AUTH_COOKIE_VALUE) {
    return jsonError(
      "You need a valid invite code to talk to Ivo. Reach out on LinkedIn to request access.",
      401,
    );
  }

  const input = await request.json();

  type IncomingMessage = {
    id?: string;
    role: string;
    content?: string;
    parts?: Array<{ type: string; text?: string }>;
  };
  const { messages } = input as { messages?: IncomingMessage[] };

  if (!messages || !Array.isArray(messages)) {
    return jsonError("Invalid request payload: messages are required.", 400);
  }
  /** Extract plain text from a message (useChat sends parts, not content). */
  function getMessageText(m: IncomingMessage): string {
    if (typeof m.content === "string") return m.content;
    if (Array.isArray(m.parts))
      return m.parts
        .filter((p: { type: string; text?: string }): p is { type: "text"; text: string } =>
          p.type === "text" && "text" in p && typeof p.text === "string",
        )
        .map((p) => p.text)
        .join("");
    return "";
  }

  const modelName = process.env.IVO_MODEL_NAME ?? DEFAULT_MODEL;
  const apiKey = process.env.TOGETHERAI_API_KEY;

  if (!apiKey) {
    return jsonError(
      "Ivo is temporarily offline. Please reach out to the real Iván on LinkedIn instead.",
      503,
    );
  }

  const resumeJson = resumeData;

  const systemWithResume = [
    IVO_SYSTEM_PROMPT.trim(),
    "",
    "Here is the JSON representation of Iván's resume. Use it as the single source of truth for factual career details:",
    JSON.stringify(resumeJson),
  ].join("\n\n");

  const provider = createTogetherAI({ apiKey });
  const result = await streamText({
    model: provider(modelName),
    messages: [
      {
        role: "system",
        content: systemWithResume,
      },
      ...messages
        .map((m) => {
          const role = m.role === "user" || m.role === "assistant" ? m.role : "user";
          const content = getMessageText(m);
          return { role, content };
        })
        .filter((m): m is { role: "user" | "assistant"; content: string } => m.content.length > 0),
    ],
  });

  return result.toUIMessageStreamResponse();
}

