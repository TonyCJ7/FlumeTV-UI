import styled from "@/utils/styled.utils";
import { Chip, type ChipProps } from "@mui/material";
import { getAccentTokenSet, type AccentTone } from "@/theme/tokens";

function toneChipStyles(tone: AccentTone, mode: "light" | "dark") {
  const accent = getAccentTokenSet(mode)[tone];
  return {
    height: "auto",
    fontSize: "0.62rem",
    fontWeight: 600,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    padding: "2px 8px",
    opacity: 0.95,
    color: accent.color,
    backgroundColor: accent.background,
    border: `1px solid ${accent.border}`,
    "& .MuiChip-label": {
      padding: 0,
    },
  };
}

const TealChip = styled(Chip)<ChipProps>(({ theme }) => toneChipStyles("teal", theme.palette.mode));

const VioletChip = styled(Chip)<ChipProps>(({ theme }) =>
  toneChipStyles("violet", theme.palette.mode),
);

export const Styled = {
  TealChip,
  VioletChip,
} as const;
