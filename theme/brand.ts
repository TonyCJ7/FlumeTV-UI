/**
 * Product brand accents — not part of the portable design-system package.
 * Donate button styling (`.btn--donate` pattern).
 */
export const donateColors = {
  onDonate: "#ffffff",
  gradientStart: "#12517f",
  gradientMid: "#1f62a2",
  gradientEnd: "#2a9ab9",
} as const;

export const donateGradient = `linear-gradient(135deg, ${donateColors.gradientStart}, ${donateColors.gradientMid}, ${donateColors.gradientEnd})`;
