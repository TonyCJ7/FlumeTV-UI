import styled from "@/utils/styled.utils";
import { FormControlLabel, RadioGroup } from "@mui/material";

/** Native-like radio control (`min-width: 1rem`). */
const nativeControlSize = "1rem";

/** Field group legend label. */
const GroupLabel = styled("legend")(({ theme }) => ({
  display: "block",
  width: "100%",
  padding: 0,
  margin: 0,
  marginBottom: theme.spacing(2),
  fontSize: "0.8125rem",
  fontWeight: 600,
  lineHeight: 1.4,
  color: theme.palette.text.primary,
}));

const OptionGroup = styled(RadioGroup)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  "&.MuiRadioGroup-row": {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing(2),
  },
}));

const LabeledControl = styled(FormControlLabel)(({ theme }) => ({
  alignItems: "center",
  margin: 0,
  gap: theme.spacing(2),
  "& .MuiRadio-root": {
    padding: theme.spacing(0.5),
    "& .MuiSvgIcon-root": {
      fontSize: nativeControlSize,
    },
  },
  "& .MuiFormControlLabel-label": {
    fontSize: "0.8125rem",
    lineHeight: 1.4,
    color: theme.palette.text.primary,
  },
}));

export const Styled = {
  GroupLabel,
  OptionGroup,
  LabeledControl,
} as const;
