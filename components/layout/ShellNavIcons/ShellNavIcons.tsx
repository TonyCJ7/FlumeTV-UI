"use client";

/** Shell primary-nav icons (user + list). */
export function ShellNavIconUser() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} focusable="false" aria-hidden>
      <path
        fill="currentColor"
        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
      />
    </svg>
  );
}

export function ShellNavIconList() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} focusable="false" aria-hidden>
      <path
        fill="currentColor"
        d="M4 6h2v2H4V6zm0 5h2v2H4v-2zm0 5h2v2H4v-2zM8 5h12v2H8V5zm0 6h12v2H8v-2zm0 6h12v2H8v-2z"
      />
    </svg>
  );
}
