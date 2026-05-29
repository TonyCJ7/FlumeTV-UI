import {
  COLOR_MODE_COOKIE_MAX_AGE_SECONDS,
  COLOR_MODE_COOKIE_NAME,
  COLOR_MODE_STORAGE_KEY,
} from "@/infra/colorMode/constants";

const KEY_LITERAL = JSON.stringify(COLOR_MODE_STORAGE_KEY);
const COOKIE_NAME_LITERAL = JSON.stringify(COLOR_MODE_COOKIE_NAME);

/**
 * Blocking script in `<head>` — runs before body paint.
 * Resolves mode (localStorage → cookie → OS → dark), sets DOM + cookie for SSR on next load.
 */
export const COLOR_MODE_BOOTSTRAP_SCRIPT = `
(function () {
  try {
    var k = ${KEY_LITERAL};
    var cookieName = ${COOKIE_NAME_LITERAL};
    var m = 'dark';
    var s = localStorage.getItem(k);
    if (s === 'light' || s === 'dark') {
      m = s;
    } else {
      var parts = document.cookie ? document.cookie.split('; ') : [];
      for (var i = 0; i < parts.length; i++) {
        var pair = parts[i].split('=');
        if (pair[0] === cookieName && (pair[1] === 'light' || pair[1] === 'dark')) {
          m = pair[1];
          break;
        }
      }
      if (m === 'dark' && window.matchMedia('(prefers-color-scheme: light)').matches) {
        m = 'light';
      }
    }
    document.documentElement.setAttribute('data-color-mode', m);
    document.documentElement.style.colorScheme = m === 'light' ? 'light' : 'dark';
    var bg = m === 'light' ? '#f4f5f7' : '#0c0e12';
    document.documentElement.style.backgroundColor = bg;
    document.cookie = cookieName + '=' + m + '; path=/; max-age=${COLOR_MODE_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax';
  } catch (e) {}
})();
`.trim();
