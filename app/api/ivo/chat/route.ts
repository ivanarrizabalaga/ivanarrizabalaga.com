import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { toModelMessages, type IncomingMessage, type ModelMessage } from "@/lib/ai/chat-messages";
import { jsonError } from "@/lib/api-utils";
import { createLogger, requestId } from "@/lib/logger";
import type { Logger } from "@/lib/logger";

import { IvoChatHandler } from "./ivo-chat-handler";

const AUTH_COOKIE_NAME = "ivo_authorized";
const AUTH_COOKIE_VALUE = "v1";

type CookieStore = Awaited<ReturnType<typeof cookies>>;

/** Returns 401 Response if not authorized, null if OK. */
async function checkAuth(cookieStore: CookieStore, log: Logger): Promise<Response | null> {
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME);
  if (authCookie?.value !== AUTH_COOKIE_VALUE) {
    log.info("auth failed", { hasCookie: !!authCookie });
    return jsonError(
      "You need a valid invite code to talk to Ivo. Reach out on LinkedIn to request access.",
      401,
    );
  }
  return null;
}

/** Returns API key or null (caller should return 503). */
function getApiKey(log: Logger): string | null {
  const apiKey = process.env.TOGETHERAI_API_KEY;
  if (!apiKey) {
    log.warn("missing TOGETHERAI_API_KEY");
    return null;
  }
  return apiKey;
}

/** Parses request body and returns model messages, or an error Response. */
async function fetchUserMessages(
  request: NextRequest,
  log: Logger,
): Promise<ModelMessage[] | Response> {
  let input: unknown;
  try {
    input = await request.json();
  } catch (e) {
    log.error("request body parse error", e);
    return jsonError("Invalid JSON body.", 400);
  }

  const { messages } = input as { messages?: IncomingMessage[] };
  if (!messages || !Array.isArray(messages)) {
    log.info("invalid payload", {
      hasMessages: !!messages,
      isArray: Array.isArray(messages),
    });
    return jsonError("Invalid request payload: messages are required.", 400);
  }

  return toModelMessages(messages);
}

export async function POST(request: NextRequest) {
  const id = requestId("ivo");
  const log = createLogger(id);

  log.info("ivo chat POST start");

  const cookieStore = await cookies();
  const authError = await checkAuth(cookieStore, log);
  if (authError) return authError;

  const apiKey = getApiKey(log);
  if (!apiKey) {
    return jsonError(
      "Ivo is temporarily offline. Please reach out to the real Iván on LinkedIn instead.",
      503,
    );
  }

  const messagesOrError = await fetchUserMessages(request, log);
  if (messagesOrError instanceof Response) return messagesOrError;

  const handler = new IvoChatHandler(log);
  const streamOrError = await handler.sendMessage(apiKey, messagesOrError);
  if (streamOrError instanceof Response) return streamOrError;

  return handler.streamResponse(streamOrError);
}
