import styled from "@/utils/styled.utils";

const AuthForm = styled("form")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  width: "100%",
}));

export const Styled = {
  AuthForm,
} as const;
