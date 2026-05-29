type JsonRecord = Record<string, unknown>;

export function isJsonObject(value: unknown): value is JsonRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function parseJsonObject(raw: string): JsonRecord | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    return isJsonObject(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
