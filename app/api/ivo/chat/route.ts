import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { streamText } from "ai";
import { togetherai } from "@ai-sdk/togetherai";

import resumeData from "@/data/resume.json";
import { IVO_SYSTEM_PROMPT } from "@/lib/ai/ivo-system-prompt";

const AUTH_COOKIE_NAME = "ivo_authorized";
const AUTH_COOKIE_VALUE = "v1";

const DEFAULT_MODEL = "zai-org/GLM-5";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME);

  if (authCookie?.value !== AUTH_COOKIE_VALUE) {
    return new Response(
      JSON.stringify({
        error:
          "You need a valid invite code to talk to Ivo. Reach out on LinkedIn to request access.",
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  const input = await request.json();

  const { messages } = input as {
    messages?: { id?: string; role: string; content: string }[];
  };

  if (!messages || !Array.isArray(messages)) {
    return new Response(
      JSON.stringify({ error: "Invalid request payload: messages are required." }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  const modelName = process.env.IVO_MODEL_NAME || DEFAULT_MODEL;
  const apiKey = process.env.TOGETHERAI_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error:
          "Ivo is temporarily offline. Please reach out to the real Iván on LinkedIn instead.",
      }),
      {
        status: 503,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  const resumeJson = resumeData;

  const systemWithResume = [
    IVO_SYSTEM_PROMPT.trim(),
    "",
    "Here is the JSON representation of Iván's resume. Use it as the single source of truth for factual career details:",
    JSON.stringify(resumeJson),
  ].join("\n\n");

  const result = await streamText({
    model: togetherai(modelName, {
      apiKey,
    }),
    messages: [
      {
        role: "system",
        content: systemWithResume,
      },
      ...messages.map((m) => ({
        role: m.role === "user" || m.role === "assistant" ? m.role : "user",
        content: m.content,
      })),
    ],
  });

  return result.toDataStreamResponse();
}

