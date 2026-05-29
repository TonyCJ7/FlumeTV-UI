import { Box } from "@mui/material";
import { Button } from "@/components/design-system/Button/Button";
import { PageViewStyled } from "@/components/layout/PageView";
import styled from "@/utils/styled.utils";

const ConfigPanel = PageViewStyled.PagePanel;

const AddConfigButton = styled(Button)({
  alignSelf: "flex-start",
  flexShrink: 0,
});

/** Prototype `#config-list` — list grid sits below Add configuration with `--space-3` inset. */
const ConfigListRegion = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  minWidth: 0,
}));

export const Styled = {
  PageContainer: PageViewStyled.PageContainer,
  ConfigPanel,
  PanelTitle: PageViewStyled.PanelTitle,
  PanelHint: PageViewStyled.PanelHint,
  PanelInner: PageViewStyled.PanelInner,
  AddConfigButton,
  ConfigListRegion,
} as const;
