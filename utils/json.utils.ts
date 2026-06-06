import type { JsonObject } from "@/types/json.types";

export function isJsonObject(value: unknown): value is JsonObject {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function parseJsonObject(raw: string): JsonObject | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    return isJsonObject(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
