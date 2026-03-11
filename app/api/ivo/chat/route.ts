import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { streamText } from "ai";
import { createTogetherAI } from "@ai-sdk/togetherai";

import resumeData from "@/data/resume.json";
import { IVO_SYSTEM_PROMPT } from "@/lib/ai/ivo-system-prompt";
import { toModelMessages, type IncomingMessage } from "@/lib/ai/chat-messages";
import { jsonError } from "@/lib/api-utils";
import { createLogger, requestId } from "@/lib/logger";

const AUTH_COOKIE_NAME = "ivo_authorized";
const AUTH_COOKIE_VALUE = "v1";
const DEFAULT_MODEL = "moonshotai/Kimi-K2.5";

export async function POST(request: NextRequest) {
  const id = requestId("ivo");
  const log = createLogger(id);

  log.info("ivo chat POST start");

  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME);

  if (authCookie?.value !== AUTH_COOKIE_VALUE) {
    log.info("auth failed", { hasCookie: !!authCookie });
    return jsonError(
      "You need a valid invite code to talk to Ivo. Reach out on LinkedIn to request access.",
      401,
    );
  }

  let input: unknown;
  try {
    input = await request.json();
  } catch (e) {
    log.error("request body parse error", e);
    return jsonError("Invalid JSON body.", 400);
  }

  const { messages } = input as { messages?: IncomingMessage[] };

  if (!messages || !Array.isArray(messages)) {
    log.info("invalid payload", { hasMessages: !!messages, isArray: Array.isArray(messages) });
    return jsonError("Invalid request payload: messages are required.", 400);
  }

  const modelName = process.env.IVO_MODEL_NAME ?? DEFAULT_MODEL;
  const apiKey = process.env.TOGETHERAI_API_KEY;

  if (!apiKey) {
    log.warn("missing TOGETHERAI_API_KEY");
    return jsonError(
      "Ivo is temporarily offline. Please reach out to the real Iván on LinkedIn instead.",
      503,
    );
  }

  const systemWithResume = [
    IVO_SYSTEM_PROMPT.trim(),
    "",
    "Here is the JSON representation of Iván's resume. Use it as the single source of truth for factual career details:",
    JSON.stringify(resumeData),
  ].join("\n\n");

  const mappedMessages = toModelMessages(messages);

  log.info("calling streamText", { model: modelName, messageCount: mappedMessages.length });

  let result;
  try {
    const provider = createTogetherAI({ apiKey });
    result = await streamText({
      model: provider(modelName),
      messages: [{ role: "system", content: systemWithResume }, ...mappedMessages],
    });
  } catch (e) {
    log.error("streamText failed", e);
    return jsonError(
      "Ivo had trouble thinking. Please try again in a moment.",
      503,
    );
  }

  log.info("streamText ok, building stream response");

  let response: Response;
  try {
    response = result.toUIMessageStreamResponse();
  } catch (e) {
    log.error("toUIMessageStreamResponse failed", e);
    return jsonError(
      "Ivo had trouble sending the reply. Please try again.",
      500,
    );
  }

  log.info("stream response ready");
  return response;
}
