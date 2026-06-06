import styled from "@/utils/styled.utils";
import { TextField } from "@mui/material";
import { layoutTokens } from "@/theme/tokens";

const Field = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: layoutTokens.radiusMd,
    "& > fieldset": {
      borderColor: theme.palette.divider,
    },
    "&:not(.Mui-disabled):not(.Mui-focused):not(.Mui-error):hover": {
      "& > fieldset": {
        borderColor: theme.palette.divider,
      },
    },
  },
  "& .MuiFormHelperText-root": {
    paddingTop: 4,
    margin: 0,
  },
  ".MuiInputBase-root": {
    backgroundColor: theme.slate.inputBg,
  },
  ".MuiInputBase-input": {
    paddingTop: "8px",
    paddingBottom: "8px",
    height: "48px",
  },
  ".MuiInputLabel-root": {
    "&:not(.MuiInputLabel-shrink)": {
      transform: "translate(14px, 12px) scale(1)",
    },
  },
}));

export const Styled = {
  Field,
} as const;
