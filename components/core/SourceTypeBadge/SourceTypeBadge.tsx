"use client";

import { ToneBadge, type ToneBadgeProps } from "@/components/design-system/ToneBadge";
import type { AccentTone } from "@/theme/tokens";

type ConfigSourceKind = "direct" | "xtream";

type SourceTypeBadgeProps = Omit<ToneBadgeProps, "tone"> &
  Readonly<{
    kind: ConfigSourceKind;
  }>;

const toneByKind: Record<ConfigSourceKind, AccentTone> = {
  direct: "teal",
  xtream: "violet",
};

/** Maps IPTV config source kinds to design-system chromatic badge tones. */
export function SourceTypeBadge({ kind, ...rest }: SourceTypeBadgeProps) {
  return <ToneBadge tone={toneByKind[kind]} {...rest} />;
}
