import styled from "@/utils/styled.utils";

/** EPG fieldset block (bordered section above EPG fields). */
const EpgFieldset = styled("fieldset")(({ theme }) => ({
  border: 0,
  margin: `${theme.spacing(4)} 0 0`,
  padding: `${theme.spacing(3)} 0 0`,
  borderTop: `1px solid ${theme.palette.divider}`,
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1.5),
}))

const EpgLegend = styled("legend")(({ theme }) => ({
  margin: 0,
  padding: 0,
  typography: "body2",
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

export const Styled = {
  EpgFieldset,
  EpgLegend,
} as const;
