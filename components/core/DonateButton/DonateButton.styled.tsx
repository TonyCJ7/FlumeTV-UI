import MuiButton from "@mui/material/Button";
import { donateColors, donateGradient } from "@/theme/brand";
import { layoutTokens } from "@/theme/tokens";
import styled from "@/utils/styled.utils";

const Button = styled(MuiButton)(({ theme }) => ({
  gap: theme.spacing(2),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  minHeight: 44,
  borderRadius: layoutTokens.radiusMd,
  fontWeight: 600,
  textTransform: "none",
  color: donateColors.onDonate,
  background: donateGradient,
  "&:hover": {
    background: donateGradient,
    filter: "brightness(1.05)",
  },
}));

export const Styled = {
  Button,
} as const;
