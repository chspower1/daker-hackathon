export type JsonParseResult =
  | { ok: true; value: unknown }
  | { ok: false };

export type JsonStringifyResult =
  | { ok: true; value: string }
  | { ok: false };

export function safeJsonParse(rawValue: string): JsonParseResult {
  try {
    return {
      ok: true,
      value: JSON.parse(rawValue),
    };
  } catch {
    return { ok: false };
  }
}

export function safeJsonStringify(value: unknown): JsonStringifyResult {
  try {
    return {
      ok: true,
      value: JSON.stringify(value),
    };
  } catch {
    return { ok: false };
  }
}
