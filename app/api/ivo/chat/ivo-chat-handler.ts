import { streamText } from "ai";
import { createTogetherAI } from "@ai-sdk/togetherai";

import resumeData from "@/data/resume.json";
import { IVO_SYSTEM_PROMPT } from "@/lib/ai/ivo-system-prompt";
import type { ModelMessage } from "@/lib/ai/chat-messages";
import { jsonError } from "@/lib/api-utils";
import type { Logger } from "@/lib/logger";

const DEFAULT_MODEL = "moonshotai/Kimi-K2.5";

type StreamTextResult = Awaited<ReturnType<typeof streamText>>;

/**
 * Handles only: building the prompt, sending the request to the model, and
 * returning the stream response. Auth, API key, and message parsing are
 * the route’s responsibility.
 */
export class IvoChatHandler {
  private readonly systemWithResume: string;

  constructor(
    private readonly log: Logger,
    private readonly modelName = process.env.IVO_MODEL_NAME ?? DEFAULT_MODEL,
  ) {
    this.systemWithResume = [
      IVO_SYSTEM_PROMPT.trim(),
      "",
      "Here is the JSON representation of Iván's resume. Use it as the single source of truth for factual career details:",
      JSON.stringify(resumeData),
    ].join("\n\n");
  }

  /** Calls the model; returns stream result or 503 Response. */
  async sendMessage(
    apiKey: string,
    messages: ModelMessage[],
  ): Promise<StreamTextResult | Response> {
    this.log.info("calling streamText", {
      model: this.modelName,
      messageCount: messages.length,
    });

    try {
      const provider = createTogetherAI({ apiKey });
      const result = await streamText({
        model: provider(this.modelName),
        messages: [{ role: "system", content: this.systemWithResume }, ...messages],
      });
      this.log.info("streamText ok, building stream response");
      return result;
    } catch (e) {
      this.log.error("streamText failed", e);
      return jsonError(
        "Ivo had trouble thinking. Please try again in a moment.",
        503,
      );
    }
  }

  /** Builds the HTTP stream response, or 500 on failure. */
  streamResponse(result: StreamTextResult): Response {
    try {
      const response = result.toUIMessageStreamResponse();
      this.log.info("stream response ready");
      return response;
    } catch (e) {
      this.log.error("toUIMessageStreamResponse failed", e);
      return jsonError(
        "Ivo had trouble sending the reply. Please try again.",
        500,
      );
    }
  }
}
