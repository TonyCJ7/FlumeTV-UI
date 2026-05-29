/** Persisted shell appearance; manual toggle only (`infra/colorMode/`). */
export const COLOR_MODE_STORAGE_KEY = "flumetv-color-mode";

/** HTTP cookie for SSR theme (same value shape as `localStorage`). */
/** @alias */
export const COLOR_MODE_COOKIE_NAME = COLOR_MODE_STORAGE_KEY;

/** One year — mirrored in bootstrap cookie write. */
export const COLOR_MODE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;
