import styled from "@/utils/styled.utils";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { getSegmentTabTokenSet, layoutTokens } from "@/theme/tokens";

const TabGroup = styled(ToggleButtonGroup)(({ theme }) => {
  return {
    padding: "3px",
    gap: 0,
    borderRadius: layoutTokens.radiusMd,
    border: `1px solid ${theme.palette.divider}`,
  };
});

const Tab = styled(ToggleButton)(({ theme }) => {
  const segmentTab = getSegmentTabTokenSet(theme.palette.mode);

  return {
    textTransform: "none",
    typography: "body2",
    fontWeight: 500,
    color: theme.palette.text.secondary,
    borderRadius: `calc(${layoutTokens.radiusMd} - 3px) !important`,
    border: 0,
    "&:hover:not(.Mui-selected)": {
      color: theme.palette.text.primary,
      backgroundColor: "transparent",
    },
    "&.Mui-selected": {
      color: theme.palette.text.primary,
      fontWeight: 600,
      zIndex: 1,
      backgroundColor: segmentTab.selectedBackground,
      boxShadow: segmentTab.selectedBoxShadow,
      "&:hover": {
        backgroundColor: segmentTab.selectedBackground,
      },
    },
  };
});

export const Styled = {
  TabGroup,
  Tab,
} as const;
