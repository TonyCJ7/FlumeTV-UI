import { Container } from "@mui/material";
import styled from "@/utils/styled.utils";

const HomeContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

export const Styled = {
  HomeContainer,
} as const;
