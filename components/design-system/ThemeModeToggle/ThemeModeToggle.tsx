"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useColorMode } from "@/components/providers";
import {
  MOON_MASK_RADIUS,
  Styled,
  SUN_CORE_RADIUS,
  SUN_RAY_INNER,
  SUN_RAY_OUTER,
} from "./ThemeModeToggle.styled";

type ThemeModeToggleProps = Readonly<{
  "aria-label"?: string;
}>;

/** Eight ray directions — degrees, SVG coords (0° = east, 90° = south). */
const SUN_RAY_ANGLES = [-90, -45, 0, 45, 90, 135, 180, 225] as const;

function sunRayEndpoints(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  return {
    x1: 12 + SUN_RAY_OUTER * cos,
    y1: 12 + SUN_RAY_OUTER * sin,
    x2: 12 + SUN_RAY_INNER * cos,
    y2: 12 + SUN_RAY_INNER * sin,
  };
}

/** Header-style light/dark control — single sun icon morphs into moon. */
export function ThemeModeToggle({ "aria-label": ariaLabel }: ThemeModeToggleProps) {
  const { t } = useTranslation();
  const { mode, toggleColorMode } = useColorMode();
  const label = ariaLabel ?? t("Common.ThemeToggle_Label");
  const maskId = useId().replace(/:/g, "");
  const sunRays = SUN_RAY_ANGLES.map((angle) => ({ angle, ...sunRayEndpoints(angle) }));
  const skipSpinRef = useRef(true);
  const [spinIcon, setSpinIcon] = useState(false);

  useEffect(() => {
    if (skipSpinRef.current) {
      skipSpinRef.current = false;
      return;
    }
    setSpinIcon(false);
    const frame = requestAnimationFrame(() => setSpinIcon(true));
    return () => cancelAnimationFrame(frame);
  }, [mode]);

  return (
    <Styled.Toggle type="button" onClick={toggleColorMode} aria-label={label}>
      <Styled.IconSvg
        $mode={mode}
        $spin={spinIcon}
        onAnimationEnd={() => setSpinIcon(false)}
        viewBox="0 0 24 24"
        width={20}
        height={20}
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        focusable="false"
      >
        <defs>
          <mask id={maskId}>
            <rect x="0" y="0" width="24" height="24" fill="white" />
            <Styled.MaskGroup $mode={mode}>
              <circle cx="0" cy="0" r={MOON_MASK_RADIUS} fill="black" />
            </Styled.MaskGroup>
          </mask>
        </defs>

        <Styled.Rays $mode={mode}>
          {sunRays.map(({ angle, x1, y1, x2, y2 }) => (
            <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} />
          ))}
        </Styled.Rays>

        <Styled.DiscGroup $mode={mode}>
          <Styled.Disc
            $mode={mode}
            cx="12"
            cy="12"
            r={SUN_CORE_RADIUS}
            stroke="none"
            mask={`url(#${maskId})`}
          />
        </Styled.DiscGroup>
      </Styled.IconSvg>
    </Styled.Toggle>
  );
}
