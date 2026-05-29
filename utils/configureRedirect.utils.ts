import { CONFIGURE_UUID_QUERY_PARAM } from "@/constants/auth.constants";

/** Parses `?uuid=` from Stremio configure redirect; returns null when absent or blank. */
export function parseConfigureUuidFromSearchParams(searchParams: URLSearchParams): string | null {
  const raw = searchParams.get(CONFIGURE_UUID_QUERY_PARAM);
  if (raw === null) {
    return null;
  }
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/** Client-only read of configure uuid on the current location. */
export function readConfigureUuidFromLocation(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return parseConfigureUuidFromSearchParams(new URLSearchParams(window.location.search));
}
