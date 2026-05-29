import styled from "@/utils/styled.utils";
import { FormControlLabel } from "@mui/material";

/** Native-like checkbox control (`min-width: 1rem`). */
const nativeControlSize = "1rem";

const LabeledControl = styled(FormControlLabel)(({ theme }) => ({
  alignItems: "center",
  margin: 0,
  gap: theme.spacing(2),
  "& .MuiCheckbox-root": {
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
  LabeledControl,
} as const;
