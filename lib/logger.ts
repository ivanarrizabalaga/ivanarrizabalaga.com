/**
 * Simple structured logger with levels. Level is read from LOG_LEVEL env at runtime.
 * Use in API routes and server code; logs are JSON for Vercel/log aggregation.
 */

export const LOG_LEVELS = ["debug", "info", "warn", "error"] as const;
export type LogLevel = (typeof LOG_LEVELS)[number];

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

function currentLevel(): number {
  const raw = process.env.LOG_LEVEL?.toLowerCase().trim();
  const level = LOG_LEVELS.includes(raw as LogLevel) ? (raw as LogLevel) : "info";
  return LEVEL_ORDER[level];
}

/** Short id for correlating logs (no PII). */
export function requestId(prefix = "req"): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export type Logger = {
  debug: (msg: string, data?: Record<string, unknown>) => void;
  info: (msg: string, data?: Record<string, unknown>) => void;
  warn: (msg: string, data?: Record<string, unknown>) => void;
  error: (msg: string, err?: unknown) => void;
};

function shouldLog(level: LogLevel): boolean {
  return LEVEL_ORDER[level] >= currentLevel();
}

function write(level: LogLevel, id: string, msg: string, payload: Record<string, unknown>) {
  const line = JSON.stringify({ id, level, msg, ...payload, ts: new Date().toISOString() });
  if (level === "error") {
    console.error(line);
  } else {
    console.log(line);
  }
}

/**
 * Create a logger bound to a request id. Respects LOG_LEVEL env.
 */
export function createLogger(id: string): Logger {
  return {
    debug(msg, data) {
      if (shouldLog("debug")) write("debug", id, msg, (data ?? {}) as Record<string, unknown>);
    },
    info(msg, data) {
      if (shouldLog("info")) write("info", id, msg, (data ?? {}) as Record<string, unknown>);
    },
    warn(msg, data) {
      if (shouldLog("warn")) write("warn", id, msg, (data ?? {}) as Record<string, unknown>);
    },
    error(msg, err) {
      if (shouldLog("error")) {
        write("error", id, msg, {
          error: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined,
        });
      }
    },
  };
}
