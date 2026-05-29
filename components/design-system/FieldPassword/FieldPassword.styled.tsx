import styled from "@/utils/styled.utils";
import { IconButton } from "@mui/material";

const ToggleButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(0.5),
}));

export const Styled = {
  ToggleButton,
} as const;
