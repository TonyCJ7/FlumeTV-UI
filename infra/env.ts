/**
 * `BASE_API_URL` parsing. Do not expose API secrets via `NEXT_PUBLIC_*`.
 * When unset, returns `''` (API client calls fail until configured).
 */

export function parseBaseApiUrl(raw: string | undefined): string {
  if (raw === undefined || raw.trim() === "") {
    return "";
  }
  const trimmed = raw.trim().replace(/\/+$/, "");
  const url = new URL(trimmed);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`BASE_API_URL must be http(s); got ${url.protocol}`);
  }
  return trimmed;
}
